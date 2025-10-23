CREATE DATABASE IF NOT EXISTS provaDB;
USE provaDB;

CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produto (
    produto_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_inclusao DATETIME DEFAULT CURRENT_TIMESTAMP,
    imagem_url VARCHAR(500),
    CONSTRAINT fk_produto_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

CREATE TABLE proposta (
    proposta_id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    valor_ofertado DECIMAL(10, 2) NOT NULL,
    status ENUM('pendente', 'aceita', 'recusada') DEFAULT 'pendente',
    data_proposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proposta_produto
        FOREIGN KEY (produto_id) REFERENCES produto(produto_id),
    CONSTRAINT fk_proposta_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);



