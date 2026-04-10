const router              = require('express').Router();
const TransacaoController = require('../controller/TransacaoController');
const autenticar          = require('../middleware/autenticar');

router.use(autenticar);

router.post('/',           TransacaoController.criar.bind(TransacaoController));
router.get('/',            TransacaoController.listar.bind(TransacaoController));       // RF-07
router.get('/resumo',      TransacaoController.resumoMensal.bind(TransacaoController)); // RF-05
router.get('/relatorio',   TransacaoController.relatorio.bind(TransacaoController));    // RF-08
router.put('/:id',         TransacaoController.atualizar.bind(TransacaoController));
router.delete('/:id',      TransacaoController.deletar.bind(TransacaoController));

module.exports = router;
