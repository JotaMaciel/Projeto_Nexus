const db = require('../config/db');
const Transacao = require('../model/Transacao');

class TransacaoDAO {
  async criar({ usuario_id, categoria_id, tipo, valor, descricao, data }) {
    const [result] = await db.execute(
      `INSERT INTO transacoes (usuario_id, categoria_id, tipo, valor, descricao, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usuario_id, categoria_id, tipo, valor, descricao, data]
    );
    return result.insertId;
  }

  async buscarPorId(id, usuario_id) {
    const [rows] = await db.execute(
      'SELECT * FROM transacoes WHERE id = ? AND usuario_id = ? LIMIT 1',
      [id, usuario_id]
    );
    return rows[0] ? new Transacao(rows[0]) : null;
  }

  // RF-07 — histórico com filtros
  async listar({ usuario_id, tipo, categoria_id, data_inicio, data_fim, limite = 50, offset = 0 }) {
    let sql = `
      SELECT t.*, c.nome AS categoria_nome
      FROM transacoes t
      JOIN categorias c ON c.id = t.categoria_id
      WHERE t.usuario_id = ?
    `;
    const params = [usuario_id];

    if (tipo)         { sql += ' AND t.tipo = ?';         params.push(tipo); }
    if (categoria_id) { sql += ' AND t.categoria_id = ?'; params.push(categoria_id); }
    if (data_inicio)  { sql += ' AND t.data >= ?';        params.push(data_inicio); }
    if (data_fim)     { sql += ' AND t.data <= ?';        params.push(data_fim); }

    sql += ' ORDER BY t.data DESC LIMIT ? OFFSET ?';
    params.push(Number(limite), Number(offset));

    const [rows] = await db.execute(sql, params);
    return rows;
  }

  // RF-05 — resumo mensal (total receitas, despesas e saldo)
  async resumoMensal(usuario_id, mes, ano) {
    const [rows] = await db.execute(
      `SELECT
         tipo,
         SUM(valor) AS total
       FROM transacoes
       WHERE usuario_id = ?
         AND MONTH(data) = ?
         AND YEAR(data)  = ?
       GROUP BY tipo`,
      [usuario_id, mes, ano]
    );

    const resultado = { receitas: 0, despesas: 0, saldo: 0 };
    for (const row of rows) {
      if (row.tipo === 'receita') resultado.receitas = Number(row.total);
      if (row.tipo === 'despesa') resultado.despesas = Number(row.total);
    }
    resultado.saldo = resultado.receitas - resultado.despesas;
    return resultado;
  }

  // RF-08 — gastos agrupados por categoria (para gráficos)
  async gastosPorCategoria(usuario_id, mes, ano) {
    const [rows] = await db.execute(
      `SELECT
         c.nome AS categoria,
         c.icone,
         SUM(t.valor) AS total
       FROM transacoes t
       JOIN categorias c ON c.id = t.categoria_id
       WHERE t.usuario_id = ?
         AND t.tipo = 'despesa'
         AND MONTH(t.data) = ?
         AND YEAR(t.data)  = ?
       GROUP BY t.categoria_id
       ORDER BY total DESC`,
      [usuario_id, mes, ano]
    );
    return rows;
  }

  // RF-08 — evolução de saldo nos últimos N meses
  async evolucaoMensal(usuario_id, meses = 6) {
    const [rows] = await db.execute(
      `SELECT
         YEAR(data)  AS ano,
         MONTH(data) AS mes,
         tipo,
         SUM(valor)  AS total
       FROM transacoes
       WHERE usuario_id = ?
         AND data >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
       GROUP BY ano, mes, tipo
       ORDER BY ano, mes`,
      [usuario_id, meses]
    );
    return rows;
  }

  async atualizar(id, usuario_id, { categoria_id, tipo, valor, descricao, data }) {
    await db.execute(
      `UPDATE transacoes
       SET categoria_id = ?, tipo = ?, valor = ?, descricao = ?, data = ?
       WHERE id = ? AND usuario_id = ?`,
      [categoria_id, tipo, valor, descricao, data, id, usuario_id]
    );
  }

  async deletar(id, usuario_id) {
    const [result] = await db.execute(
      'DELETE FROM transacoes WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new TransacaoDAO();
