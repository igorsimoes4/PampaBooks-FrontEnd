var express = require('express');
const upload = require('../middlewares/uploadMiddleware');
var router = express.Router();

// Controller
const frontController = require('../controllers/frontController');

// Rotas
router.get('/', frontController.renderHomePage);
router.get('/contact', frontController.renderContactPage);
router.get('/books/:id', frontController.renderBookPage);

router.get('/cart', frontController.renderCartPage);
router.post('/cart/add', frontController.addToCart);
router.post('/checkout', frontController.finalizeCheckout);


router.get('/login', frontController.renderLoginPage);
router.post('/login', frontController.renderAuthLoginPage);
router.post('/logout', frontController.logoutUser);
router.get('/register', frontController.renderRegistrePage);
router.post('/register', frontController.Registre);

router.get('/painel', frontController.getDashboard);
router.get('/painel/perfil', frontController.perfil);
router.get('/painel/config', frontController.config);
router.get('/painel/bookadd', frontController.renderBookAdd);
router.post('/painel/bookadd', upload.single('image'), frontController.bookAdd);

router.get('/searchBooks', frontController.searchBooks);

module.exports = router;
