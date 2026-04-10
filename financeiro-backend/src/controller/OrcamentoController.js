const OrcamentoDAO = require('../dao/OrcamentoDAO');

class OrcamentoController {
  async criar(req, res) {
    try {
      await OrcamentoDAO.criar({ usuario_id: req.usuario_id, ...req.body });
      res.status(201).json({ mensagem: 'Orçamento salvo.' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async listar(req, res) {
    try {
      const agora = new Date();
      const mes   = req.query.mes ?? agora.getMonth() + 1;
      const ano   = req.query.ano ?? agora.getFullYear();
      const dados = await OrcamentoDAO.listarPorMes(req.usuario_id, mes, ano);
      res.json(dados);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async status(req, res) {
    try {
      const agora = new Date();
      const mes   = req.query.mes ?? agora.getMonth() + 1;
      const ano   = req.query.ano ?? agora.getFullYear();
      const dados = await OrcamentoDAO.statusOrcamento(req.usuario_id, mes, ano);
      res.json(dados);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await OrcamentoDAO.deletar(req.params.id, req.usuario_id);
      res.json({ mensagem: 'Orçamento removido.' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }
}

module.exports = new OrcamentoController();
