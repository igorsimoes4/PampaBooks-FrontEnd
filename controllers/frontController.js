const axios = require('axios');
const books = [
    {
        id: 1,
        title: 'Livro Exemplo 1',
        author: 'Autor 1',
        description: 'Uma breve descrição do livro exemplo 1.',
        price: 49.90,
        image: '/images/book1.jpeg',
    },
    {
        id: 2,
        title: 'Livro Exemplo 2',
        author: 'Autor 2',
        description: 'Uma breve descrição do livro exemplo 2.',
        price: 59.90,
        image: '/images/book2.jpeg',
    },
    {
        id: 3,
        title: 'Livro Exemplo 3',
        author: 'Autor 3',
        description: 'Uma breve descrição do livro exemplo 3.',
        price: 39.90,
        image: '/images/book3.jpeg',
    },
    {
        id: 3,
        title: 'Livro Exemplo 3',
        author: 'Autor 3',
        description: 'Uma breve descrição do livro exemplo 3.',
        price: 39.90,
        image: '/images/book3.jpeg',
    },
    {
        id: 3,
        title: 'Livro Exemplo 3',
        author: 'Autor 3',
        description: 'Uma breve descrição do livro exemplo 3.',
        price: 39.90,
        image: '/images/book3.jpeg',
    },
    {
        id: 3,
        title: 'Livro Exemplo 3',
        author: 'Autor 3',
        description: 'Uma breve descrição do livro exemplo 3.',
        price: 39.90,
        image: '/images/book3.jpeg',
    },
];

exports.renderHomePage = async (req, res) => {
    res.render('index', {books});
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

exports.renderLoginPage = async (req, res) => {
    res.render('login');
}
