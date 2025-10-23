import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { adicionarRotas } from './rotas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();
api.use(cors())
api.use(express.json())

// Servir arquivos estáticos da pasta public
api.use('/public', express.static(path.join(__dirname, '../public')));

adicionarRotas(api);

const PORT = process.env.PORT || 3000
api.listen(PORT, () => console.log(`--> API subiu na porta ${PORT} <--`))



