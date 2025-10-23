import { connection } from "./connection.js";

export async function criarConta(novoLogin) {
  const comando = `
    INSERT INTO usuario (nome, email, senha, telefone)
               VALUES (?, ?, MD5(?), ?);
  `;

  const [info] = await connection.query(comando, [
    novoLogin.nome,
    novoLogin.email,
    novoLogin.senha,
    novoLogin.telefone || null
  ]);
  return info.insertId;
}

export async function validarCredenciais(email, senha) {
  const comando = `
    SELECT usuario_id,
           nome,
           email
      FROM usuario
     WHERE email = ?
       AND senha = MD5(?)
  `;

  const [registros] = await connection.query(comando, [email, senha]);
  return registros[0];
}



