import { Router } from "express";
import * as repo from '../repository/usuarioRepository.js';
import { generateToken } from '../utils/jwt.js'

const endpoints = Router();

endpoints.post('/usuario', async (req, resp) => {
  try {
    let novoLogin = req.body;
    
    if (!novoLogin.nome || !novoLogin.email || !novoLogin.senha) {
      return resp.status(400).send({ 
        erro: 'Campos obrigatórios: nome, email, senha' 
      });
    }

    let id = await repo.criarConta(novoLogin);
    
    resp.send({ novoId: id });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro interno do servidor' });
  }
})

endpoints.post('/usuario/login', async (req, resp) => {
  try {
    let email = req.body.email;
    let senha = req.body.senha;

    let credenciais = await repo.validarCredenciais(email, senha);
    
    if (!credenciais) {
      resp.status(401).send({ erro: 'Credenciais inválidas' });
    }
    else {
      let token = generateToken(credenciais);
      resp.send({
        token: token
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro interno do servidor' });
  }
})

export default endpoints



