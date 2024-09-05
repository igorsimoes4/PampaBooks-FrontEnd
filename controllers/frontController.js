const axios = require('axios');

exports.renderHomePage = async (req, res) => {
    res.render('index');    
};

exports.renderUserPage = async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/users/');
        const users = response.data;
        res.render('user', { users });
    } catch (error) {
        res.render('user', { users: [], error: 'Erro ao carregar usuários.' });
    }
};
