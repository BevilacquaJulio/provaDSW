# Prova DSW - API REST com JWT

## Setup Inicial

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
Criar arquivo `.env` na raiz com:
```
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=provaDB
JWT_SECRET=chavesecreta123
```

3. Executar o script SQL:
```bash
mysql -u root -p < src/sql/ddl.sql
```

4. Iniciar o servidor:
```bash
npm start
```

## Estrutura do Projeto

```
prova-dsw/
├── package.json
├── .env
├── .gitignore
├── README.md
└── src/
    ├── app.js
    ├── rotas.js
    ├── controller/
    │   └── usuarioController.js
    ├── repository/
    │   ├── connection.js
    │   └── usuarioRepository.js
    ├── utils/
    │   └── jwt.js
    └── sql/
        └── ddl.sql
```

## Endpoints Disponíveis

### Cadastro
```
POST /usuario
Body: { "nome": "...", "email": "...", "senha": "..." }
```

### Login
```
POST /usuario/login
Body: { "email": "...", "senha": "..." }
Response: { "token": "..." }
```

## Como testar rotas protegidas

Adicionar header em todas as requisições protegidas:
```
x-access-token: [TOKEN_AQUI]
```

Ou via query string:
```
GET /rota?x-access-token=[TOKEN_AQUI]
```



