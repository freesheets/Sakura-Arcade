import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getGames } from '../data/games/getGames';
import { SearchAndFilters } from '../components/games/SearchAndFilters';
import { GameGrid } from '../components/games/GameGrid';
import { Sidebar } from '../components/layout/Sidebar';
import { getActiveRents } from '../data/rents/getActiveRents';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Gamepad2, Clock, RefreshCw } from 'lucide-react';
import { Text } from '../components/ui/Text';

export default function LibraryScreen() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending: gamesPending, error: gamesError, data: gamesData } = getGames();
  const { isPending: rentsPending, error: rentsError, data: activeRents, refetch: refetchRents } = getActiveRents(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  const isPending = gamesPending || rentsPending;

  const filteredGames = useMemo(() => {
    if (gamesError || rentsError) return [];
    if (!gamesData || !Array.isArray(gamesData)) return [];
    if (!activeRents || !Array.isArray(activeRents)) return [];

    const rentedGameIds = activeRents
      .map((rent) => rent?.gameId)
      .filter((id) => id !== null && id !== undefined);

    if (rentedGameIds.length === 0) return [];

    const rentedGameIdsNumbers = rentedGameIds.map(id => Number(id));
    let filtered = gamesData.filter((game) => {
      const gameId = typeof game.id === 'string' ? Number(game.id) : game.id;
      const isRented = gameId && rentedGameIdsNumbers.includes(gameId);
      return isRented;
    });
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((game, index) => index % 2 === 0);
    }

    return filtered;
  }, [gamesData, activeRents, searchQuery, selectedCategory, gamesError, rentsError]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user?.id) {
      refetchRents();
    }
  }, [user?.id, refetchRents]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (authLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalRentedGames = filteredGames.length;
  const parallaxOffset = Math.min(scrollY * 0.2, 100);

  return (
    <div className="flex-1 flex-row bg-[#0a0c10] min-h-screen flex">
      <Sidebar />

      <div className="flex-1 relative overflow-x-hidden">
        {/* Hero Section */}
        <div 
          className="relative w-full overflow-hidden"
          style={{ 
            height: '400px',
            minHeight: '400px',
          }}>
          {/* Background Gradiente Animado */}
          <div
            className="absolute inset-0 w-full h-full gradient-animated"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #334155 75%, #1e293b 100%)',
              backgroundSize: '200% 200%',
              transform: `translateY(${parallaxOffset}px)`,
            }}>
            {/* Overlay com padrão */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(188, 124, 255, 0.15) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Conteúdo do Hero */}
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="px-8 lg:px-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Título e Estatísticas */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 
                      className="text-5xl md:text-6xl lg:text-7xl font-black mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #bc7cff 50%, #f472b6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.1,
                      }}>
                      Minha Biblioteca
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                  </div>

                  {/* Estatísticas */}
                  <div className="flex items-center gap-6 flex-wrap mt-6">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 shadow-lg">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BookOpen size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <Text className="text-gray-400 text-xs font-medium uppercase">Jogos Alugados</Text>
                        <Text className="text-white text-xl font-bold">{totalRentedGames}</Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 shadow-lg">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Clock size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <Text className="text-gray-400 text-xs font-medium uppercase">Ativos</Text>
                        <Text className="text-white text-xl font-bold">{activeRents?.length || 0}</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Atualizar */}
                <div className="flex items-center">
                  <button
                    onClick={() => refetchRents()}
                    disabled={isPending}
                    className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:scale-105 disabled:opacity-60 flex items-center gap-2">
                    <RefreshCw size={18} className={`text-blue-400 ${isPending ? 'animate-spin' : ''}`} />
                    <Text className="text-white font-semibold text-sm">Atualizar</Text>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-20 bg-[#0a0c10] -mt-20">
          <div className="px-8 lg:px-12 py-8">
            {/* Mensagens de Erro */}
            {(gamesError || rentsError) && (
              <div className="mb-6">
                {gamesError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-2 backdrop-blur-sm">
                    <Text className="text-red-400 text-sm font-semibold mb-1">
                      Erro ao carregar biblioteca
                    </Text>
                    <Text className="text-red-300/80 text-xs">
                      {gamesError.message || 'Não foi possível carregar os jogos'}
                    </Text>
                  </div>
                )}
                {rentsError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                    <Text className="text-red-400 text-sm font-semibold mb-1">
                      Erro ao buscar aluguéis ativos
                    </Text>
                    <Text className="text-red-300/80 text-xs">
                      {rentsError.message || 'Não foi possível carregar os aluguéis'}
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* Barra de Busca e Filtros */}
            <div className="mb-8">
              <SearchAndFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                showFavoritesOnly={false}
                onToggleFavorites={() => {}}
              />
            </div>

            {/* Grid de Jogos */}
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <Text className="text-gray-400">Carregando jogos...</Text>
              </div>
            ) : filteredGames && Array.isArray(filteredGames) && filteredGames.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    <Text className="text-2xl font-bold text-white">
                      {filteredGames.length} {filteredGames.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
                    </Text>
                  </div>
                </div>
                <GameGrid 
                  games={filteredGames} 
                  isLibrary={true} 
                  activeRents={activeRents || []}
                  onRentReturned={async () => {
                    await queryClient.invalidateQueries({ 
                      queryKey: ['rents'],
                      exact: false 
                    });
                    
                    if (user?.id) {
                      await queryClient.refetchQueries({ 
                        queryKey: ['rents', 'active', user.id],
                        type: 'active'
                      });
                    }
                    
                    await refetchRents();
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="mb-6 p-6 bg-white/5 rounded-full border border-white/10">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
                <Text className="text-gray-400 text-xl mb-2 text-center">
                  {gamesError || rentsError
                    ? 'Não foi possível carregar os dados'
                    : (activeRents && Array.isArray(activeRents) && activeRents.length === 0) || !activeRents
                    ? 'Sua biblioteca está vazia'
                    : searchQuery || selectedCategory
                    ? 'Nenhum jogo encontrado'
                    : 'Nenhum jogo alugado'}
                </Text>
                <Text className="text-gray-500 text-sm text-center mb-6 whitespace-pre-line">
                  {gamesError || rentsError
                    ? 'Tente novamente mais tarde.'
                    : (activeRents && Array.isArray(activeRents) && activeRents.length === 0) || !activeRents
                    ? 'Explore o catálogo e alugue seus jogos favoritos!'
                    : searchQuery || selectedCategory
                    ? 'Tente ajustar os filtros de busca'
                    : 'Adicione jogos à sua biblioteca'}
                </Text>
                {!gamesError && !rentsError && (
                  <Link to="/catalog">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2">
                      <Gamepad2 size={18} />
                      Explorar Catálogo
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
