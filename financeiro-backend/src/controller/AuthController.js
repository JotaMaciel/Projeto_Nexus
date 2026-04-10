const AuthService = require('../service/AuthService');

class AuthController {
  async registrar(req, res) {
    try {
      const resultado = await AuthService.registrar(req.body);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async login(req, res) {
    try {
      const resultado = await AuthService.login(req.body);
      res.json(resultado);
    } catch (err) {
      res.status(401).json({ erro: err.message });
    }
  }

  async perfil(req, res) {
    try {
      const usuario = await AuthService.atualizarPerfil(req.usuario_id, req.body);
      res.json(usuario);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async trocarSenha(req, res) {
    try {
      await AuthService.trocarSenha(req.usuario_id, req.body);
      res.json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }
}

module.exports = new AuthController();
