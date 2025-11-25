# 🎮 Sakura Arcade

<div align="center">

![Sakura Arcade](https://img.shields.io/badge/Sakura-Arcade-pink?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Sistema completo de aluguel de jogos com gestão de usuários, estoque e pagamentos**

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-como-usar)

</div>

---

## 📋 Sobre o Projeto

O **Sakura Arcade** é uma plataforma moderna e completa para gerenciamento de aluguel de jogos. O sistema permite que clientes aluguem jogos de forma unitária ou através de assinatura, enquanto administradores têm controle total sobre o catálogo, usuários e aluguéis.

### ✨ Principais Características

- 🎯 **Sistema de Aluguel Dual**: Aluguel unitário e por assinatura
- 💰 **Carteira Digital**: Sistema de depósito e pagamento integrado
- 👥 **Gestão de Usuários**: Controle de clientes e administradores
- 📦 **Controle de Estoque**: Gerenciamento inteligente de disponibilidade
- 🏠 **Endereços Múltiplos**: Sistema de endereços para entrega
- 📊 **Dashboard Administrativo**: Painel completo para gestão

<img width="2559" height="1294" alt="image" src="https://github.com/user-attachments/assets/5acb0e4a-3625-4a0a-a278-d07f7d9a99ed" />


---

## 🚀 Funcionalidades

### Para Clientes
- ✅ Cadastro e autenticação de usuários
- ✅ Navegação pelo catálogo de jogos
- ✅ Aluguel de jogos (unitário ou assinatura)
- ✅ Biblioteca pessoal de jogos alugados
- ✅ Gestão de carteira digital
- ✅ Histórico de aluguéis
- ✅ Sistema de endereços para entrega

### Para Administradores
- ✅ Gestão completa de usuários
- ✅ CRUD de jogos
- ✅ Controle de estoque
- ✅ Visualização de todos os aluguéis
- ✅ Gestão de assinaturas
- ✅ Relatórios e estatísticas

---

## 🛠 Tecnologias

### Backend
- **[Hono](https://hono.dev/)** - Framework web ultra-rápido
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM moderno e type-safe
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

### Frontend
- **[React](https://react.dev/)** - Biblioteca UI
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[React Router](https://reactrouter.com/)** - Roteamento
- **[SweetAlert2](https://sweetalert2.github.io/)** - Alertas elegantes

---

## 📁 Estrutura do Projeto

```
Sakura Arcade/
├── Backend/                 # API REST
│   ├── src/
│   │   ├── data/           # Camada de acesso a dados
│   │   │   ├── games/      # Operações de jogos
│   │   │   ├── rents/      # Operações de aluguéis
│   │   │   ├── users/      # Operações de usuários
│   │   │   └── payments/   # Operações de pagamentos
│   │   ├── routes/         # Definição de rotas
│   │   ├── db/             # Schema do banco de dados
│   │   └── utils/          # Utilitários
│   ├── drizzle/            # Migrações do banco
│   └── package.json
│
└── FrontEnd/               # Aplicação React
    ├── src/
    │   ├── components/     # Componentes reutilizáveis
    │   │   ├── games/      # Componentes de jogos
    │   │   ├── layout/     # Layout e sidebar
    │   │   ├── ui/         # Componentes UI base
    │   │   └── wallet/     # Componentes de carteira
    │   ├── pages/          # Páginas da aplicação
    │   ├── contexts/       # Context API (Auth, Favorites)
    │   ├── data/           # Funções de API
    │   ├── services/       # Serviços (API, Alertas)
    │   └── utils/          # Utilitários
    └── package.json
```

---

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/sakura-arcade.git
   cd sakura-arcade
   ```

2. **Configure o Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Configure o Frontend**
   ```bash
   cd ../FrontEnd
   npm install
   ```

4. **Configure as variáveis de ambiente**

   No diretório `Backend`, crie um arquivo `.env`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/sakura_arcade
   NODE_ENV=development
   ```

5. **Execute as migrações do banco de dados**
   ```bash
   cd Backend
   npm run migrate
   ```

---

## 🎯 Como Usar

### Iniciando o Backend

```bash
cd Backend

# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

### Iniciando o Frontend

```bash
cd FrontEnd

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm run preview
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite)

---

## 🔌 API Endpoints

### Usuários
- `POST /users` - Criar usuário
- `GET /users` - Listar usuários (admin)
- `GET /users/:id` - Obter usuário por ID
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário
- `POST /users/login` - Autenticação
- `POST /users/deposit` - Depositar na carteira
- `GET /users/wallet` - Obter saldo da carteira

### Jogos
- `GET /games` - Listar jogos
- `POST /games` - Criar jogo (admin)
- `PUT /games/:id` - Atualizar jogo (admin)
- `DELETE /games/:id` - Deletar jogo (admin)

### Aluguéis
- `GET /rents` - Listar aluguéis
- `GET /rents/user/:userId` - Aluguéis do usuário
- `GET /rents/active` - Aluguéis ativos
- `POST /rents` - Criar aluguel
- `PUT /rents/:id` - Atualizar aluguel
- `POST /rents/:id/return` - Devolver jogo

### Endereços
- `GET /addresses/user/:userId` - Endereços do usuário
- `POST /addresses` - Criar endereço
- `PUT /addresses/:id` - Atualizar endereço

---

## 🗄 Banco de Dados

O projeto utiliza **PostgreSQL** com as seguintes tabelas principais:

- `users` - Usuários do sistema
- `games` - Catálogo de jogos
- `rents` - Registros de aluguéis
- `addresses` - Endereços dos usuários
- `payments` - Histórico de pagamentos

As migrações estão localizadas em `Backend/drizzle/` e podem ser aplicadas com:
```bash
npm run migrate
```

---

## 🎨 Interface

A interface foi desenvolvida com foco em:
- ✨ Design moderno e responsivo
- 🎯 Experiência de usuário intuitiva
- 🌙 Tema escuro otimizado
- 📱 Compatibilidade mobile

---

## 🔐 Autenticação

O sistema possui dois níveis de acesso:

- **Cliente**: Acesso ao catálogo, biblioteca e aluguéis pessoais
- **Admin**: Acesso completo incluindo gestão de usuários e jogos

---

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev      # Desenvolvimento com hot reload
npm run build    # Compilar TypeScript
npm start        # Executar versão compilada
npm run migrate  # Aplicar migrações
```

### Frontend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Sakura Arcade Team**

---

<div align="center">

**Feito com ❤️ e ☕**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>

