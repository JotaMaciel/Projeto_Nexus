const IaService = require('../service/IaService');

class IaController {
  // RF-09 — chat com contexto financeiro
  async chat(req, res) {
    try {
      const { mensagem } = req.body;
      if (!mensagem) return res.status(400).json({ erro: 'Mensagem obrigatória.' });

      const resposta = await IaService.chat(req.usuario_id, mensagem);
      res.json({ resposta });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  // RF-10 — conteúdo educacional sobre investimentos
  async educacional(req, res) {
    try {
      const { topico } = req.body;
      if (!topico) return res.status(400).json({ erro: 'Tópico obrigatório.' });

      const conteudo = await IaService.educacional(req.usuario_id, topico);
      res.json({ conteudo });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async limparHistorico(req, res) {
    try {
      await IaService.limparHistorico(req.usuario_id);
      res.json({ mensagem: 'Histórico de conversa limpo.' });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
}

module.exports = new IaController();
