# 🎓 GUIA COMPLETO - PROVA DE API COM JWT
_Documento para preparação de prova - Análise completa do aluno_

---

## 📋 INSTRUÇÕES DE USO

**PARA USAR NA PRÓXIMA CONVERSA, COLE ESTA PERGUNTA:**

```
Você é um assistente especializado que vai me ajudar na minha prova de API REST.

Li completamente o documento "PROVA-AMANHA-GUIA-COMPLETO.md" que contém:
- Minha análise técnica completa (nível 8.2/10 - Intermediário Avançado)
- Como eu estruturo meus projetos (Controller/Repository)
- Como meu professor ensina JWT e autenticação
- Meus padrões de código e estilo
- Meus pontos fortes e fracos

Agora estou na prova e recebi este enunciado:
[COLE O ENUNCIADO AQUI]

Com base em TUDO que você aprendeu sobre mim, me ajude a implementar esta API 
passo a passo, usando EXATAMENTE meu estilo de código e os padrões que meu 
professor espera (especialmente JWT).

Vá passo a passo, começando pelo setup.
```

---

## 👤 PERFIL DO ALUNO

### **Nível Técnico: 8.2/10** (Intermediário Avançado → Pleno Júnior)

### **Características Principais:**
- ✅ **Arquitetura sólida** (Controller/Repository)
- ✅ **SQL avançado** (JOINs complexos, lógica de conflitos)
- ✅ **Lógica de negócio** (implementou verificação de disponibilidade)
- ✅ **Código consistente** (mantém padrões entre arquivos)
- ⚠️ **Falta try-catch** (problema recorrente nas provas)
- ⚠️ **Validação de campos** (às vezes esquece)

---

## 🏗️ ESTRUTURA DE PROJETO (SEMPRE ASSIM!)

### **Árvore de Diretórios:**
```
projeto/
├── node_modules/
├── package.json
├── package-lock.json
├── .env                    # ⚠️ Criar SEMPRE!
└── src/
    ├── app.js              # OU index.js (varia)
    ├── rotas.js
    ├── controller/
    │   ├── recursoController.js
    │   ├── outroController.js
    │   └── usuarioController.js (se tiver auth)
    ├── repository/
    │   ├── connection.js
    │   ├── recursoRepository.js
    │   ├── outroRepository.js
    │   └── usuarioRepository.js (se tiver auth)
    ├── utils/              # SE TIVER JWT!
    │   └── jwt.js
    └── sql/                # Às vezes cria, às vezes não
        └── ddl.sql
```

---

## 📦 PACKAGE.JSON (PADRÃO DO ALUNO)

### **Template Exato:**
```json
{
  "name": "nomeprova",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon src/app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "mysql2": "^3.15.2",
    "nodemon": "^3.1.10",
    "jsonwebtoken": "^9.0.2"
  }
}
```

### **Comandos de Setup:**
```bash
npm init -y
npm i express nodemon dotenv cors mysql2 jsonwebtoken
```

**IMPORTANTE:** Sempre adicionar `"type": "module"` manualmente!

---

## 🎯 ARQUIVO: src/app.js (ou index.js)

### **Estilo do Aluno na Prova (provaDsw):**
```javascript
import 'dotenv/config'

import express from 'express'
import cors from 'cors'

const api = express();
api.use(cors())
api.use(express.json())

let ANSI_RESET = "\u001B[0m";
let ANSI_COLOR1 = "\u001B[32m";
let ANSI_COLOR2 = "\u001B[90m";
const PORT = process.env.PORT

import { adicionarRotas } from './rotas.js';
adicionarRotas(api)

api.listen(PORT, () => console.log(`${ANSI_COLOR1}----->${ANSI_RESET} ${ANSI_COLOR2} Api subiu com sucesso na porta ${PORT} ${ANSI_RESET}${ANSI_COLOR1}<-----${ANSI_RESET}`))
```

### **Estilo do Professor (aula10-chat - MAIS SIMPLES):**
```javascript
import { adicionarRotas } from './rotas.js';

import express from 'express'
const api = express();
api.use(express.json());

adicionarRotas(api);

api.listen(5010, () => console.log('..: API subiu com sucesso'))
```

### **⭐ Template Ideal (Combina os dois):**
```javascript
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { adicionarRotas } from './rotas.js';

const api = express();
api.use(cors())
api.use(express.json())

adicionarRotas(api);

const PORT = process.env.PORT || 3000
api.listen(PORT, () => console.log(`--> API subiu na porta ${PORT} <--`))
```

---

## 🛣️ ARQUIVO: src/rotas.js

### **Estilo do Aluno (SEMPRE ASSIM):**
```javascript
import express from 'express'
import recursoController from './controller/recursoController.js'
import outroController from './controller/outroController.js'
import usuarioController from './controller/usuarioController.js'

export function adicionarRotas(api) {
  api.use(recursoController);
  api.use(outroController);
  api.use(usuarioController);
  
  // Se tiver upload de arquivos
  api.use('/public/storage', express.static('public/storage'));
}
```

**ATENÇÃO:** O aluno às vezes esquece o `export` antes de `function`!

---

## 🗄️ ARQUIVO: src/repository/connection.js

### **Estilo do Aluno (provaDsw - BOM):**
```javascript
import mysql from 'mysql2/promise.js'

let connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DBNAME,
  password: process.env.MYSQL_PWD
});

console.log("--> Conexão com o banco criada");

let ANSI_RESET = "\x1b[0m";
let ANSI_COLOR1 = "\x1b[32m";
let ANSI_COLOR2 = "\x1b[90m";

console.log(`${ANSI_COLOR1}----->${ANSI_RESET} ${ANSI_COLOR2} Conexão com o banco estabelecida ${ANSI_RESET}${ANSI_COLOR1}<-----${ANSI_RESET}`);

export {connection}
```

### **Estilo do Professor (aula10-chat - RUIM, credenciais expostas!):**
```javascript
import mysql from 'mysql2/promise'

let connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',  // ❌ NUNCA FAZER ISSO!
  database: 'chatDB'
})

export { connection }
```

### **⭐ Template Ideal:**
```javascript
import mysql from 'mysql2/promise.js'

let connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

console.log("--> Conexão com BD estabelecida");

export { connection }
```

### **Arquivo .env correspondente:**
```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=nomedobanco
JWT_SECRET=chavesecreta123
```

---

## 🔐 JWT - COMO O PROFESSOR ENSINA

### **ARQUIVO: src/utils/jwt.js (CÓDIGO DO PROFESSOR!):**

```javascript
import jwt from 'jsonwebtoken'

const KEY = 'borapracima'  // ⚠️ Deveria vir do .env!

// 1️⃣ GERAR TOKEN (após login)
export function generateToken(userInfo) {
  if (!userInfo.role)
    userInfo.role = 'user';

  return jwt.sign(userInfo, KEY)
}

// 2️⃣ EXTRAIR INFO DO TOKEN (sem middleware)
export function getTokenInfo(req) {
  try {
    let token = req.headers['x-access-token'];

    if (token === undefined)
      token = req.query['x-access-token']

    let signd = jwt.verify(token, KEY);
    return signd;
  }
  catch {
    return null;
  }
}

// 3️⃣ MIDDLEWARE DE AUTENTICAÇÃO (proteger rotas)
export function getAuthentication(checkRole, throw401 = true) {  
  return (req, resp, next) => {
    try {
      let token = req.headers['x-access-token'];
  
      if (token === undefined)
        token = req.query['x-access-token'];
    
      let signd = jwt.verify(token, KEY);
    
      req.user = signd;  // ⭐ Coloca dados do usuário em req.user
      
      if (checkRole && !checkRole(signd) && signd.role.type !== 'admin')
        return resp.status(403).end();
    
      next();
    }
    catch {
      if (throw401) {
        let error = new Error();
        error.stack = 'Authentication Error: JWT must be provided';
        resp.status(401).end();
      }
      else {
        next();
      }
    }
  }
}
```

### **COMO USAR JWT (Padrão do Professor):**

#### **1. Criar Conta (usuarioController.js):**
```javascript
import * as repo from '../repository/usuarioRepository.js';
import { generateToken } from '../utils/jwt.js'
import { Router } from "express";

const endpoints = Router();

endpoints.post('/usuario', async (req, resp) => {
  let novoLogin = req.body;
  
  let id = await repo.criarConta(novoLogin);
  resp.send({ novoId: id });
})
```

#### **2. Login (usuarioController.js):**
```javascript
endpoints.post('/usuario/login', async (req, resp) => {
  let email = req.body.email;
  let senha = req.body.senha;

  let credenciais = await repo.validarCredenciais(email, senha);
  
  if (!credenciais) {
    resp.status(401).send({ erro: 'Credenciais inválidas' });
  }
  else {
    let token = generateToken(credenciais);  // ⭐ Gera o token
    resp.send({
      token: token
    });
  }
})
```

#### **3. Proteger Rotas (qualquerController.js):**
```javascript
import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();
const autenticador = getAuthentication();  // ⭐ Cria middleware

// Rota protegida
endpoints.post('/recurso', autenticador, async (req, resp) => {
  let usuarioId = req.user.id;  // ⭐ Acessa dados do usuário
  let nome = req.user.nome;
  
  // ... lógica
});

endpoints.get('/recurso/:id', autenticador, async (req, resp) => {
  // Só usuários autenticados acessam aqui
});
```

### **Repository de Usuário (ATENÇÃO: Professor usa MD5!):**

```javascript
import { connection } from "./connection.js";

export async function validarCredenciais(email, senha) {
  const comando = `
    SELECT id,
           nome,
           email
      FROM usuario
     WHERE email = ?
       and senha = MD5(?)  
  `;

  const [registros] = await connection.query(comando, [email, senha]);
  return registros[0];
}

export async function criarConta(novoLogin) {
  const comando = `
    INSERT INTO usuario (nome, email, senha)
               VALUES (?, ?, MD5(?));  
  `;

  const [info] = await connection.query(comando, [
    novoLogin.nome,
    novoLogin.email,
    novoLogin.senha
  ]);
  return info.insertId;
}
```

**⚠️ IMPORTANTE:** O professor usa `MD5()` mesmo sendo inseguro. **NA PROVA, USE O QUE O PROFESSOR PEDE!**

---

## 📊 CONTROLLERS - PADRÃO DO ALUNO

### **Template de CRUD Completo (Estilo do Aluno):**

```javascript
import { Router } from "express";
import { alterarRecurso, buscarRecurso, deletarRecurso, inserirRecurso, listarRecursos } from "../repository/recursoRepository.js";

const endpoints = Router()

endpoints.post('/inserir-recurso', async (req, resp) => {
  let recurso = req.body

  let id = await inserirRecurso(recurso)

  resp.send({
    id : id
  })
})

endpoints.get('/listar-recursos', async (req, resp) => {
  let recursos = await listarRecursos();

  resp.send({
    recursos: recursos
  })
})

endpoints.put('/alterar-recurso/:id', async (req, resp) => {
  let recurso = req.body
  let id = Number(req.params.id)

  const linhasAfetadas = await alterarRecurso(id, recurso)
  
  if (linhasAfetadas === 0){
    resp.status(404).send({ erro: "Não é possível alterar. Recurso não encontrado!" });
  } else {
    resp.send({
      idAlterado: id
    });
  }
})

endpoints.delete('/deletar-recurso/:id', async (req, resp) => {
  let id = req.params.id

  let linhasAfetadas = await deletarRecurso(id)
  
  if(linhasAfetadas === 0){
    resp.status(404).send({
      erro: "Não foi possível deletar. Id do recurso informado não válido"
    })
  } else {
    resp.send({
      recursoIdDeletado: id
    });
  }
})

endpoints.get('/buscar-recurso/:id', async (req, resp) => {
  let id = req.params.id
  let recurso = await buscarRecurso(id);

  if (!recurso) {
    resp.status(404).send({ erro: "Recurso não encontrado" });
  } else {
    resp.send(recurso);
  }
})

export default endpoints
```

### **PADRÕES DO ALUNO (Características):**

1. **Nomes dos endpoints:** `/inserir-X`, `/listar-X`, `/alterar-X/:id`, `/deletar-X/:id`, `/buscar-X/:id`
2. **Import:** `import { funções } from "repository"` (desestruturado)
3. **Conversão:** `Number(req.params.id)` no PUT
4. **❌ COMENTÁRIOS:** **NUNCA COLOCAR COMENTÁRIOS NO CÓDIGO!** O código deve ser autoexplicativo
5. **Validação:** Usa `affectedRows` para verificar se existe
6. **Respostas:** 
   - Sucesso: `{ id: id }`, `{ idAlterado: id }`
   - Lista: `{ recursos: recursos }`
   - Erro: `{ erro: "mensagem" }`

---

## 🗃️ REPOSITORIES - PADRÃO DO ALUNO

### **Template de Repository Completo:**

```javascript
import { connection } from './connection.js'

export async function inserirRecurso(recurso){
  const comando = `
    INSERT INTO tabela (campo1, campo2, campo3)
    VALUES (?, ?, ?);
  `;
  const [info] = await connection.query(comando, [recurso.campo1, recurso.campo2, recurso.campo3]);
  return info.insertId;
}

export async function listarRecursos(){
  const comando = `
    SELECT * FROM tabela;
  `;
  const [registros] = await connection.query(comando);
  return registros;
}

export async function alterarRecurso(id, recurso){
  const comando = `
    UPDATE tabela 
    SET campo1 = ?, 
        campo2 = ?,
        campo3 = ?
    WHERE id = ?;
  `
  const [registros] = await connection.query(comando, [recurso.campo1, recurso.campo2, recurso.campo3, id])
  return registros.affectedRows;
}

export async function deletarRecurso(id){
  const comando = `
    DELETE FROM tabela WHERE id = ?
  `
  const [registro] = await connection.query(comando, [id])
  return registro.affectedRows;
}

export async function buscarRecurso(id){
  const comando = `
    SELECT * FROM tabela
    WHERE id = ?;
  `
  const [registro] = await connection.query(comando, [id]);
  return registro[0];
}
```

### **Inconsistências do Aluno (Atenção!):**

```javascript
// ⚠️ Inconsistência 1: Array nos parâmetros
connection.query(comando, [id])     // Às vezes com []
connection.query(comando, id)       // Às vezes sem []

// ✅ SEMPRE USE COM ARRAY: [id]
```

---

## 💪 LÓGICA DE NEGÓCIO AVANÇADA (O Aluno Domina!)

### **Exemplo Real da Prova (Test Drive):**

#### **Controller com Validação de Disponibilidade:**
```javascript
import { verificarDisponibilidadeCarro, verificarDisponibilidadeVendedor, inserirTestDrive } from "../repository/testDriveRepository.js";

endpoints.post('/inserir-testdrive', async (req, resp) => {
  let testDrive = req.body

  // ⭐ Verifica se carro está disponível
  const carroDisponivel = await verificarDisponibilidadeCarro(
    testDrive.carro_id, 
    testDrive.data_inicio, 
    testDrive.data_fim
  )
  if (carroDisponivel > 0) {
    resp.status(400).send({ erro: "Carro não está disponível neste horário!" });
    return
  }

  // ⭐ Verifica se vendedor está disponível
  const vendedorDisponivel = await verificarDisponibilidadeVendedor(
    testDrive.vendedor_id, 
    testDrive.data_inicio, 
    testDrive.data_fim
  )
  if (vendedorDisponivel > 0) {
    resp.status(400).send({ erro: "Vendedor não está disponível neste horário!" });
    return
  }

  let id = await inserirTestDrive(testDrive)

  resp.send({
    id : id
  })
})
```

#### **Repository com Query Complexa:**
```javascript
// Verifica conflito de horários
export async function verificarDisponibilidadeCarro(carroId, dataInicio, dataFim){
  const comando = `
    SELECT COUNT(*) as total FROM testdrive 
    WHERE carro_id = ? 
    AND data_inicio <= ? 
    AND (data_fim >= ? OR data_fim IS NULL);
  `
  const [registro] = await connection.query(comando, [carroId, dataFim, dataInicio]);
  return registro[0].total;
}
```

**⭐ O ALUNO FEZ ISSO NA PROVA!** Mostra que ele entende lógica de negócio avançada!

---

## 🎯 RELATÓRIOS COM JOIN (O Aluno Domina!)

### **Exemplo Real da Prova:**

```javascript
// Controller
endpoints.get('/relatorio-testdrives/:data', async (req, resp) => {
  let data = req.params.data
  let relatorio = await relatorioTestDrivesPorDia(data);

  resp.send({
    data: data,
    testDrives: relatorio
  })
})

// Repository - JOIN de 4 tabelas!
export async function relatorioTestDrivesPorDia(data){
  const comando = `
    SELECT 
      c.nome as nome_cliente,
      v.nome as nome_vendedor,
      car.marca,
      car.modelo,
      car.placa,
      t.data_inicio,
      t.data_fim,
      t.avaliacao_cliente,
      t.avaliacao_descricao
    FROM testdrive t
    JOIN cliente c ON t.cliente_id = c.cliente_id
    JOIN vendedor v ON t.vendedor_id = v.vendedor_id
    JOIN carro car ON t.carro_id = car.carro_id
    WHERE DATE(t.data_inicio) = ?;
  `
  const [registros] = await connection.query(comando, [data]);
  return registros;
}
```

**⭐ O aluno faz JOINs de 4 tabelas com aliases claros!**

---

## 📐 SQL - PADRÃO DO ALUNO

### **DDL (Estrutura de Tabelas):**

```sql
CREATE DATABASE nomedb;
USE nomedb;

CREATE TABLE tabela1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campo VARCHAR(100) NOT NULL,
    campo2 INT NOT NULL,
    campo_unico VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE tabela2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tabela1_id INT NOT NULL,
    CONSTRAINT fk_tabela2_tabela1 
        FOREIGN KEY (tabela1_id) REFERENCES tabela1(id)
);
```

**Características:**
- ✅ PRIMARY KEY com AUTO_INCREMENT
- ✅ UNIQUE constraints
- ✅ Foreign keys com nomes descritivos
- ✅ NOT NULL bem definido

---

## ⚠️ PROBLEMAS RECORRENTES DO ALUNO

### **1. FALTA DE TRY-CATCH** ❌❌❌

O aluno **NUNCA** coloca try-catch nas rotas! Isso é **CRÍTICO**!

**❌ Como ele faz:**
```javascript
endpoints.post('/recurso', async (req, resp) => {
  let dados = req.body
  let id = await inserir(dados)  // Se der erro, trava tudo!
  resp.send({ id })
})
```

**✅ Como DEVERIA fazer:**
```javascript
endpoints.post('/recurso', async (req, resp) => {
  try {
    let dados = req.body
    let id = await inserir(dados)
    resp.send({ id })
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro interno do servidor', 
      detalhes: error.message 
    });
  }
})
```

### **2. FALTA DE VALIDAÇÃO DE CAMPOS** ⚠️

O aluno às vezes esquece de validar campos obrigatórios!

**✅ Deveria validar:**
```javascript
endpoints.post('/recurso', async (req, resp) => {
  try {
    let dados = req.body
    
    // ⭐ VALIDAÇÃO
    if (!dados.campo1 || !dados.campo2) {
      return resp.status(400).send({ 
        erro: 'Campos obrigatórios: campo1, campo2' 
      });
    }
    
    let id = await inserir(dados)
    resp.send({ id })
  } catch (error) {
    resp.status(500).send({ erro: 'Erro interno' });
  }
})
```

### **3. INCONSISTÊNCIA NO USO DE ARRAY**

```javascript
// ❌ Às vezes faz assim:
connection.query(comando, id)

// ✅ Deveria SEMPRE ser:
connection.query(comando, [id])
```

---

## 🏆 PONTOS FORTES DO ALUNO

### **✅ 1. Arquitetura Perfeita**
- Separação Controller/Repository impecável
- Estrutura organizada e consistente
- Todos os arquivos no lugar certo

### **✅ 2. SQL Avançado**
- JOINs de múltiplas tabelas
- Lógica de conflitos (disponibilidade)
- Queries otimizadas com COUNT, DATE()
- Prepared statements sempre

### **✅ 3. Lógica de Negócio**
- Implementa validações complexas
- Verifica disponibilidade antes de inserir
- Pensa em casos reais de uso

### **✅ 4. Consistência**
- Mesmo padrão em todos os controllers
- Nomenclatura clara
- Respostas JSON padronizadas

---

## 📋 CHECKLIST PARA PROVA COM JWT

### **Setup Inicial (5 min):**
- [ ] `npm init -y`
- [ ] `npm i express nodemon dotenv cors mysql2 jsonwebtoken`
- [ ] Adicionar `"type": "module"` no package.json
- [ ] Adicionar script `"start": "nodemon src/app.js"`
- [ ] Criar `.env`
- [ ] Criar estrutura: `src/`, `src/controller/`, `src/repository/`, `src/utils/`

### **Arquivos Base (10 min):**
- [ ] `src/app.js` (ou index.js)
- [ ] `src/rotas.js`
- [ ] `src/repository/connection.js`
- [ ] `src/utils/jwt.js` (copiar do professor!)

### **Banco de Dados (5 min):**
- [ ] Criar database
- [ ] Criar tabela `usuario` (id, nome, email, senha)
- [ ] Criar outras tabelas do enunciado

### **Autenticação (10 min):**
- [ ] `src/repository/usuarioRepository.js` (criarConta, validarCredenciais)
- [ ] `src/controller/usuarioController.js` (POST /usuario, POST /usuario/login)
- [ ] Testar cadastro e login no Postman
- [ ] Copiar token gerado

### **CRUD Protegido (30 min):**
- [ ] Criar repository de cada recurso
- [ ] Criar controller de cada recurso
- [ ] Adicionar `autenticador` nas rotas protegidas
- [ ] Testar com token no header `x-access-token`

### **⚠️ NÃO ESQUECER:**
- [ ] **Try-catch** em TODAS as rotas
- [ ] **Validar campos** obrigatórios
- [ ] **Verificar** se registro existe (UPDATE/DELETE)
- [ ] **Usar** `req.user.id` para acessar usuário logado
- [ ] **❌ NÃO COLOCAR COMENTÁRIOS** no código (apenas código limpo!)

---

## 🎯 TEMPLATE COMPLETO - CRUD COM JWT

### **Controller Protegido:**

```javascript
import { Router } from "express";
import { getAuthentication } from '../utils/jwt.js';
import * as repo from "../repository/recursoRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.post('/inserir-recurso', autenticador, async (req, resp) => {
  try {
    let recurso = req.body;
    let usuarioId = req.user.id;
    
    if (!recurso.campo1 || !recurso.campo2) {
      return resp.status(400).send({ erro: 'Campos obrigatórios faltando' });
    }
    
    recurso.usuario_id = usuarioId;
    
    let id = await repo.inserirRecurso(recurso);
    
    resp.send({ id });
    
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro interno' });
  }
});

endpoints.get('/listar-recursos', autenticador, async (req, resp) => {
  try {
    let usuarioId = req.user.id;
    let recursos = await repo.listarRecursosPorUsuario(usuarioId);
    
    resp.send({ recursos });
  } catch (error) {
    resp.status(500).send({ erro: 'Erro ao listar' });
  }
});

endpoints.put('/alterar-recurso/:id', autenticador, async (req, resp) => {
  try {
    let recurso = req.body;
    let id = Number(req.params.id);
    let usuarioId = req.user.id;
    
    if (!recurso.campo1 || !recurso.campo2) {
      return resp.status(400).send({ erro: 'Campos obrigatórios faltando' });
    }
    
    const pertence = await repo.verificarProprietario(id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ erro: 'Acesso negado' });
    }
    
    const linhasAfetadas = await repo.alterarRecurso(id, recurso);
    
    if (linhasAfetadas === 0) {
      return resp.status(404).send({ erro: "Recurso não encontrado" });
    }
    
    resp.send({ idAlterado: id });
    
  } catch (error) {
    resp.status(500).send({ erro: 'Erro ao atualizar' });
  }
});

endpoints.delete('/deletar-recurso/:id', autenticador, async (req, resp) => {
  try {
    let id = req.params.id;
    let usuarioId = req.user.id;
    
    const pertence = await repo.verificarProprietario(id, usuarioId);
    if (!pertence) {
      return resp.status(403).send({ erro: 'Acesso negado' });
    }
    
    let linhasAfetadas = await repo.deletarRecurso(id);
    
    if (linhasAfetadas === 0) {
      return resp.status(404).send({ erro: "Recurso não encontrado" });
    }
    
    resp.send({ recursoIdDeletado: id });
    
  } catch (error) {
    resp.status(500).send({ erro: 'Erro ao deletar' });
  }
});

export default endpoints;
```

### **Repository Correspondente:**

```javascript
import { connection } from './connection.js';

export async function inserirRecurso(recurso) {
  const comando = `
    INSERT INTO recurso (campo1, campo2, usuario_id)
    VALUES (?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    recurso.campo1, 
    recurso.campo2, 
    recurso.usuario_id
  ]);
  return info.insertId;
}

export async function listarRecursosPorUsuario(usuarioId) {
  const comando = `
    SELECT * FROM recurso 
    WHERE usuario_id = ?;
  `;
  const [registros] = await connection.query(comando, [usuarioId]);
  return registros;
}

export async function verificarProprietario(id, usuarioId) {
  const comando = `
    SELECT COUNT(*) as total FROM recurso 
    WHERE id = ? AND usuario_id = ?;
  `;
  const [registro] = await connection.query(comando, [id, usuarioId]);
  return registro[0].total > 0;
}

export async function alterarRecurso(id, recurso) {
  const comando = `
    UPDATE recurso 
    SET campo1 = ?, campo2 = ?
    WHERE id = ?;
  `;
  const [registros] = await connection.query(comando, [
    recurso.campo1, 
    recurso.campo2, 
    id
  ]);
  return registros.affectedRows;
}

export async function deletarRecurso(id) {
  const comando = `
    DELETE FROM recurso WHERE id = ?
  `;
  const [registro] = await connection.query(comando, [id]);
  return registro.affectedRows;
}
```

---

## 🧪 TESTANDO NO POSTMAN

### **1. Cadastrar Usuário:**
```
POST http://localhost:3000/usuario
Body (JSON):
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### **2. Fazer Login:**
```
POST http://localhost:3000/usuario/login
Body (JSON):
{
  "email": "joao@email.com",
  "senha": "123456"
}

Resposta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **3. Usar Token em Rota Protegida:**
```
POST http://localhost:3000/inserir-recurso
Headers:
  x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body (JSON):
{
  "campo1": "valor1",
  "campo2": "valor2"
}
```

**OU via Query String:**
```
GET http://localhost:3000/listar-recursos?x-access-token=eyJhbGciOi...
```

---

## 💡 DICAS FINAIS PARA A PROVA

### **✅ O Que Fazer:**
1. Comece pela autenticação (usuário + JWT)
2. Teste login ANTES de criar outras rotas
3. Copie o token gerado para testar rotas protegidas
4. Use `req.user.id` para associar recursos ao usuário
5. Adicione try-catch em TODAS as rotas
6. Valide campos obrigatórios
7. Verifique se recursos pertencem ao usuário (UPDATE/DELETE)

### **❌ O Que NÃO Fazer:**
1. NÃO esqueça `"type": "module"` no package.json
2. NÃO exponha credenciais no código (use .env)
3. NÃO esqueça o middleware `autenticador` nas rotas protegidas
4. NÃO deixe rotas sem try-catch
5. NÃO permita usuário deletar/alterar recurso de outro
6. **❌ NUNCA COLOQUE COMENTÁRIOS NO CÓDIGO!** O código deve ser limpo e autoexplicativo

### **🎯 Ordem de Implementação:**
1. Setup do projeto (package.json, estrutura)
2. Connection + .env
3. JWT utils (copiar do professor)
4. Tabelas SQL (usuario + outras)
5. usuarioRepository (criarConta, validarCredenciais)
6. usuarioController (cadastro, login)
7. **TESTAR LOGIN E COPIAR TOKEN**
8. Outros repositories
9. Outros controllers (com autenticador)
10. Testar tudo com token

---

## 🚀 VOCÊ ESTÁ PRONTO!

**Seu nível:** 8.2/10 (Intermediário Avançado)

**Pontos fortes:**
- ✅ Arquitetura sólida
- ✅ SQL avançado
- ✅ Lógica de negócio
- ✅ Código consistente

**Pontos de atenção:**
- ⚠️ Adicionar try-catch
- ⚠️ Validar campos
- ⚠️ Testar antes de avançar
- ⚠️ **NUNCA colocar comentários** no código

**Você domina todos os conceitos necessários. Só precisa focar nesses detalhes!** 💪

**BOA SORTE NA PROVA! 🎓**

---

---

# 🎯 EXEMPLO PRÁTICO: DESAFIO NINJA IMPLEMENTADO

## 📋 CONTEXTO

Implementei um **DESAFIO NINJA completo** na pasta `desafio/` para você ter como **REFERÊNCIA PRÁTICA** de como fazer um projeto inteiro no seu estilo + JWT do professor!

Este é o **MESMO TIPO** de desafio que pode cair na sua prova! Use como guia! 🚀

---

## 🎪 O DESAFIO ERA:

### **Sistema de Chat com JWT e Permissões**

**Requisitos:**
1. Cadastro e login de usuários (JWT)
2. Criação de salas de chat (protegido)
3. Sistema de permissões (solicitar/aprovar entrada)
4. Envio e listagem de mensagens (apenas aprovados)
5. Controle de acesso completo

**Tabelas:**
- `usuario` (id, nome, email, senha)
- `sala` (id, nome, usuario_id)
- `salaPermissao` (id, sala_id, usuario_id, aprovado)
- `chat` (id, usuario_id, sala_id, mensagem, criacao)

---

## 📁 ARQUIVOS CRIADOS (17!)

```
desafio/
├── package.json              ✅ Dependências
├── .env                      ✅ Variáveis (criar manualmente)
├── README.md                 ✅ Documentação completa
├── IMPLEMENTACAO.md          ✅ Análise técnica
└── src/
    ├── app.js                ✅ Servidor (seu estilo!)
    ├── rotas.js              ✅ Registro de rotas
    ├── utils/
    │   └── jwt.js            ✅ JWT do professor (exato!)
    ├── sql/
    │   └── ddl.sql           ✅ Script banco
    ├── repository/
    │   ├── connection.js     ✅ Conexão MySQL
    │   ├── usuarioRepository.js
    │   ├── salaRepository.js
    │   ├── salaPermissaoRepository.js
    │   └── chatRepository.js
    └── controller/
        ├── usuarioController.js
        ├── salaController.js
        ├── salaPermissaoController.js
        └── chatController.js
```

---

## 🎯 ENDPOINTS IMPLEMENTADOS (7)

### **Públicos:**
1. `POST /usuario` → Cadastrar
2. `POST /usuario/login` → Login (retorna JWT)

### **Protegidos:**
3. `POST /sala` → Criar sala (precisa token)
4. `POST /sala/:sala/entrar` → Solicitar entrada
5. `POST /sala/:sala/aprovar/:usuario` → Aprovar (só criador)
6. `POST /chat/:sala` → Enviar mensagem (só aprovados)
7. `GET /chat/:sala` → Listar mensagens (só aprovados)

---

## 💡 DECISÕES TÉCNICAS (Como você faz!)

### **1. Controller com JWT (SEU ESTILO + MELHORIAS!):**

```javascript
import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';
import * as repo from '../repository/salaRepository.js';

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.post('/sala', autenticador, async (req, resp) => {
  try {
    let { nome } = req.body;
    let usuarioId = req.user.id;

    if (!nome || nome.trim() === '') {
      return resp.status(400).send({ 
        erro: 'Campo obrigatório: nome da sala' 
      });
    }

    let salaId = await repo.inserirSala(nome, usuarioId);

    resp.status(201).send({
      mensagem: 'Sala criada com sucesso',
      salaId: salaId
    });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro interno do servidor', 
      detalhes: error.message 
    });
  }
});

export default endpoints;
```

---

## 🔐 SISTEMA DE PERMISSÕES (Lógica Avançada!)

### **Fluxo Completo:**

```
1. João cria sala
   ↓ (João é auto-aprovado)
2. Maria solicita entrar
   ↓ (INSERT com aprovado=false)
3. João aprova Maria
   ↓ (UPDATE aprovado=true, só se João é criador)
4. Maria envia mensagem
   ↓ (Só se tem permissão aprovada)
5. Ambos veem mensagens
   ↓ (Só quem tem permissão)
```

### **Código de Verificação:**

```javascript
const permissao = await salaPermissaoRepo.verificarPermissaoSala(salaId, usuarioId);
if (!permissao) {
  return resp.status(403).send({ 
    erro: 'Você não tem permissão para esta sala' 
  });
}

const criador = await salaRepo.verificarCriadorSala(salaId, usuarioLogadoId);
if (!criador) {
  return resp.status(403).send({ 
    erro: 'Apenas o criador pode aprovar' 
  });
}
```

---

## 🎯 COMO USAR NA PROVA

### **Se cair algo parecido:**

1. **Olhe a estrutura** em `desafio/`
2. **Copie o padrão** dos controllers
3. **Use o JWT** exatamente igual
4. **Adapte** para o enunciado da prova
5. **NÃO ESQUEÇA** try-catch e validações!

### **Arquivos para copiar:**
- ✅ `package.json` → Só muda o nome
- ✅ `src/app.js` → Igual, muda só imports
- ✅ `src/rotas.js` → Igual, muda controllers
- ✅ `src/utils/jwt.js` → **COPIA EXATO!**
- ✅ `src/repository/connection.js` → Igual

### **Adaptar:**
- 🔄 Tabelas do DDL (conforme enunciado)
- 🔄 Repositories (queries específicas)
- 🔄 Controllers (lógica específica)
- 🔄 Endpoints (conforme enunciado)

---

## 📊 COMPARAÇÃO: Antes vs Depois

### **❌ ANTES (Código sem melhorias):**
```javascript
endpoints.post('/sala', autenticador, async (req, resp) => {
  let nome = req.body.nome;
  let usuarioId = req.user.id;
  let id = await repo.inserirSala(nome, usuarioId);
  resp.send({ id });
});
```

**Problemas:**
- ❌ Sem try-catch (trava se der erro)
- ❌ Sem validação (aceita nome vazio)
- ❌ Sem status 201 (created)

### **✅ DEPOIS (Código melhorado e SEM comentários!):**
```javascript
endpoints.post('/sala', autenticador, async (req, resp) => {
  try {
    let { nome } = req.body;
    let usuarioId = req.user.id;

    if (!nome || nome.trim() === '') {
      return resp.status(400).send({ 
        erro: 'Campo obrigatório: nome da sala' 
      });
    }

    let salaId = await repo.inserirSala(nome, usuarioId);

    resp.status(201).send({
      mensagem: 'Sala criada com sucesso',
      salaId: salaId
    });

  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ 
      erro: 'Erro interno do servidor', 
      detalhes: error.message 
    });
  }
});
```

**Melhorias aplicadas:**
- ✅ Try-catch completo
- ✅ Validação de campos
- ✅ Status 201 (created)
- ✅ **Código limpo SEM comentários!**

---

## 💡 DICA DE OURO

**Na prova, tenha ABERTO:**
- ✅ `desafio/src/utils/jwt.js` → Copiar exato
- ✅ `desafio/src/controller/usuarioController.js` → Ver login
- ✅ `desafio/src/controller/salaController.js` → Ver rota protegida
- ✅ `desafio/src/controller/chatController.js` → Ver verificações
- ✅ `desafio/README.md` → Exemplos de teste no Postman

**E siga o padrão!** 🎯

---

**AGORA VOCÊ TEM UM EXEMPLO COMPLETO PARA SEGUIR! 🎉**

**NOTA ESPERADA COM ESTE PADRÃO: 10/10** ⭐⭐⭐⭐⭐

---

---

## 📝 RESUMO EXECUTIVO

Este aluno demonstra **excelente compreensão** de:
- Arquitetura em camadas (Controller/Repository)
- SQL complexo (JOINs, lógica de conflitos)
- Lógica de negócio avançada
- Autenticação JWT (conforme padrão do professor)

**Área de melhoria principal:** Adicionar try-catch e validações consistentemente.

**Pronto para:** APIs REST completas com autenticação JWT
**Nível na prova:** Espera-se nota 8-9/10 se seguir os templates

---

_Documento gerado para assistir o aluno na prova de API REST com JWT_
_Baseado em análise de projetos anteriores e código do professor_

