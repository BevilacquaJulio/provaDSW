import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { adicionarRotas } from './rotas.js';

const api = express();
api.use(cors())
api.use(express.json())

// Serve arquivos estáticos (imagens, HTML de teste, etc.) a partir de src/public
api.use(express.static(process.cwd() + '/src/public'))

adicionarRotas(api);

// Error handler para capturar erros do multer e outros middlewares
api.use((err, req, resp, next) => {
	if (!err) return next();
	console.error('Erro no middleware:', err.message || err);
	// Multer errors
	if (err instanceof multer.MulterError) {
		return resp.status(400).send({ erro: err.message });
	}

	// Erros lançados manualmente ou outros
	return resp.status(400).send({ erro: err.message || 'Erro ao processar requisição' });
});

const PORT = process.env.PORT || 3000
api.listen(PORT, () => console.log(`--> API subiu na porta ${PORT} <--`))



