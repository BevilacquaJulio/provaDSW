import usuarioController from './controller/usuarioController.js'
import produtoController from './controller/produtoController.js'
import propostaController from './controller/propostaController.js'

export function adicionarRotas(api) {
  api.use(usuarioController);
  api.use(produtoController);
  api.use(propostaController);
}



