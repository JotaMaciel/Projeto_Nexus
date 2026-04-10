const db = require('../config/db');

class CategoriaDAO {
  // Retorna globais + as do usuário
  async listar(usuario_id) {
    const [rows] = await db.execute(
      `SELECT * FROM categorias
       WHERE usuario_id IS NULL OR usuario_id = ?
       ORDER BY tipo, nome`,
      [usuario_id]
    );
    return rows;
  }

  async criar({ usuario_id, nome, tipo, icone }) {
    const [result] = await db.execute(
      'INSERT INTO categorias (usuario_id, nome, tipo, icone) VALUES (?, ?, ?, ?)',
      [usuario_id, nome, tipo, icone ?? null]
    );
    return result.insertId;
  }

  async deletar(id, usuario_id) {
    await db.execute(
      'DELETE FROM categorias WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );
  }
}

module.exports = new CategoriaDAO();
