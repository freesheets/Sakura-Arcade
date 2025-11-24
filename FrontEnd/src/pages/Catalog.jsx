import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../data/games/getGames';
import { SearchAndFilters } from '../components/games/SearchAndFilters';
import { GameGrid } from '../components/games/GameGrid';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Gamepad2, Sparkles, TrendingUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { WalletHeader } from '../components/wallet/WalletHeader';
import { DepositModal } from '../components/wallet/DepositModal';
import { CreateGameModal } from '../components/games/CreateGameModal';
import { EditGameModal } from '../components/games/EditGameModal';
import { Text } from '../components/ui/Text';

export default function CatalogScreen() {
  const { isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending, error, data, refetch: refetchGames } = getGames();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  const filteredGames = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

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
  }, [data, searchQuery, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalGames = data?.length || 0;
  const availableGames = data?.reduce((sum, game) => sum + (game.quantity || 0), 0) || 0;

  if (authLoading) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  if (isPending) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <Text className="text-gray-400 mt-4">Carregando catálogo...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 items-center justify-center p-4 bg-[#0a0c10] min-h-screen flex flex-col">
        <Text className="text-red-400 text-xl mb-2">Erro ao carregar jogos</Text>
        <Text className="text-gray-400">{error.message}</Text>
      </div>
    );
  }

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
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
              backgroundSize: '200% 200%',
              transform: `translateY(${parallaxOffset}px)`,
            }}>
            {/* Overlay com padrão */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(188, 124, 255, 0.1) 0%, transparent 50%)',
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
                      Catálogo de Jogos
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
                  </div>

                  {/* Estatísticas */}
                  <div className="flex items-center gap-6 flex-wrap mt-6">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 shadow-lg">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Gamepad2 size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <Text className="text-gray-400 text-xs font-medium uppercase">Total de Jogos</Text>
                        <Text className="text-white text-xl font-bold">{totalGames}</Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 shadow-lg">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <TrendingUp size={20} className="text-green-400" />
                      </div>
                      <div>
                        <Text className="text-gray-400 text-xs font-medium uppercase">Disponíveis</Text>
                        <Text className="text-white text-xl font-bold">{availableGames}</Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Novo Jogo e Wallet */}
                <div className="flex flex-col gap-4 items-end">
                  <div className="z-20">
                    <WalletHeader onDepositPress={() => setShowDepositModal(true)} />
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsCreateModalVisible(true)}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2">
                      <Plus size={20} />
                      <span>Novo Jogo</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-20 bg-[#0a0c10] -mt-20">
          <div className="px-8 lg:px-12 py-8">
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
            {filteredGames && filteredGames.length > 0 ? (
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
                  showDeleteButton={isAdmin}
                  onGameDeleted={async () => {
                    await queryClient.invalidateQueries({ queryKey: ['games'] });
                    await refetchGames();
                  }}
                  onGameEdit={(game) => {
                    setGameToEdit(game);
                    setIsEditModalVisible(true);
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="mb-6 p-6 bg-white/5 rounded-full border border-white/10">
                  <Gamepad2 size={48} className="text-gray-400" />
                </div>
                <Text className="text-gray-400 text-xl mb-2 text-center">
                  {searchQuery || selectedCategory
                    ? 'Nenhum jogo encontrado'
                    : 'Nenhum jogo disponível'}
                </Text>
                <Text className="text-gray-500 text-sm text-center">
                  {searchQuery || selectedCategory
                    ? 'Tente ajustar os filtros de busca'
                    : 'Adicione jogos ao catálogo para começar'}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <CreateGameModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />
      <EditGameModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setGameToEdit(null);
        }}
        game={gameToEdit}
      />
      <DepositModal
        visible={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
}
