const TransacaoService = require('../service/TransacaoService');

class TransacaoController {
  async criar(req, res) {
    try {
      const transacao = await TransacaoService.registrar(req.usuario_id, req.body);
      res.status(201).json(transacao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async listar(req, res) {
    try {
      const transacoes = await TransacaoService.listar(req.usuario_id, req.query);
      res.json(transacoes);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async resumoMensal(req, res) {
    try {
      const { mes, ano } = req.query;
      const agora = new Date();
      const resultado = await TransacaoService.resumoMensal(
        req.usuario_id,
        mes ?? agora.getMonth() + 1,
        ano ?? agora.getFullYear()
      );
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async relatorio(req, res) {
    try {
      const { mes, ano } = req.query;
      const agora = new Date();
      const dados = await TransacaoService.relatorioGraficos(
        req.usuario_id,
        mes ?? agora.getMonth() + 1,
        ano ?? agora.getFullYear()
      );
      res.json(dados);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const transacao = await TransacaoService.atualizar(req.params.id, req.usuario_id, req.body);
      res.json(transacao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await TransacaoService.deletar(req.params.id, req.usuario_id);
      res.json({ mensagem: 'Transação removida.' });
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
}

module.exports = new TransacaoController();
