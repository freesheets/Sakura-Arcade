# Projeto React

Este é um projeto React criado com Vite.

## 🚀 Como começar

### Instalar dependências

```bash
npm install
```

### Executar em modo de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Preview do build de produção

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
Front/
├── public/              # Arquivos estáticos públicos
│   └── vite.svg
├── src/
│   ├── assets/          # Arquivos estáticos (imagens, ícones, fontes)
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── ExampleComponent.jsx
│   │   └── ExampleComponent.css
│   ├── contexts/        # Contextos React para estado global
│   │   └── AppContext.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useExample.js
│   ├── pages/           # Páginas/rotas da aplicação
│   │   └── Home.jsx
│   ├── services/        # Serviços de API e comunicação externa
│   │   └── api.js
│   ├── utils/           # Funções utilitárias e constantes
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos do App
│   ├── main.jsx         # Ponto de entrada da aplicação
│   └── index.css        # Estilos globais
├── .editorconfig        # Configuração do editor
├── .eslintrc.cjs        # Configuração do ESLint
├── .gitignore           # Arquivos ignorados pelo Git
├── index.html           # HTML principal
├── jsconfig.json        # Configuração do JavaScript (path aliases)
├── package.json         # Dependências e scripts
├── vite.config.js       # Configuração do Vite
└── README.md            # Este arquivo
```

## 🛠️ Tecnologias

- **React** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **ESLint** - Linter para JavaScript/React

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🎯 Funcionalidades Incluídas

### Path Aliases
O projeto está configurado com path aliases para facilitar imports:

```javascript
import Component from '@/components/ExampleComponent'
import { useExample } from '@/hooks/useExample'
import { api } from '@/services/api'
import { formatDate } from '@/utils/helpers'
```

### Estrutura Organizada
- **components/** - Componentes reutilizáveis
- **pages/** - Páginas da aplicação
- **hooks/** - Custom hooks do React
- **services/** - Serviços de API
- **utils/** - Funções utilitárias e constantes
- **contexts/** - Contextos React para estado global
- **assets/** - Arquivos estáticos

### Configurações
- ESLint configurado para React
- EditorConfig para consistência de código
- Path aliases configurados no Vite e jsconfig.json
- Suporte a variáveis de ambiente (.env.example)

## 🔧 Configuração de Ambiente

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente necessárias:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=React App
```

