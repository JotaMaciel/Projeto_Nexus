const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  try {
    const token   = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario_id = payload.usuario_id;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;
