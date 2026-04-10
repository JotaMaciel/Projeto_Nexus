const CategoriaDAO = require('../dao/CategoriaDAO');

class CategoriaController {
  async listar(req, res) {
    try {
      const categorias = await CategoriaDAO.listar(req.usuario_id);
      res.json(categorias);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }

  async criar(req, res) {
    try {
      const id = await CategoriaDAO.criar({ usuario_id: req.usuario_id, ...req.body });
      res.status(201).json({ id, mensagem: 'Categoria criada.' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }

  async deletar(req, res) {
    try {
      await CategoriaDAO.deletar(req.params.id, req.usuario_id);
      res.json({ mensagem: 'Categoria removida.' });
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  }
}

module.exports = new CategoriaController();
