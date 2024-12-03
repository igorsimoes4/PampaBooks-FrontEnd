document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value;

    console.log('Valor da pesquisa:', searchQuery);

    // Faz a busca e atualiza os resultados
    fetch(`/searchBooks?q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            const searchResultsContainer = document.getElementById('search-results');
            searchResultsContainer.innerHTML = ''; // Limpa os resultados anteriores
            console.log(data);
            if (data.books) {
                data.books.forEach(book => {
                    const bookElement = document.createElement('div');
                    bookElement.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
                    bookElement.innerHTML = `
              <div class="card h-100 shadow-sm">
                <img src="${book.image}" class="card-img-top book-cover" alt="${book.title}" onerror="this.onerror=null; this.src='/uploads/default.png';"/>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="text-muted">Autor: ${book.author}</p>
                  <p class="card-text">${book.description}</p>
                  <span class="badge rounded-pill" style="background-color: #ccc; color: black;">${book.category}</span>

                  <div class="book-rating mb-2 mt-2">
                    ${Array.from({ length: 5 }, (_, i) =>
                        i < book.rating
                            ? `<i class="bi bi-star-fill text-warning"></i>`
                            : `<i class="bi bi-star text-warning"></i>`
                    ).join('')}
                </div>

                <p class="text-success">R$ ${book.price.toFixed(2)}</p>

                <div class="mt-auto d-flex justify-content-between align-items-center">
                    <a href="/books/${book._id}" class="btn btn-sm btn-outline-primary">Detalhes</a>
                    <button type="button" class="btn btn-sm btn-success btn-comprar" data-id="${book._id}">Comprar</button>
                  </div>
                </div>
              </div>
            `;
                    searchResultsContainer.appendChild(bookElement);
                });
            } else {
                searchResultsContainer.innerHTML = '<p class="text-center">Nenhum livro encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao pesquisar livros:', error);
            alert('Erro ao realizar a pesquisa.');
        });
});


document.addEventListener('DOMContentLoaded', () => {
    // Função para exibir toast
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            console.error('Toast container not found.');
            return;
        }

        const toastTemplate = document.getElementById('toast-template');
        if (!toastTemplate) {
            console.error('Toast template not found.');
            return;
        }

        const toastElement = toastTemplate.cloneNode(true);
        toastElement.classList.remove('d-none');
        toastElement.classList.add(type === 'error' ? 'bg-danger' : 'bg-success');
        toastElement.querySelector('.toast-body').textContent = message;

        toastContainer.appendChild(toastElement);

        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    const storedMessage = localStorage.getItem('toastMessage');
    if (storedMessage) {
        const { message, type } = JSON.parse(storedMessage);
        showToast(message, type);
        localStorage.removeItem('toastMessage'); // Limpar a mensagem após exibir
    }

    // Exemplo de exibição de toast na carga da página (pode ser removido se não for necessário)
    if (window.toastMessage) {
        showToast(window.toastMessage.message, window.toastMessage.type);
    }


    function atualizarItensCarrinho(totalItems) {
        const cartBadge = document.querySelector('.btn-primary .badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    // Função para enviar uma requisição POST para adicionar um produto ao carrinho
    function adicionarAoCarrinho(productId) {
        fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: productId, quantity: 1 })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message, data.type); // Usa a mensagem do backend
                    atualizarItensCarrinho(data.totalItems);
                } else {
                    showToast(data.message, data.type); // Usa a mensagem do backend
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                showToast('Ocorreu um erro ao adicionar o produto ao carrinho.', 'error');
            });
    }

    // Adiciona o evento de clique ao botão "Comprar"
    function addBuyButtonEvent() {
        document.querySelectorAll('.btn-comprar').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                adicionarAoCarrinho(productId);
            });
        });
    }

    // Adiciona o evento de logout
    document.getElementById('logoutLink').addEventListener('click', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do link

        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                // Redirecionar ou atualizar a página após logout
                localStorage.setItem('toastMessage', JSON.stringify({ message: 'Logout realizado com sucesso', type: 'success' }));
                window.location.href = '/'; // Redireciona para a página inicial
            } else {
                const errorData = await response.json();
                console.error('Erro ao realizar logout:', errorData.message);
                showToast('Erro ao realizar logout: ' + errorData.message, 'error');
            }
        } catch (error) {
            console.error('Erro na requisição de logout:', error);
            showToast('Erro ao realizar logout.', 'error');
        }
    });

    // Pesquisa de livros
    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const searchInput = document.getElementById('search-input');
        const searchQuery = searchInput.value;

        console.log('Valor da pesquisa:', searchQuery);

        // Faz a busca e atualiza os resultados
        fetch(`/searchBooks?q=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                const searchResultsContainer = document.getElementById('search-results');
                searchResultsContainer.innerHTML = ''; // Limpa os resultados anteriores
                console.log(data);
                if (data.books) {
                    data.books.forEach(book => {
                        const bookElement = document.createElement('div');
                        bookElement.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
                        bookElement.innerHTML = `
                          <div class="card h-100 shadow-sm">
                            <img src="${book.image}" class="card-img-top book-cover" alt="${book.title}" onerror="this.onerror=null; this.src='/uploads/default.png';"/>
                            <div class="card-body d-flex flex-column">
                              <h5 class="card-title">${book.title}</h5>
                              <p class="text-muted">Autor: ${book.author}</p>
                              <p class="card-text">${book.description}</p>
                              <span class="badge rounded-pill" style="background-color: #ccc; color: black;">${book.category}</span>

                              <div class="book-rating mb-2 mt-2">
                                ${Array.from({ length: 5 }, (_, i) =>
                                    i < book.rating
                                        ? `<i class="bi bi-star-fill text-warning"></i>`
                                        : `<i class="bi bi-star text-warning"></i>`
                                ).join('')}
                            </div>

                            <p class="text-success">R$ ${book.price.toFixed(2)}</p>

                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <a href="/books/${book._id}" class="btn btn-sm btn-outline-primary">Detalhes</a>
                                <button type="button" class="btn btn-sm btn-success btn-comprar" data-id="${book._id}">Comprar</button>
                              </div>
                            </div>
                          </div>
                        `;
                        searchResultsContainer.appendChild(bookElement);
                    });
                    // Adiciona o evento de clique aos novos botões "Comprar"
                    addBuyButtonEvent();
                } else {
                    searchResultsContainer.innerHTML = '<p class="text-center">Nenhum livro encontrado.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao pesquisar livros:', error);
                alert('Erro ao realizar a pesquisa.');
            });
    });
});
