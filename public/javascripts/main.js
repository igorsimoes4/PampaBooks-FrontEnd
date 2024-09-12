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
                alert('Produto adicionado ao carrinho!');
            } else {
                alert('Falha ao adicionar o produto ao carrinho.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao adicionar o produto ao carrinho.');
        });
}

// Adiciona o evento de clique ao botão "Comprar"
document.querySelectorAll('.btn-comprar').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-id');
        adicionarAoCarrinho(productId);
    });
});
