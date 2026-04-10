const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UsuarioDAO = require('../dao/UsuarioDAO');

class AuthService {
  async registrar({ nome, email, senha }) {
    const existe = await UsuarioDAO.buscarPorEmail(email);
    if (existe) throw new Error('E-mail já cadastrado.');

    const senha_hash = await bcrypt.hash(senha, 10);
    const id = await UsuarioDAO.criar({ nome, email, senha_hash });

    const usuario = await UsuarioDAO.buscarPorId(id);
    return { usuario: usuario.toPublic(), token: this._gerarToken(id) };
  }

  async login({ email, senha }) {
    const usuario = await UsuarioDAO.buscarPorEmail(email);
    if (!usuario) throw new Error('Credenciais inválidas.');

    const ok = await bcrypt.compare(senha, usuario.senha_hash);
    if (!ok) throw new Error('Credenciais inválidas.');

    return { usuario: usuario.toPublic(), token: this._gerarToken(usuario.id) };
  }

  async atualizarPerfil(id, { nome, email }) {
    await UsuarioDAO.atualizar(id, { nome, email });
    const usuario = await UsuarioDAO.buscarPorId(id);
    return usuario.toPublic();
  }

  async trocarSenha(id, { senha_atual, nova_senha }) {
    const usuario = await UsuarioDAO.buscarPorId(id);
    const ok = await bcrypt.compare(senha_atual, usuario.senha_hash);
    if (!ok) throw new Error('Senha atual incorreta.');

    const senha_hash = await bcrypt.hash(nova_senha, 10);
    await UsuarioDAO.atualizarSenha(id, senha_hash);
  }

  _gerarToken(usuario_id) {
    return jwt.sign({ usuario_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}

module.exports = new AuthService();
