import { useState } from 'react'
import './ExampleComponent.css'

/**
 * Componente de exemplo
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título do componente
 */
function ExampleComponent({ title = 'Exemplo' }) {
  const [count, setCount] = useState(0)

  return (
    <div className="example-component">
      <h2>{title}</h2>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  )
}

export default ExampleComponent

