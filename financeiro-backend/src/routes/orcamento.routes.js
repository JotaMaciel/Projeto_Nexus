const router              = require('express').Router();
const OrcamentoController = require('../controller/OrcamentoController');
const autenticar          = require('../middleware/autenticar');

router.use(autenticar);

router.post('/',        OrcamentoController.criar.bind(OrcamentoController));
router.get('/',         OrcamentoController.listar.bind(OrcamentoController));
router.get('/status',   OrcamentoController.status.bind(OrcamentoController)); // RF-06
router.delete('/:id',   OrcamentoController.deletar.bind(OrcamentoController));

module.exports = router;
