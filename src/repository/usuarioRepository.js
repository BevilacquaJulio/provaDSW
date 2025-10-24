import { connection } from "./connection.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

  // Primeiro tenta bcrypt (novo formato)
  let match = false;
  try {
    match = await bcrypt.compare(senha, usuario.senha);
  } catch (e) {
    match = false;
  }

  // Se bcrypt falhar, tenta comparar MD5 antigo e, se bater, migra para bcrypt
  if (!match) {
    const md5 = crypto.createHash('md5').update(senha).digest('hex');
    if (md5 === usuario.senha) {
      // migra para bcrypt
      const newHash = await bcrypt.hash(senha, 10);
      const upd = `UPDATE usuario SET senha = ? WHERE usuario_id = ?`;
      await connection.query(upd, [newHash, usuario.usuario_id]);
      match = true;
    }
  }

  if (!match) return null;

  // Não retorna a senha para o controller
  return {
    usuario_id: usuario.usuario_id,
    nome: usuario.nome,
    email: usuario.email
  };
}



