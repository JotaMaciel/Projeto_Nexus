const TransacaoDAO = require('../dao/TransacaoDAO');

class TransacaoService {
  async registrar(usuario_id, dados) {
    const id = await TransacaoDAO.criar({ usuario_id, ...dados });
    return TransacaoDAO.buscarPorId(id, usuario_id);
  }

  async listar(usuario_id, filtros) {
    return TransacaoDAO.listar({ usuario_id, ...filtros });
  }

  async resumoMensal(usuario_id, mes, ano) {
    return TransacaoDAO.resumoMensal(usuario_id, mes, ano);
  }

  async relatorioGraficos(usuario_id, mes, ano) {
    const [porCategoria, evolucao] = await Promise.all([
      TransacaoDAO.gastosPorCategoria(usuario_id, mes, ano),
      TransacaoDAO.evolucaoMensal(usuario_id),
    ]);
    return { por_categoria: porCategoria, evolucao };
  }

  async atualizar(id, usuario_id, dados) {
    await TransacaoDAO.atualizar(id, usuario_id, dados);
    return TransacaoDAO.buscarPorId(id, usuario_id);
  }

  async deletar(id, usuario_id) {
    const ok = await TransacaoDAO.deletar(id, usuario_id);
    if (!ok) throw new Error('Transação não encontrada.');
  }
}

module.exports = new TransacaoService();
