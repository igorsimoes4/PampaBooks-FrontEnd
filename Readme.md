
# PampaBooks - Front-end

Este é o front-end do e-commerce de livros PampaBooks. Ele fornece as interfaces para navegação, visualização de livros, adição ao carrinho e interações do usuário, como login e logout.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para criação de aplicações web em Node.js.
- **EJS**: Motor de templates para renderização do front-end.
- **Axios**: Cliente HTTP para comunicações assíncronas entre serviços.
- **express-session**: Armazenamento de sessão de usuário para gerenciar autenticação.
- **cookie-parser**: Manipulação de cookies HTTP para segurança e persistência de sessões.
- **morgan**: Middleware para log das requisições HTTP.

## Funcionalidades

- Exibição de página inicial e catálogo de livros
- Páginas de contato, perfil do usuário e detalhes do livro
- Autenticação de usuário (login e logout)
- Carrinho de compras

## Instalação

1. Clone este repositório:
    ```bash
    git clone https://github.com/igorsimoes4/pampabooks-frontend.git
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto para definir as variáveis de ambiente necessárias.

4. Inicie o servidor:
    ```bash
    npm start
    ```

## Endpoints

### 1. Página Inicial

- **Rota**: `/`
- **Método**: `GET`
- **Descrição**: Renderiza a página inicial com destaque para os livros.

### 2. Página de Contato

- **Rota**: `/contact`
- **Método**: `GET`
- **Descrição**: Renderiza a página de contato.

### 3. Página do Usuário

- **Rota**: `/user`
- **Método**: `GET`
- **Descrição**: Exibe o perfil do usuário autenticado.

### 4. Login

- **Rota**: `/login`
- **Método**: `GET`, `POST`
- **Descrição**: Renderiza o formulário de login (GET) e autentica o usuário (POST).

### 5. Detalhes do Livro

- **Rota**: `/books/:id`
- **Método**: `GET`
- **Descrição**: Exibe os detalhes de um livro específico.

### 6. Carrinho

- **Rota**: `/cart`
- **Método**: `GET`, `POST`
- **Descrição**: Renderiza o carrinho (GET) e permite adicionar itens ao carrinho (POST).

### 7. Logout

- **Rota**: `/logout`
- **Método**: `POST`
- **Descrição**: Realiza logout do usuário, destruindo a sessão.

## Estrutura do Projeto

```plaintext
├── views
│   ├── pages                # Páginas EJS
│   ├── partials             # Componentes compartilhados
├── public                   # Arquivos estáticos (CSS, JS)
├── controllers
│   └── frontController.js   # Lógica de renderização e manipulação de páginas
├── routes
│   └── frontRoutes.js       # Rotas para as páginas do front-end
└── app.js                   # Configuração principal do app Express
```

## Como Contribuir

1. Fork o projeto
2. Crie uma nova branch (`git checkout -b minha-nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`)
4. Envie para a branch (`git push origin minha-nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob os termos da [MIT License](LICENSE).
