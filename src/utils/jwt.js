import jwt from 'jsonwebtoken'

const KEY = process.env.JWT_SECRET;

if (!KEY) {
  console.error('\n[ERRO] A variável de ambiente JWT_SECRET não está definida.');
  console.error('Defina JWT_SECRET para uma chave forte antes de iniciar a aplicação.\n');
  process.exit(1);
}

export function generateToken(userInfo) {
  // Normaliza role como objeto com type para compatibilidade
  const payload = Object.assign({}, userInfo);
  if (!payload.role) payload.role = { type: 'user' };
  else if (typeof payload.role === 'string') payload.role = { type: payload.role };

  // Assina com expiração
  return jwt.sign(payload, KEY, { expiresIn: '1h' });
}

export function getTokenInfo(req) {
  try {
    let token = null;

    // Suporta Authorization: Bearer <token>
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (auth && auth.startsWith('Bearer ')) token = auth.slice(7);

    if (!token) {
      token = req.headers['x-access-token'];
    }

    if (!token) token = req.query['x-access-token'];

    if (!token) return null;

    let signd = jwt.verify(token, KEY);
    return signd;
  }
  catch {
    return null;
  }
}

export function getAuthentication(checkRole, throw401 = true) {  
  return (req, resp, next) => {
    try {
      let token = null;

      const auth = req.headers['authorization'] || req.headers['Authorization'];
      if (auth && auth.startsWith('Bearer ')) token = auth.slice(7);

      if (!token) token = req.headers['x-access-token'];
      if (!token) token = req.query['x-access-token'];
    
      let signd = jwt.verify(token, KEY);
    
      req.user = signd;

      if (checkRole) {
        // Extrai tipo de role de forma resiliente
        let roleType = null;
        if (signd.role) {
          roleType = typeof signd.role === 'string' ? signd.role : signd.role.type;
        }

        if (!checkRole(signd) && roleType !== 'admin')
          return resp.status(403).end();
      }

      next();
    }
    catch {
      if (throw401) {
        resp.status(401).end();
      }
      else {
        next();
      }
    }
  }
}



