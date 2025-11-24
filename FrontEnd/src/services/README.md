# Services

Esta pasta contém os serviços de comunicação com APIs e serviços externos.

## Estrutura

- `api.js` - Configuração base da API e funções auxiliares

## Exemplo de uso

```javascript
import { api } from './services/api'

// GET request
const data = await api.get('/users')

// POST request
const newUser = await api.post('/users', { name: 'John' })
```

