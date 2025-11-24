import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const userData = await response.json();
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        wallet: userData.wallet || 0,
      };

      sessionStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      setUser(null);
    }
  };

  const updateWallet = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, wallet: newBalance };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshWallet = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}/wallet`);
      if (response.ok) {
        const data = await response.json();
        updateWallet(data.wallet);
      }
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'cliente';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isClient,
        updateWallet,
        refreshWallet,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

