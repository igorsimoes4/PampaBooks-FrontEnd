const axios = require('axios');
const books = [
    {
      id: 1,
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      description: 'A épica jornada de Frodo e seus amigos em busca da destruição do Um Anel.',
      price: 89.90,
      image: '/images/book1.jpeg',
      rating: 5
    },
    {
      id: 2,
      title: 'Harry Potter e a Pedra Filosofal',
      author: 'J.K. Rowling',
      description: 'O primeiro livro da série Harry Potter, onde Harry descobre o mundo da magia.',
      price: 59.90,
      image: '/images/book2.jpeg',
      rating: 4
    },
    {
      id: 3,
      title: 'O Código Da Vinci',
      author: 'Dan Brown',
      description: 'Um suspense envolvente sobre a busca de Robert Langdon por segredos antigos.',
      price: 49.90,
      image: '/images/book3.jpeg',
      rating: 4
    },
    {
      id: 4,
      title: 'A Menina que Roubava Livros',
      author: 'Markus Zusak',
      description: 'A emocionante história de uma jovem garota que encontra consolo nos livros durante a Segunda Guerra Mundial.',
      price: 39.90,
      image: '/images/book4.jpeg',
      rating: 5
    },
    {
      id: 5,
      title: '1984',
      author: 'George Orwell',
      description: 'Uma visão distópica de um mundo controlado por um regime totalitário.',
      price: 45.00,
      image: '/images/book5.jpeg',
      rating: 5
    },
    {
      id: 6,
      title: 'Dom Quixote',
      author: 'Miguel de Cervantes',
      description: 'A famosa obra de Cervantes sobre as aventuras do cavaleiro errante Dom Quixote.',
      price: 79.90,
      image: '/images/book6.jpeg',
      rating: 4
    },
    {
      id: 7,
      title: 'A Guerra dos Tronos',
      author: 'George R.R. Martin',
      description: 'O primeiro livro da série As Crônicas de Gelo e Fogo, que inspirou a série Game of Thrones.',
      price: 89.90,
      image: '/images/book7.jpeg',
      rating: 5
    },
    {
      id: 8,
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      description: 'Um dos maiores clássicos da literatura, sobre a história de um pequeno príncipe e suas lições de vida.',
      price: 29.90,
      image: '/images/book8.jpeg',
      rating: 5
    }
];


exports.renderHomePage = async (req, res) => {
    res.render('index', { books });
};

exports.renderContactPage = async (req, res) => {
  res.render('contact', { title: 'Contato' });
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

exports.renderAuthLoginPage = async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/login', req.body);
        const token = response.data.token;
        res.set('Authorization', `Bearer ${token}`);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('login', { error: 'Erro ao autenticar.' });
    }
};