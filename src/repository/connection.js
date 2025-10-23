import mysql from 'mysql2/promise.js'

let connection

try {
  connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })

  console.log("--> Conexão com BD estabelecida")
}
catch (err) {
  console.error('\n[ERRO] Não foi possível conectar ao MySQL.')
  console.error('Verifique as variáveis de ambiente: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE')
  console.error('E confirme que o serviço MySQL está rodando e aceitando conexões.\n')
  console.error(err)
  // encerra o processo para evitar comportamentos inesperados quando não há BD
  process.exit(1)
}

export { connection }



