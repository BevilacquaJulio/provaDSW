import { Router } from "express";
import { getAuthentication } from '../utils/jwt.js';
import * as repo from "../repository/produtoRepository.js";
import multer from 'multer';
import path from 'path';

// Configuração do multer para salvar em src/public/storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/src/public/storage');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const mimetypeOK = allowed.test(file.mimetype);
    const extOK = allowed.test(path.extname(file.originalname).toLowerCase());
    if (mimetypeOK && extOK) cb(null, true);
    else cb(new Error('Tipo de arquivo inválido. Aceito: jpeg, jpg, png, gif'));
  }
});

const endpoints = Router();
const autenticador = getAuthentication();

// Endpoint para upload de imagem (autenticado)
endpoints.post('/upload-imagem', autenticador, upload.any(), async (req, resp) => {
  try {
    // multer with upload.any() places files in req.files (array)
    const files = req.files || [];
    if (files.length === 0) {
      return resp.status(400).send({ erro: 'Arquivo não enviado' });
    }

    // pick the first file (Postman: use key 'imagem' or any other key)
    const file = files[0];
    if (!file || !file.filename) {
      return resp.status(400).send({ erro: 'Arquivo inválido' });
    }

    const imagem_url = `/storage/${file.filename}`;
    resp.send({ imagem_url });
  }
  catch (error) {
    console.error('Erro upload imagem:', error);
    // multer errors are handled by the app error handler; here fallback
    resp.status(500).send({ erro: 'Erro ao enviar imagem' });
  }
});

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
    // Filtros via query string: nome, minPreco, maxPreco
    const nome = req.query.nome;
    const minPreco = req.query.minPreco ? Number(req.query.minPreco) : undefined;
    const maxPreco = req.query.maxPreco ? Number(req.query.maxPreco) : undefined;

    // tenta extrair usuário do token (se houver) para excluir seus próprios produtos
    let excluirUsuarioId = undefined;
    try {
      const jwtUtils = await import('../utils/jwt.js');
      const info = jwtUtils.getTokenInfo(req);
      if (info && info.usuario_id) excluirUsuarioId = info.usuario_id;
    } catch (e) {
      // não é crítico
    }

    const filtros = { nome, minPreco, maxPreco, excluirUsuarioId };
    let produtos = await repo.listarProdutosAtivos(filtros);

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

export default endpoints;

