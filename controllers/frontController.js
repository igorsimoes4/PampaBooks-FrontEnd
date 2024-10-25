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

const getUserNameFromToken = async (token) => {
  if (!token) {
    console.warn('Token não fornecido');
    return null; // Retorna null se não houver token
  }

  try {
    const response = await axios.get('https://pampabooks-users.onrender.com/api/profile', {
      headers: {
        'x-auth-token': token, // Certifique-se de que está passando o token corretamente
        'Content-Type': 'application/json' // Especifica que está esperando uma resposta em JSON
      }
    });

    // Verifica se a resposta possui dados esperados
    if (response.data && response.data.name) {
      console.log('Name:', response.data.name);
      return response.data.name; // Retorna o nome do usuário
    } else {
      console.error('Resposta inesperada do servidor:', response.data);
      return null; // Retorna null se os dados não estiverem no formato esperado
    }
  } catch (error) {
    // Log do erro
    console.error('Erro ao obter perfil do usuário:', error.message);
    return null; // Retorna null em caso de erro
  }
};




exports.renderHomePage = async (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const toastMessage = req.session.toastMessage;
  const token = req.cookies.token;  // Supondo que o token JWT esteja no cookie
  let userName = await getUserNameFromToken(token);   
  req.session.toastMessage = null; 
  res.render('index', { books, HomeActive: 'active', ContactActive: '', totalItems,  toastMessage,  userName });
};

exports.renderContactPage = async (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const token = req.cookies.token;
  let userName = await getUserNameFromToken(token);
  res.render('contact', { title: 'Contato', HomeActive: '', ContactActive: 'active', totalItems,  userName });

};


exports.renderUserPage = async (req, res) => {
  try {
    const response = await axios.get('https://pampabooks-users.onrender.com/api/users/');
    const users = response.data;
    const token = req.cookies.token;
    let userName = await getUserNameFromToken(token);
    res.render('user', { users, HomeActive: '', ContactActive: '',  UserActive: 'active', userName });

  } catch (error) {
    res.render('user', { users: [], success: false, message: 'Erro ao carregar usuários.', type: 'error' });
  }
};

exports.renderLoginPage = async (req, res) => {
  res.render('login');
}

exports.renderRegistrePage = async (req, res) => {
  res.render('register');
}

exports.Registre = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const response = await axios.post('https://pampabooks-users.onrender.com/api/register', {
      name,
      email,
      password,
    });

    if (response.status === 200) {
      // Sucesso no registro, renderiza página de registro com toast de sucesso
      return res.render('register', { toastMessage: { message: 'Registro realizado com sucesso!', type: 'success' } });
    } else {
      throw new Error('Falha ao registrar.');
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    // Renderiza a página de registro com toast de erro
    return res.render('register', { toastMessage: { message: 'Erro ao registrar. Tente novamente.', type: 'error' } });
  }
};


exports.renderAuthLoginPage = async (req, res) => {
  try {
    const response = await axios.post('https://pampabooks-users.onrender.com/api/login', req.body);
    const token = response.data.token;
    res.set('Authorization', `Bearer ${token}`);
    res.cookie('token', token, { httpOnly: true });
    // Certifica-se de que o cookie é definido antes do redirecionamento
    res.status(200).json({ success: true, message: 'Login successful', redirectUrl: '/' });
  } catch (error) {
    res.render('login', { success: false, message: 'Erro ao autenticar.', type: 'error' });
  }
};

exports.renderBookPage = async (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const token = req.cookies.token;
  let userName = await getUserNameFromToken(token);

  try {
    const bookId = req.params.id;
    // const book = await axios.get(`http://127.0.0.1:5000/api/books/${bookId}`);

    const book = books.find(book => book.id == bookId);

    if (book) {
      res.render('book', { 
        book, 
        HomeActive: '', 
        ContactActive: '', 
        totalItems,
        success: true,  // Aqui sucesso porque o livro foi encontrado
        message: '',    // Sem mensagem de erro quando o livro for encontrado
        type: '',
        userName
      });
    } else {
      // Renderiza a página do livro com mensagem de erro
      // res.render('index', {
      //   books,
      //   success: false,
      //   message: 'Livro não encontrado.',
      //   type: 'error',
      //   totalItems,
      //   HomeActive: '',
      //   ContactActive: ''
      // });
      req.session.toastMessage = {
        success: false,
        message: 'Livro não encontrado.',
        type: 'error'
      };
      return res.redirect('/');
    }
  } catch (error) {
    // Renderiza a página do livro com mensagem de erro
    // res.render('book', {
    //   book: null,
    //   success: false,
    //   message: 'Erro ao carregar a página do livro.',
    //   type: 'error',
    //   totalItems,
    //   HomeActive: '',
    //   ContactActive: ''
    // });
    req.session.toastMessage = {
      success: false,
      message: 'Erro ao carregar a página do livro.',
      type: 'error'
    };
    return res.redirect('index');
  }
};


exports.renderCartPage = async (req, res) => {
  const token = req.cookies.token;
  let userName = await getUserNameFromToken(token);
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
    res.render('cart', { cart: cartWithDetails, HomeActive: '', ContactActive: '', totalItems,  userName });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao renderizar a página do carrinho', type: 'error' });
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

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return res.json({
      success: true,
      message: 'Produto adicionado ao carrinho com sucesso',
      type: 'success',
      totalItems
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao adicionar produto ao carrinho', type: 'error' });
  }
};

exports.logoutUser = (req, res) => {
  
  // Remove o token do cookie
  res.clearCookie('token'); // Certifique-se de que o nome do cookie é 'token'

  // Opcional: Limpar a sessão do usuário
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao encerrar a sessão' });
    }
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  });
};

const getUserFromToken = async (token) => {
  if (!token) {
    console.warn('Token não fornecido');
    return null; // Retorna null se não houver token
  }

  try {
    const response = await axios.get('https://pampabooks-users.onrender.com/api/profile', {
      headers: {
        'x-auth-token': token, // Certifique-se de que está passando o token corretamente
        'Content-Type': 'application/json' // Especifica que está esperando uma resposta em JSON
      }
    });
    console.log(response.data);
    // Verifica se a resposta possui dados esperados
    if (response.data) {
      return response.data; // Retorna os dados do perfil do usuário
    } else {
      console.error('Resposta inesperada do servidor:', response.data);
      return null; // Retorna null se os dados não estiverem no formato esperado
    }
  } catch (error) {
    // Log do erro
    console.error('Erro ao obter perfil do usuário:', error.message);
    return null; // Retorna null em caso de erro
  }
};

exports.getDashboard = async (req, res) => {
  const token = req.cookies.token;

  // Obtém as informações do usuário a partir do token
  const user = await getUserFromToken(token);

  // Verifica se o perfil do usuário foi obtido corretamente
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }

  // Renderiza a página do painel com as informações do usuário
  res.render('painel', { user });
};

exports.perfil  = async (req, res) => {
  const token = req.cookies.token;
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }
  res.render('perfil', { user });
}

exports.config  = async (req, res) => {
  const token = req.cookies.token;
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }
  res.render('config', { user });
}

exports.renderBookAdd  = async (req, res) => {
  res.render('addBook', {});
}

exports.bookAdd  = async (req, res) => {
}

