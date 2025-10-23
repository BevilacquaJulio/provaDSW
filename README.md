# 🎯 Prova DSW - API REST Enjoei (Marketplace)

Sistema de marketplace para compra/venda de produtos usados com autenticação JWT.

---

## 🚀 Setup Inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar `.env`
Criar arquivo `.env` na raiz:
```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=provaDB
JWT_SECRET=chavesecreta123
```

### 3. Criar banco de dados
```bash
mysql -u root -p < src/sql/ddl.sql
```

### 4. Iniciar servidor
```bash
npm start
```

---

## 📊 Estrutura do Projeto

```
prova-dsw/
├── package.json                     # Dependências
├── .env                             # Configurações
├── README.md                        # Este arquivo
├── ENDPOINTS-PROVA.md               # Documentação completa dos endpoints
├── MODELAGEM.md                     # Modelagem do banco de dados
├── COMO-USAR-NA-PROVA.md           # Guia rápido para a prova
└── src/
    ├── app.js                       # Servidor Express
    ├── rotas.js                     # Registro de rotas
    ├── controller/
    │   ├── usuarioController.js     # Cadastro e Login
    │   ├── produtoController.js     # CRUD de Produtos
    │   └── propostaController.js    # CRUD de Propostas
    ├── repository/
    │   ├── connection.js            # Conexão MySQL
    │   ├── usuarioRepository.js     # Queries de usuário
    │   ├── produtoRepository.js     # Queries de produto
    │   └── propostaRepository.js    # Queries de proposta
    ├── utils/
    │   └── jwt.js                   # Autenticação JWT
    └── sql/
        └── ddl.sql                  # Script do banco
```

---

## 🎯 Endpoints Implementados

### 🔓 Públicos (sem autenticação)
- `POST /usuario` - Cadastrar usuário
- `POST /usuario/login` - Login (retorna JWT)
- `GET /listar-produtos` - Listar produtos ativos
- `GET /buscar-produto/:id` - Buscar produto específico

### 🔐 Protegidos (requerem token JWT)

#### Produtos:
- `POST /inserir-produto` - Anunciar produto
- `GET /meus-produtos` - Listar meus produtos
- `PUT /alterar-produto/:id` - Alterar produto (apenas dono)
- `DELETE /deletar-produto/:id` - Deletar produto (apenas dono)

#### Propostas:
- `POST /inserir-proposta` - Fazer proposta em produto
- `GET /minhas-propostas` - Listar minhas propostas
- `GET /propostas-produto/:id` - Ver propostas de um produto (apenas vendedor)
- `PUT /responder-proposta/:id` - Aceitar/recusar proposta (apenas vendedor)

---

## 🔐 Autenticação

Todas as rotas protegidas requerem o header:
```
x-access-token: SEU_TOKEN_AQUI
```

Para obter o token, faça login:
```http
POST /usuario/login
Body: { "email": "...", "senha": "..." }
```

---

## 📋 Modelagem do Banco

### Tabelas:
- **usuario** - Dados dos usuários (id, nome, email, senha, telefone)
- **produto** - Produtos anunciados (id, usuario_id, nome, descricao, preco, ativo, imagem_url)
- **proposta** - Propostas feitas (id, produto_id, usuario_id, valor_ofertado, status)

Ver detalhes completos em `MODELAGEM.md`

---

## 🔥 Regras de Negócio

### Produtos:
✅ Apenas produtos ativos aparecem na listagem pública  
✅ Apenas o dono pode alterar/deletar produto  
✅ Quando proposta é aceita, produto fica inativo automaticamente  

### Propostas:
✅ Não pode fazer proposta no próprio produto  
✅ Apenas 1 proposta pendente por usuário/produto  
✅ Produto deve estar ativo para receber propostas  
✅ Apenas o vendedor pode aceitar/recusar propostas  
✅ Valor ofertado deve ser maior que zero  

---

## 📚 Documentação Completa

- **`ENDPOINTS-PROVA.md`** - Todos os endpoints com exemplos de requisição/resposta
- **`MODELAGEM.md`** - Modelagem completa do banco com queries de exemplo
- **`COMO-USAR-NA-PROVA.md`** - Guia rápido de uso durante a prova

---

## 🧪 Exemplo de Uso

### 1. Cadastrar e fazer login
```bash
# Cadastrar
POST /usuario
{ "nome": "João", "email": "joao@email.com", "senha": "123" }

# Login
POST /usuario/login
{ "email": "joao@email.com", "senha": "123" }
→ Resposta: { "token": "..." }
```

### 2. Anunciar produto
```bash
POST /inserir-produto
Header: x-access-token: TOKEN
{ "nome": "iPhone 12", "preco": 2500 }
```

### 3. Fazer proposta (outro usuário)
```bash
POST /inserir-proposta
Header: x-access-token: TOKEN_OUTRO_USUARIO
{ "produto_id": 1, "valor_ofertado": 2200 }
```

### 4. Aceitar proposta (vendedor)
```bash
PUT /responder-proposta/1
Header: x-access-token: TOKEN_VENDEDOR
{ "status": "aceita" }
→ Produto fica inativo automaticamente!
```

---

## ✅ Características Técnicas

- ✅ **Arquitetura:** Controller/Repository
- ✅ **Autenticação:** JWT (padrão do professor)
- ✅ **Validações:** Try-catch em todas as rotas
- ✅ **Segurança:** Senha com MD5, verificação de propriedade
- ✅ **Banco de dados:** MySQL com prepared statements
- ✅ **Código limpo:** Sem comentários desnecessários

---

## 🚀 Pronto para a Prova!

Tudo implementado seguindo os padrões da disciplina e com todas as validações necessárias.

**Boa prova! 🎓**



