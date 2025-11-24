# Contexts

Esta pasta contém os contextos React para gerenciamento de estado global.

## Exemplo de uso

```javascript
import { AppProvider, useApp } from './contexts/AppContext'

// No App.jsx
<AppProvider>
  <App />
</AppProvider>

// Em qualquer componente
const { theme, setTheme } = useApp()
```

