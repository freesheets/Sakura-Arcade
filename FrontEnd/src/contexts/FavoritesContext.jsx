import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(undefined);

const FAVORITES_STORAGE_KEY = '@sakura_arcade_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addFavorite = (gameUuid) => {
    if (!favorites.includes(gameUuid)) {
      saveFavorites([...favorites, gameUuid]);
    }
  };

  const removeFavorite = (gameUuid) => {
    saveFavorites(favorites.filter((uuid) => uuid !== gameUuid));
  };

  const isFavorite = (gameUuid) => {
    return favorites.includes(gameUuid);
  };

  const toggleFavorite = (gameUuid) => {
    if (isFavorite(gameUuid)) {
      removeFavorite(gameUuid);
    } else {
      addFavorite(gameUuid);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

