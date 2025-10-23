import { connection } from './connection.js'

export async function inserirProduto(produto) {
  const comando = `
    INSERT INTO produto (usuario_id, nome, descricao, preco)
    VALUES (?, ?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    produto.usuario_id,
    produto.nome,
    produto.descricao,
    produto.preco,
  ]);
  return info.insertId;
}

export async function listarProdutosAtivos() {
  const comando = `
    SELECT 
      p.produto_id,
      p.nome,
      p.descricao,
      p.preco,
      p.imagem_url,
      p.data_inclusao,
      u.nome AS vendedor_nome,
      u.telefone AS vendedor_telefone
    FROM produto p
    JOIN usuario u ON p.usuario_id = u.usuario_id
    WHERE p.ativo = TRUE
    ORDER BY p.data_inclusao DESC;
  `;
  const [registros] = await connection.query(comando);
  return registros;
}

export async function listarProdutosPorUsuario(usuario_id) {
  const comando = `
    SELECT 
      produto_id,
      nome,
      descricao,
      preco,
      ativo,
      imagem_url,
      data_inclusao
    FROM produto
    WHERE usuario_id = ?
    ORDER BY data_inclusao DESC;
  `;
  const [registros] = await connection.query(comando, [usuario_id]);
  return registros;
}

export async function buscarProduto(produto_id) {
  const comando = `
    SELECT 
      p.produto_id,
      p.nome,
      p.descricao,
      p.preco,
      p.ativo,
      p.imagem_url,
      p.data_inclusao,
      u.usuario_id AS vendedor_id,
      u.nome AS vendedor_nome,
      u.email AS vendedor_email,
      u.telefone AS vendedor_telefone
    FROM produto p
    JOIN usuario u ON p.usuario_id = u.usuario_id
    WHERE p.produto_id = ?;
  `;
  const [registro] = await connection.query(comando, [produto_id]);
  return registro[0];
}

export async function alterarProduto(produto_id, produto) {
  const comando = `
    UPDATE produto 
    SET nome = ?, 
        descricao = ?,
        preco = ?,
        imagem_url = ?
    WHERE produto_id = ?;
  `
  const [registros] = await connection.query(comando, [
    produto.nome,
    produto.descricao,
    produto.preco,
    produto.imagem_url,
    produto_id
  ])
  return registros.affectedRows;
}

export async function alterarStatusProduto(produto_id, ativo) {
  const comando = `
    UPDATE produto 
    SET ativo = ?
    WHERE produto_id = ?;
  `
  const [registros] = await connection.query(comando, [ativo, produto_id])
  return registros.affectedRows;
}

export async function deletarProduto(produto_id) {
  const comando = `
    DELETE FROM produto WHERE produto_id = ?
  `
  const [registro] = await connection.query(comando, [produto_id])
  return registro.affectedRows;
}

export async function atualizarImagemProduto(produto_id, imagem_url) {
  const comando = `
    UPDATE produto 
    SET imagem_url = ?
    WHERE produto_id = ?;
  `
  const [registros] = await connection.query(comando, [imagem_url, produto_id])
  return registros.affectedRows;
}

export async function verificarProprietarioProduto(produto_id, usuario_id) {
  const comando = `
    SELECT COUNT(*) as total 
    FROM produto 
    WHERE produto_id = ? AND usuario_id = ?;
  `;
  const [registro] = await connection.query(comando, [produto_id, usuario_id]);
  return registro[0].total > 0;
}

