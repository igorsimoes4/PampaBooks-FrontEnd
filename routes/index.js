var express = require('express');
var router = express.Router();

// Controller
const frontController = require('../controllers/frontController');

// Rotas
router.get('/', frontController.renderHomePage);
router.get('/contact', frontController.renderContactPage);
router.get('/user', frontController.renderUserPage);
router.get('/login', frontController.renderLoginPage);
router.post('/login', frontController.renderAuthLoginPage);

module.exports = router;
