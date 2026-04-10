const db = require('../config/db');
const Usuario = require('../model/Usuario');

class UsuarioDAO {
  async criar({ nome, email, senha_hash }) {
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senha_hash]
    );
    return result.insertId;
  }

  async buscarPorEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] ? new Usuario(rows[0]) : null;
  }

  async buscarPorId(id) {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] ? new Usuario(rows[0]) : null;
  }

  async atualizar(id, { nome, email }) {
    await db.execute(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, id]
    );
  }

  async atualizarSenha(id, senha_hash) {
    await db.execute(
      'UPDATE usuarios SET senha_hash = ? WHERE id = ?',
      [senha_hash, id]
    );
  }
}

module.exports = new UsuarioDAO();
