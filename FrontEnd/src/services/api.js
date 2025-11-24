/**
 * Serviço de API
 * Configuração base para requisições HTTP
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Função genérica para fazer requisições
 * @param {string} endpoint - Endpoint da API
 * @param {Object} options - Opções do fetch
 * @returns {Promise} Resposta da requisição
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

/**
 * Métodos HTTP auxiliares
 */
export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => 
    apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options) => 
    apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

