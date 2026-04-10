const router              = require('express').Router();
const CategoriaController = require('../controller/CategoriaController');
const autenticar          = require('../middleware/autenticar');

router.use(autenticar);

router.get('/',       CategoriaController.listar.bind(CategoriaController));  // RF-04
router.post('/',      CategoriaController.criar.bind(CategoriaController));
router.delete('/:id', CategoriaController.deletar.bind(CategoriaController));

module.exports = router;
