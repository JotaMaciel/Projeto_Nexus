const router         = require('express').Router();
const AuthController = require('../controller/AuthController');
const autenticar     = require('../middleware/autenticar');

// Públicas
router.post('/registrar', AuthController.registrar.bind(AuthController));
router.post('/login',     AuthController.login.bind(AuthController));

// Protegidas
router.put('/perfil',       autenticar, AuthController.perfil.bind(AuthController));
router.put('/trocar-senha', autenticar, AuthController.trocarSenha.bind(AuthController));

module.exports = router;
