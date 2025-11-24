import { useState, useEffect } from 'react'

/**
 * Hook de exemplo
 * @returns {Object} Objeto com estado e funções
 */
export const useExample = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Lógica do hook aqui
  }, [])

  return { data, loading, error, setData }
}

