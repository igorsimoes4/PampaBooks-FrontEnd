var express = require('express');
var router = express.Router();

// Controller
const frontController = require('../controllers/frontController');

// Rotas
router.get('/', frontController.renderHomePage);
router.get('/user', frontController.renderUserPage);
router.get('/login', frontController.renderLoginPage);

module.exports = router;
