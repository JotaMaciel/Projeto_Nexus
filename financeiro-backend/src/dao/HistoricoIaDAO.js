const db = require('../config/db');

class HistoricoIaDAO {
  async salvar({ usuario_id, papel, mensagem }) {
    await db.execute(
      'INSERT INTO historico_ia (usuario_id, papel, mensagem) VALUES (?, ?, ?)',
      [usuario_id, papel, mensagem]
    );
  }

  async buscarUltimas(usuario_id, limite = 20) {
    const [rows] = await db.execute(
      `SELECT papel, mensagem, criado_em
       FROM historico_ia
       WHERE usuario_id = ?
       ORDER BY criado_em DESC
       LIMIT ?`,
      [usuario_id, limite]
    );
    return rows.reverse(); // ordem cronológica
  }

  async limpar(usuario_id) {
    await db.execute('DELETE FROM historico_ia WHERE usuario_id = ?', [usuario_id]);
  }
}

module.exports = new HistoricoIaDAO();
