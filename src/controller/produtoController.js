import { Router } from "express";
import { getAuthentication } from '../utils/jwt.js';
import * as repo from "../repository/produtoRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.post('/inserir-produto', autenticador, async (req, resp) => {
  try {
    let produto = req.body;
    let usuarioId = req.user.usuario_id;

    if (!produto.nome || !produto.preco) {
      return resp.status(400).send({ 
        erro: 'Campos obrigatórios: nome, preco' 
      });
    }

    if (produto.preco <= 0) {
      return resp.status(400).send({ 
        erro: 'Preço deve ser maior que zero' 
      });
    }

    produto.usuario_id = usuarioId;

    let id = await repo.inserirProduto(produto);

    resp.send({ produto_id: id });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro interno do servidor' 
    });
  }
});

endpoints.get('/listar-produtos', async (req, resp) => {
  try {
    let produtos = await repo.listarProdutosAtivos();

    resp.send({ produtos });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao listar produtos' 
    });
  }
});

endpoints.get('/meus-produtos', autenticador, async (req, resp) => {
  try {
    let usuarioId = req.user.usuario_id;
    let produtos = await repo.listarProdutosPorUsuario(usuarioId);

    resp.send({ produtos });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao listar produtos' 
    });
  }
});

endpoints.get('/buscar-produto/:id', async (req, resp) => {
  try {
    let id = req.params.id;
    let produto = await repo.buscarProduto(id);

    if (!produto) {
      return resp.status(404).send({ 
        erro: "Produto não encontrado" 
      });
    }

    resp.send(produto);

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao buscar produto' 
    });
  }
});

endpoints.put('/alterar-produto/:id', autenticador, async (req, resp) => {
  try {
    let produto = req.body;
    let id = Number(req.params.id);
    let usuarioId = req.user.usuario_id;

    if (!produto.nome || !produto.preco) {
      return resp.status(400).send({ 
        erro: 'Campos obrigatórios: nome, preco' 
      });
    }

    if (produto.preco <= 0) {
      return resp.status(400).send({ 
        erro: 'Preço deve ser maior que zero' 
      });
    }

    const pertence = await repo.verificarProprietarioProduto(id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ 
        erro: 'Você não tem permissão para alterar este produto' 
      });
    }

    const linhasAfetadas = await repo.alterarProduto(id, produto);

    if (linhasAfetadas === 0) {
      return resp.status(404).send({ 
        erro: "Produto não encontrado" 
      });
    }

    resp.send({ idAlterado: id });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao atualizar produto' 
    });
  }
});

endpoints.delete('/deletar-produto/:id', autenticador, async (req, resp) => {
  try {
    let id = req.params.id;
    let usuarioId = req.user.usuario_id;

    const pertence = await repo.verificarProprietarioProduto(id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ 
        erro: 'Você não tem permissão para deletar este produto' 
      });
    }

    let linhasAfetadas = await repo.deletarProduto(id);

    if (linhasAfetadas === 0) {
      return resp.status(404).send({ 
        erro: "Produto não encontrado" 
      });
    }

    resp.send({ produtoIdDeletado: id });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao deletar produto' 
    });
  }
});

endpoints.put('/definir-imagem/:id', autenticador, async (req, resp) => {
  try {
    let produto_id = Number(req.params.id);
    let usuarioId = req.user.usuario_id;
    let { imagem_url } = req.body;

    if (!imagem_url) {
      return resp.status(400).send({ 
        erro: 'Campo obrigatório: imagem_url' 
      });
    }

    // Verificar se o produto pertence ao usuário
    const pertence = await repo.verificarProprietarioProduto(produto_id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ 
        erro: 'Você não tem permissão para alterar este produto' 
      });
    }

    // Atualizar a imagem no banco
    const linhasAfetadas = await repo.atualizarImagemProduto(produto_id, imagem_url);

    if (linhasAfetadas === 0) {
      return resp.status(404).send({ 
        erro: "Produto não encontrado" 
      });
    }

    resp.send({ 
      produto_id,
      imagem_url,
      mensagem: 'Imagem definida com sucesso!'
    });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro ao definir imagem' 
    });
  }
});

export default endpoints;

