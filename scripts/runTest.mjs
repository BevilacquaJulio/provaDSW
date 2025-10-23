import fs from 'fs/promises'
import path from 'path'

const base = 'http://localhost:3000'

async function fetcher(url, opts){
  // try built-in fetch, otherwise dynamic import node-fetch
  if (typeof fetch === 'function') return fetch(url, opts)
  const pkg = await import('node-fetch');
  return pkg.default(url, opts)
}

async function main(){
  console.log('Starting test sequence against', base)

  // 1) create user
  const user = { nome: 'Teste User', email: 'teste@example.com', senha: '123456' }
  await fetcher(base + '/usuario', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(user) })
  console.log('created user')

  // 2) login
  const loginRes = await fetcher(base + '/usuario/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: user.email, senha: user.senha }) })
  const loginJson = await loginRes.json()
  const token = loginJson.token
  console.log('logged in, token length=', (token||'').length)

  // 3) insert product
  const produto = {
    nome: 'Produto de Teste',
    descricao: 'Descrição do produto de teste',
    preco: 99.9,
    imagem_url: '/storage/sample-image.svg'
  }

  await fetcher(base + '/inserir-produto', { method: 'POST', headers: {'Content-Type':'application/json', 'x-access-token': token }, body: JSON.stringify(produto) })
  console.log('produto inserido')

  // 4) fetch produtos
  const listRes = await fetcher(base + '/listar-produtos')
  const listJson = await listRes.json()

  // save result HTML to output/result.html by injecting the JSON
  const outPath = path.resolve('output')
  await fs.mkdir(outPath, { recursive: true })
  const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Test Result</title></head><body><h1>Produtos (JSON)</h1><pre>${JSON.stringify(listJson, null, 2)}</pre></body></html>`
  await fs.writeFile(path.join(outPath, 'result.html'), html, 'utf8')
  console.log('saved output/result.html')
}

main().catch(e=>{ console.error('Test failed', e); process.exit(1) })
