import { connection } from "./connection.js";
import bcrypt from 'bcryptjs';

export async function criarConta(novoLogin) {
  // Verifica se email já existe
  const check = `SELECT COUNT(*) AS total FROM usuario WHERE email = ?`;
  const [rows] = await connection.query(check, [novoLogin.email]);
  if (rows[0].total > 0) {
    // sinaliza duplicidade para o controller
    return { duplicate: true };
  }

  const hashed = await bcrypt.hash(novoLogin.senha, 10);

  const comando = `
    INSERT INTO usuario (nome, email, senha)
               VALUES (?, ?, ?);
  `;

  const [info] = await connection.query(comando, [
    novoLogin.nome,
    novoLogin.email,
    hashed
  ]);
  return { insertId: info.insertId };
}

export async function validarCredenciais(email, senha) {
  const comando = `
    SELECT usuario_id,
           nome,
           email,
           senha
      FROM usuario
     WHERE email = ?
  `;

  const [registros] = await connection.query(comando, [email]);
  const usuario = registros[0];
  if (!usuario) return null;

  const match = await bcrypt.compare(senha, usuario.senha);
  if (!match) return null;

  // Não retorna a senha para o controller
  return {
    usuario_id: usuario.usuario_id,
    nome: usuario.nome,
    email: usuario.email
  };
}



