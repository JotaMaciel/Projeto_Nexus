const router       = require('express').Router();
const IaController = require('../controller/IaController');
const autenticar   = require('../middleware/autenticar');

router.use(autenticar);

router.post('/chat',         IaController.chat.bind(IaController));         // RF-09
router.post('/educacional',  IaController.educacional.bind(IaController));  // RF-10
router.delete('/historico',  IaController.limparHistorico.bind(IaController));

module.exports = router;
