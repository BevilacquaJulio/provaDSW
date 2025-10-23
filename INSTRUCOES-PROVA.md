# 📝 INSTRUÇÕES PARA A PROVA

## ✅ Estrutura Base já está PRONTA!

A estrutura básica do projeto já está criada com:
- ✅ `package.json` configurado
- ✅ Autenticação JWT completa (usuário + login)
- ✅ Try-catch em todas as rotas
- ✅ Conexão com banco configurada
- ✅ Arquitetura Controller/Repository

---

## 🚀 ANTES DE COMEÇAR A PROVA

### 1. Instalar dependências:
```bash
npm install
```

### 2. Criar arquivo `.env` na raiz:
```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=1234
MYSQL_DATABASE=provaDB
JWT_SECRET=chavesecreta123
```

### 3. Executar o SQL base:
```bash
mysql -u root -p < src/sql/ddl.sql
```

### 4. Testar se está funcionando:
```bash
npm start
```

---

## 📋 QUANDO RECEBER O ENUNCIADO

### PASSO 1: Ajustar o DDL (src/sql/ddl.sql)
- Criar as tabelas que o enunciado pedir
- Manter a tabela `usuario` que já existe

### PASSO 2: Para cada recurso do enunciado, criar:

#### A) Repository (src/repository/recursoRepository.js)
```javascript
import { connection } from './connection.js'

export async function inserirRecurso(recurso) {
  const comando = `
    INSERT INTO tabela (campo1, campo2)
    VALUES (?, ?);
  `;
  const [info] = await connection.query(comando, [recurso.campo1, recurso.campo2]);
  return info.insertId;
}

export async function listarRecursos() {
  const comando = `
    SELECT * FROM tabela;
  `;
  const [registros] = await connection.query(comando);
  return registros;
}

export async function alterarRecurso(id, recurso) {
  const comando = `
    UPDATE tabela 
    SET campo1 = ?, 
        campo2 = ?
    WHERE id = ?;
  `
  const [registros] = await connection.query(comando, [recurso.campo1, recurso.campo2, id])
  return registros.affectedRows;
}

export async function deletarRecurso(id) {
  const comando = `
    DELETE FROM tabela WHERE id = ?
  `
  const [registro] = await connection.query(comando, [id])
  return registro.affectedRows;
}

export async function buscarRecurso(id) {
  const comando = `
    SELECT * FROM tabela
    WHERE id = ?;
  `
  const [registro] = await connection.query(comando, [id]);
  return registro[0];
}
```

#### B) Controller (src/controller/recursoController.js)
```javascript
import { Router } from "express";
import { getAuthentication } from '../utils/jwt.js';
import * as repo from "../repository/recursoRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.post('/inserir-recurso', autenticador, async (req, resp) => {
  try {
    let recurso = req.body;
    
    if (!recurso.campo1 || !recurso.campo2) {
      return resp.status(400).send({ erro: 'Campos obrigatórios faltando' });
    }
    
    let id = await repo.inserirRecurso(recurso);
    
    resp.send({ id });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro interno do servidor' });
  }
});

endpoints.get('/listar-recursos', autenticador, async (req, resp) => {
  try {
    let recursos = await repo.listarRecursos();
    
    resp.send({ recursos });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro ao listar' });
  }
});

endpoints.put('/alterar-recurso/:id', autenticador, async (req, resp) => {
  try {
    let recurso = req.body;
    let id = Number(req.params.id);
    
    if (!recurso.campo1 || !recurso.campo2) {
      return resp.status(400).send({ erro: 'Campos obrigatórios faltando' });
    }
    
    const linhasAfetadas = await repo.alterarRecurso(id, recurso);
    
    if (linhasAfetadas === 0) {
      return resp.status(404).send({ erro: "Recurso não encontrado" });
    }
    
    resp.send({ idAlterado: id });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro ao atualizar' });
  }
});

endpoints.delete('/deletar-recurso/:id', autenticador, async (req, resp) => {
  try {
    let id = req.params.id;
    
    let linhasAfetadas = await repo.deletarRecurso(id);
    
    if (linhasAfetadas === 0) {
      return resp.status(404).send({ erro: "Recurso não encontrado" });
    }
    
    resp.send({ recursoIdDeletado: id });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro ao deletar' });
  }
});

endpoints.get('/buscar-recurso/:id', autenticador, async (req, resp) => {
  try {
    let id = req.params.id;
    let recurso = await repo.buscarRecurso(id);
    
    if (!recurso) {
      return resp.status(404).send({ erro: "Recurso não encontrado" });
    }
    
    resp.send(recurso);
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro ao buscar' });
  }
});

export default endpoints;
```

#### C) Registrar no rotas.js
```javascript
import recursoController from './controller/recursoController.js'

export function adicionarRotas(api) {
  api.use(usuarioController);
  api.use(recursoController);  // ← ADICIONAR AQUI
}
```

---

## 🔐 ROTAS PROTEGIDAS vs PÚBLICAS

### Públicas (SEM autenticador):
- Cadastro de usuário: `POST /usuario`
- Login: `POST /usuario/login`

### Protegidas (COM autenticador):
- Todas as outras rotas devem ter `autenticador` como segundo parâmetro

---

## 📊 SE PEDIR JOIN/RELATÓRIO

```javascript
// Repository
export async function relatorioCompleto(filtro) {
  const comando = `
    SELECT 
      t1.campo1,
      t2.campo2,
      t3.campo3
    FROM tabela1 t1
    JOIN tabela2 t2 ON t1.id = t2.tabela1_id
    JOIN tabela3 t3 ON t2.id = t3.tabela2_id
    WHERE t1.algum_campo = ?;
  `
  const [registros] = await connection.query(comando, [filtro]);
  return registros;
}

// Controller
endpoints.get('/relatorio/:filtro', autenticador, async (req, resp) => {
  try {
    let filtro = req.params.filtro;
    let relatorio = await repo.relatorioCompleto(filtro);
    
    resp.send({ dados: relatorio });
  } catch (error) {
    console.error('Erro:', error);
    resp.status(500).send({ erro: 'Erro ao gerar relatório' });
  }
});
```

---

## ⚠️ CHECKLIST FINAL

- [ ] Todas as rotas têm try-catch?
- [ ] Todas as rotas protegidas têm `autenticador`?
- [ ] Validei campos obrigatórios?
- [ ] Usei `affectedRows` para verificar UPDATE/DELETE?
- [ ] Testei no Postman com o token?
- [ ] ❌ NÃO coloquei comentários desnecessários?

---

## 🧪 TESTANDO NO POSTMAN

1. Cadastrar usuário:
```
POST http://localhost:3000/usuario
Body: { "nome": "Teste", "email": "teste@email.com", "senha": "123" }
```

2. Fazer login:
```
POST http://localhost:3000/usuario/login
Body: { "email": "teste@email.com", "senha": "123" }
```

3. Copiar o token da resposta

4. Testar rota protegida:
```
POST http://localhost:3000/inserir-recurso
Header: x-access-token = [COLAR TOKEN AQUI]
Body: { ... }
```

---

## 🎯 BOA PROVA! 🚀

