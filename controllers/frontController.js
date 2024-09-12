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
  const cart = req.session.cart || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  res.render('index', { books, HomeActive: 'active', ContactActive: '', totalItems });
};

exports.renderContactPage = async (req, res) => {
  const cart = req.session.cart || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  res.render('contact', { title: 'Contato', HomeActive: '', ContactActive: 'active', totalItems });
};


exports.renderUserPage = async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/api/users/');
    const users = response.data;
    res.render('user', { users, HomeActive: '', ContactActive: '' });
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

exports.renderBookPage = async (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  try {
    const bookId = req.params.id;
    // const response = await axios.get(`http://127.0.0.1:5000/api/books/${bookId}`);
    const response = books.find(book => book.id == bookId);
    const book = response;
    if (book) {
      res.render('book', { book, HomeActive: '', ContactActive: '', totalItems }); // Renderiza a página com o livro encontrado
    } else {
      res.render('book', { book: [], error: 'Livro não encontrado.', HomeActive: '', ContactActive: '', totalItems }); // Mensagem de erro caso não encontre o livro
    }
  } catch (error) {
    res.render('book', { book: [], error: 'Erro ao carregar livro.', HomeActive: '', ContactActive: '', totalItems });
  }
}

exports.renderCartPage = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    const cartWithDetails = cart.map(item => {
      const book = books.find(b => b.id === parseInt(item.productId));
      return {
          ...item,
          title: book ? book.title : 'Desconhecido',
          image: book ? book.image : '/images/default.png',
          price: book ? book.price : 0
      };
  });

    // Renderiza a página do carrinho
    res.render('cart', { cart: cartWithDetails, HomeActive: '', ContactActive: '', totalItems });
  } catch (error) {
    console.error('Erro ao renderizar a página do carrinho:', error);
    res.status(500).send('Erro ao renderizar a página do carrinho');
  }
}

exports.addToCart = (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      throw new Error('Dados do produto ausentes');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const cart = req.session.cart;
    const existingProduct = cart.find(item => item.productId === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    req.session.cart = cart;

    return res.json({ success: true, message: 'Produto adicionado ao carrinho' });
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);
    return res.status(500).json({ success: false, message: 'Erro ao adicionar produto ao carrinho' });
  }
};
