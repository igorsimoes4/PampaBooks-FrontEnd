var express = require('express');
var router = express.Router();

// Controller
const frontController = require('../controllers/frontController');

// Rotas
router.get('/', frontController.renderHomePage);
router.get('/contact', frontController.renderContactPage);
router.get('/books/:id', frontController.renderBookPage);

router.get('/cart', frontController.renderCartPage);
router.post('/cart/add', frontController.addToCart);


router.get('/login', frontController.renderLoginPage);
router.post('/login', frontController.renderAuthLoginPage);
router.post('/logout', frontController.logoutUser);
router.get('/register', frontController.renderRegistrePage);
router.post('/register', frontController.Registre);


router.get('/painel', frontController.getDashboard);
router.get('/painel/perfil', frontController.perfil);
router.get('/painel/config', frontController.config);
router.get('/painel/bookadd', frontController.renderBookAdd);
router.post('/painel/bookadd', frontController.bookAdd);

module.exports = router;
