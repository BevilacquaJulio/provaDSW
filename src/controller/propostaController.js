import { Router } from "express";
import { getAuthentication } from '../utils/jwt.js';
import * as repo from "../repository/propostaRepository.js";
import * as produtoRepo from "../repository/produtoRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.post('/inserir-proposta', autenticador, async (req, resp) => {
  try {
    let proposta = req.body;
    let usuarioId = req.user.usuario_id;

    if (!proposta.produto_id || !proposta.valor_ofertado) {
      return resp.status(400).send({ 
        erro: 'Campos obrigatórios: produto_id, valor_ofertado' 
      });
    }

    if (proposta.valor_ofertado <= 0) {
      return resp.status(400).send({ 
        erro: 'Valor ofertado deve ser maior que zero' 
      });
    }

    const produto = await produtoRepo.buscarProduto(proposta.produto_id);
    if (!produto) {
      return resp.status(404).send({ 
        erro: 'Produto não encontrado' 
      });
    }

    if (!produto.ativo) {
      return resp.status(400).send({ 
        erro: 'Produto não está mais disponível' 
      });
    }

    if (produto.vendedor_id === usuarioId) {
      return resp.status(400).send({ 
        erro: 'Você não pode fazer proposta no seu próprio produto' 
      });
    }

    const jaFezProposta = await repo.verificarPropostaExistente(proposta.produto_id, usuarioId);
    if (jaFezProposta) {
      return resp.status(400).send({ 
        erro: 'Você já possui uma proposta pendente neste produto' 
      });
    }

    proposta.usuario_id = usuarioId;

    let id = await repo.inserirProposta(proposta);

    resp.send({ proposta_id: id });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro interno do servidor' 
    });
  }
});

endpoints.get('/minhas-propostas', autenticador, async (req, resp) => {
  try {
    let usuarioId = req.user.usuario_id;
    let propostas = await repo.listarPropostasPorUsuario(usuarioId);

    resp.send({ propostas });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao listar propostas' 
    });
  }
});

endpoints.get('/propostas-produto/:id', autenticador, async (req, resp) => {
  try {
    let produto_id = req.params.id;
    let usuarioId = req.user.usuario_id;

    const pertence = await produtoRepo.verificarProprietarioProduto(produto_id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ 
        erro: 'Apenas o dono do produto pode ver suas propostas' 
      });
    }

    let propostas = await repo.listarPropostasPorProduto(produto_id);

    resp.send({ propostas });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao listar propostas' 
    });
  }
});

endpoints.put('/responder-proposta/:id', autenticador, async (req, resp) => {
  try {
    let proposta_id = Number(req.params.id);
    let { status } = req.body;
    let usuarioId = req.user.usuario_id;

    if (!status) {
      return resp.status(400).send({ 
        erro: 'Campo obrigatório: status' 
      });
    }

    if (status !== 'aceita' && status !== 'recusada') {
      return resp.status(400).send({ 
        erro: 'Status inválido. Use: aceita ou recusada' 
      });
    }

    const proposta = await repo.buscarProposta(proposta_id);
    if (!proposta) {
      return resp.status(404).send({ 
        erro: 'Proposta não encontrada' 
      });
    }

    const ehVendedor = await repo.verificarProprietarioVendedor(proposta_id, usuarioId);
    if (!ehVendedor) {
      return resp.status(403).send({ 
        erro: 'Apenas o dono do produto pode responder propostas' 
      });
    }

    const statusAnterior = proposta.status;

    const linhasAfetadas = await repo.responderProposta(proposta_id, status);

    if (linhasAfetadas === 0) {
      return resp.status(404).send({ 
        erro: "Proposta não encontrada" 
      });
    }

    if (status === 'aceita' && statusAnterior !== 'aceita') {
      await produtoRepo.alterarStatusProduto(proposta.produto_id, false);
    } else if (status === 'recusada' && statusAnterior === 'aceita') {
      await produtoRepo.alterarStatusProduto(proposta.produto_id, true);
    }

    let mensagem = '';
    if (statusAnterior === status) {
      mensagem = `Proposta mantida como ${status}`;
    } else if (statusAnterior === 'pendente') {
      mensagem = status === 'aceita' ? 'Proposta aceita com sucesso!' : 'Proposta recusada';
    } else {
      mensagem = `Proposta alterada de ${statusAnterior} para ${status}`;
    }

    resp.send({ 
      proposta_id,
      status_anterior: statusAnterior,
      status_novo: status,
      mensagem
    });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao responder proposta' 
    });
  }
});

export default endpoints;

