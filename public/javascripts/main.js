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
    document.querySelectorAll('.btn-comprar').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            adicionarAoCarrinho(productId);
        });
    });


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


});
