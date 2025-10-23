import { connection } from './connection.js'

export async function inserirProposta(proposta) {
  const comando = `
    INSERT INTO proposta (produto_id, usuario_id, valor_ofertado)
    VALUES (?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    proposta.produto_id,
    proposta.usuario_id,
    proposta.valor_ofertado
  ]);
  return info.insertId;
}

export async function listarPropostasPorUsuario(usuario_id) {
  const comando = `
    SELECT 
      p.proposta_id,
      p.valor_ofertado,
      p.status,
      p.data_proposta,
      prod.produto_id,
      prod.nome AS produto_nome,
      prod.preco AS preco_original,
      prod.imagem_url AS produto_imagem,
      u.nome AS vendedor_nome,
      u.telefone AS vendedor_telefone
    FROM proposta p
    JOIN produto prod ON p.produto_id = prod.produto_id
    JOIN usuario u ON prod.usuario_id = u.usuario_id
    WHERE p.usuario_id = ?
    ORDER BY p.data_proposta DESC;
  `;
  const [registros] = await connection.query(comando, [usuario_id]);
  return registros;
}

export async function listarPropostasPorProduto(produto_id) {
  const comando = `
    SELECT 
      p.proposta_id,
      p.valor_ofertado,
      p.status,
      p.data_proposta,
      u.usuario_id,
      u.nome AS comprador_nome,
      u.email AS comprador_email,
      u.telefone AS comprador_telefone
    FROM proposta p
    JOIN usuario u ON p.usuario_id = u.usuario_id
    WHERE p.produto_id = ?
    ORDER BY p.data_proposta DESC;
  `;
  const [registros] = await connection.query(comando, [produto_id]);
  return registros;
}

export async function buscarProposta(proposta_id) {
  const comando = `
    SELECT 
      p.proposta_id,
      p.produto_id,
      p.usuario_id,
      p.valor_ofertado,
      p.status,
      p.data_proposta,
      prod.usuario_id AS vendedor_id
    FROM proposta p
    JOIN produto prod ON p.produto_id = prod.produto_id
    WHERE p.proposta_id = ?;
  `;
  const [registro] = await connection.query(comando, [proposta_id]);
  return registro[0];
}

export async function responderProposta(proposta_id, status) {
  const comando = `
    UPDATE proposta 
    SET status = ?
    WHERE proposta_id = ?;
  `
  const [registros] = await connection.query(comando, [status, proposta_id])
  return registros.affectedRows;
}

export async function verificarPropostaExistente(produto_id, usuario_id) {
  const comando = `
    SELECT COUNT(*) as total 
    FROM proposta 
    WHERE produto_id = ? 
      AND usuario_id = ? 
      AND status = 'pendente';
  `;
  const [registro] = await connection.query(comando, [produto_id, usuario_id]);
  return registro[0].total > 0;
}

export async function verificarProprietarioVendedor(proposta_id, usuario_id) {
  const comando = `
    SELECT COUNT(*) as total 
    FROM proposta p
    JOIN produto prod ON p.produto_id = prod.produto_id
    WHERE p.proposta_id = ? 
      AND prod.usuario_id = ?;
  `;
  const [registro] = await connection.query(comando, [proposta_id, usuario_id]);
  return registro[0].total > 0;
}

