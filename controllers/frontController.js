const axios = require('axios');

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
  const response = await axios.get('https://catalog-service-mdg2.onrender.com/api/books');
  const books = response.data.books;
  let userName = await getUserNameFromToken(token);
  req.session.toastMessage = null;
  res.render('index', { books, HomeActive: 'active', ContactActive: '', totalItems, toastMessage, userName });
};

exports.renderContactPage = async (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const token = req.cookies.token;
  let userName = await getUserNameFromToken(token);
  res.render('contact', { title: 'Contato', HomeActive: '', ContactActive: 'active', totalItems, userName });

};


exports.renderUserPage = async (req, res) => {
  try {
    const response = await axios.get('https://pampabooks-users.onrender.com/api/users/');
    const users = response.data;
    const token = req.cookies.token;
    let userName = await getUserNameFromToken(token);
    res.render('user', { users, HomeActive: '', ContactActive: '', UserActive: 'active', userName });

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

    if (response.status === 201) {
      // Sucesso no registro, renderiza página de registro com toast de sucesso
      res.status(200).json({ success: true, message: 'User registered successfully' });
    } else {
      throw new Error('Falha ao registrar.');
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    // Renderiza a página de registro com toast de erro
    res.status(400).json({ success: false, message: 'Falha ao registrar usuário.' });
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
    const response = await axios.get(`https://catalog-service-mdg2.onrender.com/api/books/${bookId}`);

    const book = response.data.book;

    // const book = books.find(book => book.id == bookId);

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
      req.session.toastMessage = {
        success: false,
        message: 'Livro não encontrado.',
        type: 'error'
      };
      return res.redirect('/');
    }
  } catch (error) {
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
    // Obtendo o carrinho da sessão
    const cart = req.session.cart || [];
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    let cartWithDetails = [];

    // Verificar se há produtos no carrinho antes de buscar detalhes
    if (cart.length > 0) {
      // Extrair os IDs dos produtos no carrinho
      const productIds = cart.map(item => item.productId);

      // Realizar uma requisição ao microserviço de livros
      const response = await axios.get(`https://catalog-service-mdg2.onrender.com/api/books/search`, {
        params: { ids: productIds.join(',') }
      });

      // Obter os detalhes dos livros da resposta
      const books = response.data.books;

      // Mapear o carrinho com os detalhes dos livros
      cartWithDetails = cart.map(item => {
        const book = books.find(b => b._id === item.productId);
        return {
          ...item,
          title: book ? book.title : 'Desconhecido',
          image: book ? book.image : '/images/default.png',
          price: book ? book.price : 0
        };
      });
    }

    // Renderizar a página do carrinho
    res.render('cart', {
      cart: cartWithDetails,
      HomeActive: '',
      ContactActive: '',
      totalItems,
      userName
    });

  } catch (error) {
    console.error('Erro ao renderizar a página do carrinho:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao renderizar a página do carrinho',
      type: 'error'
    });
  }
};



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

  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' });
  }

  // Obter parâmetros de paginação
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Histórico de compras paginado
  const totalPurchases = user.purchaseHistory.length;
  const paginatedHistory = user.purchaseHistory.slice(startIndex, endIndex);

  // Buscar detalhes dos livros caso estejam faltando
  const bookIds = paginatedHistory.flatMap(purchase => purchase.items.map(item => item.bookId));
  let books = [];

  if (bookIds.length > 0) {
    try {
      const response = await axios.get('https://catalog-service-mdg2.onrender.com/api/books/search', {
        params: { ids: bookIds.join(',') }
      });
      books = response.data.books;
    } catch (error) {
      console.error('Erro ao buscar detalhes dos livros:', error.message);
    }
  }

  // Mapear os itens do histórico com os detalhes dos livros
  const historyWithBookDetails = paginatedHistory.map(purchase => {
    const itemsWithDetails = purchase.items.map(item => {
      const book = books.find(b => b._id === item.bookId) || {};
      return {
        ...item,
        title: book.title || 'Desconhecido',
        price: book.price || 0
      };
    });
    return { ...purchase, items: itemsWithDetails };
  });

  // Total de páginas
  const totalPages = Math.ceil(totalPurchases / limit);

  res.render('painel', {
    user: { ...user, purchaseHistory: historyWithBookDetails },
    currentPage: page,
    totalPages
  });
};



exports.perfil = async (req, res) => {
  const token = req.cookies.token;
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }
  res.render('perfil', { user });
}

exports.config = async (req, res) => {
  const token = req.cookies.token;
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }
  res.render('config', { user });
}

exports.renderBookAdd = async (req, res) => {
  const token = req.cookies.token;
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).render('error', { message: 'Usuário não autenticado.' }); // Renderiza uma página de erro
  }
  res.render('addBook', { user });

}

exports.bookAdd = async (req, res) => {
  try {
    // Extraindo dados do formulário
    const { title, author, description, price, rating, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    // Enviando os dados para o microserviço de livros
    const response = await axios.post('https://catalog-service-mdg2.onrender.com/api/books/', {
      title,
      author,
      description,
      price: parseFloat(price),
      image: imagePath,
      rating: parseInt(rating),
      category
    });

    console.log("Livro Add", response);

    if (response.data.success) {
      // Sucesso
      return res.status(200).json({ success: true, message: 'Livro cadastrado com sucesso!', redirectUrl: '/painel/bookadd' });
    } else {
      throw new Error('Falha ao cadastrar livro.');
    }
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error.message);
    return res.status(400).json({ success: false, message: 'Erro ao cadastrar livro.' });
  }
}

exports.finalizeCheckout = async (req, res) => {
  const { address, payment } = req.body;
  const token = req.cookies.token; // Obter o token salvo no cookie
  const cart = req.session.cart;
  console.log("Carrinho na sessão:", cart);

  if (!cart) {
    return res.status(401).json({ success: false, message: 'Carrinho vazio.' });
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
  }
  console.log("Carrinho na sessão:", cart);

  try {
    const response = await axios.post('https://pampabooks-users.onrender.com/api/finalize',
      {
        cart,
        address,
        payment
      },
      {
        headers: {
          'x-auth-token': token, // Certifique-se de que está passando o token corretamente
          'Content-Type': 'application/json' // Especifica que está esperando uma resposta em JSON
        }
      }
    );

    console.log(response.status);

    if (response.status) {
      if (!req.session.cart) {
        req.session.cart = []; // Inicializa o carrinho, se necessário
      }    
      req.session.cart = [];
      res.status(200).json({ success: true, message: 'Compra finalizada', redirectUrl:'/' });
    }
  } catch (error) {
    console.error('Erro no microserviço:', error.message);
    res.status(500).json({ success: false, message: 'Erro ao processar a compra' });
  }
};

exports.searchBooks = async (req, res) => {
  const { q: query } = req.query; // Capture o termo de busca da query string
  console.log('Termo de pesquisa recebido:', query); // Ajustado para usar a variável correta

  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const toastMessage = req.session.toastMessage;
  const token = req.cookies.token;
  let userName = await getUserNameFromToken(token);
  req.session.toastMessage = null;  

  try {
    const response = await axios.post(`http://localhost:3002/api/books/pesquisa`, {
      query, // Envie o termo capturado
    });
    const books = response.data.books;
    console.log('Livros retornados pelo microserviço:', books);

    res.json({ success: true, books });
  } catch (error) {
    console.error('Erro no controller frontend:', error);
    res.status(500).json({ message: 'Erro ao buscar livros.' });
  }
};




