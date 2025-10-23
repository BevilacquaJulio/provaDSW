import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { adicionarRotas } from './rotas.js';

const api = express();
api.use(cors())
api.use(express.json())

// Serve arquivos estáticos (imagens, HTML de teste, etc.) a partir de src/public
api.use(express.static(process.cwd() + '/src/public'))

adicionarRotas(api);

const PORT = process.env.PORT || 3000
api.listen(PORT, () => console.log(`--> API subiu na porta ${PORT} <--`))



