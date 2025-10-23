import usuarioController from './controller/usuarioController.js'

export function adicionarRotas(api) {
  api.use(usuarioController);
}



