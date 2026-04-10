const db = require('../config/db');
const Orcamento = require('../model/Orcamento');

class OrcamentoDAO {
  async criar({ usuario_id, categoria_id, mes, ano, limite }) {
    const [result] = await db.execute(
      `INSERT INTO orcamentos (usuario_id, categoria_id, mes, ano, limite)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE limite = VALUES(limite)`,
      [usuario_id, categoria_id ?? null, mes, ano, limite]
    );
    return result.insertId || result.affectedRows;
  }

  async listarPorMes(usuario_id, mes, ano) {
    const [rows] = await db.execute(
      `SELECT o.*, c.nome AS categoria_nome
       FROM orcamentos o
       LEFT JOIN categorias c ON c.id = o.categoria_id
       WHERE o.usuario_id = ? AND o.mes = ? AND o.ano = ?`,
      [usuario_id, mes, ano]
    );
    return rows;
  }

  // RF-06 — compara limite vs gasto real
  async statusOrcamento(usuario_id, mes, ano) {
    const [rows] = await db.execute(
      `SELECT
         o.id,
         o.categoria_id,
         c.nome           AS categoria,
         o.limite,
         COALESCE(SUM(t.valor), 0) AS gasto,
         o.limite - COALESCE(SUM(t.valor), 0) AS disponivel
       FROM orcamentos o
       LEFT JOIN categorias c ON c.id = o.categoria_id
       LEFT JOIN transacoes t
         ON  t.usuario_id   = o.usuario_id
         AND t.tipo         = 'despesa'
         AND (t.categoria_id = o.categoria_id OR o.categoria_id IS NULL)
         AND MONTH(t.data) = o.mes
         AND YEAR(t.data)  = o.ano
       WHERE o.usuario_id = ? AND o.mes = ? AND o.ano = ?
       GROUP BY o.id`,
      [usuario_id, mes, ano]
    );
    return rows;
  }

  async deletar(id, usuario_id) {
    await db.execute(
      'DELETE FROM orcamentos WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );
  }
}

module.exports = new OrcamentoDAO();
