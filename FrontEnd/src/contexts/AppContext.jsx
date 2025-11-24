import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

/**
 * Provider do contexto da aplicação
 */
export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  const value = {
    theme,
    setTheme,
    user,
    setUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/**
 * Hook para usar o contexto da aplicação
 */
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}

