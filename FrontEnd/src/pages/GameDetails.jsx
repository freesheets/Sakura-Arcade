import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGameFromId } from '../data/games/getGameFromId';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateRent } from '../data/rents/createRent';
import { getActiveRents } from '../data/rents/getActiveRents';
import { calculateRentalPrice } from '../utils/priceCalculator';
import { AlertService } from '../services/AlertService';
import { SubscriptionModal } from '../components/games/SubscriptionModal';
import { PurchaseConfirmModal } from '../components/wallet/PurchaseConfirmModal';
import { Sidebar } from '../components/layout/Sidebar';
import { PlayStationLogo } from '../components/ui/PlaystationLogo';
import { 
  Package, 
  Download, 
  Users, 
  Globe,
  ArrowLeft,
  Star,
  Shield,
  Sparkles
} from 'lucide-react';
import { Text } from '../components/ui/Text';

export default function GameDetailsScreen() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isClient, isAdmin, isLoading: authLoading, updateWallet, refreshWallet } = useAuth();
  const [rentalType, setRentalType] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [hasChosenSubscription, setHasChosenSubscription] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const createRentMutation = useCreateRent();
  const queryClient = useQueryClient();

  const { isPending, error, data } = getGameFromId(uuid);
  const game = Array.isArray(data) ? data?.[0] : data;
  const gameId = game?.id ? (typeof game.id === 'string' ? Number(game.id) : game.id) : 0;

  const { data: activeRents } = getActiveRents(user?.id);
  const subscriptionRents = activeRents?.filter(rent => rent.rentalType === 'assinatura') || [];
  
  const freeGamesCount = rentalType === 'assinatura_full' ? subscriptionRents.length : 0;
  const canRescueFreeGame = rentalType === 'assinatura_full' && freeGamesCount < 3;

  const gameDescription = game?.description || 'Descrição não disponível.';
  const gamePlatform = game?.platform || 'N/A';
  const gameSize = game?.size || 'N/A';
  const gameMultiplayer = game?.multiplayer ? 'Sim' : 'Não';
  const gameLanguages = game?.languages || 'N/A';

  const basePrice = 10.0;
  const gamePrice = parseFloat(game?.price?.toString() || "0.00");

  const rentalPrice = useMemo(() => {
    if (!game) return 0;
    
    if (gamePrice > 0) {
      if (rentalType === 'assinatura_full') {
        if (freeGamesCount < 3) {
          return 0;
        } else {
          return gamePrice;
        }
      } else {
        return gamePrice;
      }
    } else {
      if (rentalType === 'assinatura_full') {
        if (freeGamesCount >= 3) {
          return calculateRentalPrice({
            rentalType: 'unitario',
            basePrice,
            days: 30,
          });
        } else {
          return 0;
        }
      } else {
        return calculateRentalPrice({
          rentalType: 'unitario',
          basePrice,
          days: 30,
        });
      }
    }
    
    return 0;
  }, [rentalType, game, freeGamesCount, basePrice, gamePrice]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const checkFirstAccess = async () => {
      if (!user || !isClient || isAdmin) return;
      
      try {
        const subscriptionKey = `subscription_chosen_${user.id}`;
        const chosen = localStorage.getItem(subscriptionKey);
        
        if (!chosen) {
          setShowSubscriptionModal(true);
        } else {
          const subscriptionData = JSON.parse(chosen);
          if (subscriptionData.type === 'assinatura_full') {
            setRentalType('assinatura_full');
            setHasChosenSubscription(true);
          } else {
            setRentalType(null);
            setHasChosenSubscription(true);
          }
        }
      } catch (error) {
        setShowSubscriptionModal(true);
      }
    };

    if (isAuthenticated && isClient && !isAdmin && !authLoading) {
      checkFirstAccess();
    }
  }, [user, isAuthenticated, isClient, isAdmin, authLoading]);

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

  const canRent = isClient || isAdmin;

  const handleSubscriptionSelect = async (type) => {
    setRentalType(type);
    setShowSubscriptionModal(false);
    setHasChosenSubscription(true);

    try {
      const subscriptionKey = `subscription_chosen_${user?.id}`;
      localStorage.setItem(subscriptionKey, JSON.stringify({ type, date: new Date().toISOString() }));

      AlertService.success(
        '🎉 Assinatura Full Ativada!',
        'Assinado com sucesso! Você tem direito a 3 jogos grátis do catálogo!'
      );
    } catch (error) {
      console.error('Erro ao salvar escolha de assinatura:', error);
    }
  };

  const handleRent = async () => {
    if (!canRent) {
      AlertService.error('Erro', 'Apenas clientes podem alugar jogos');
      return;
    }

    if (!game || !gameId) {
      AlertService.error('Erro', 'Jogo não encontrado');
      return;
    }

    if (!user) {
      AlertService.error('Erro', 'Usuário não autenticado');
      return;
    }

    const userId = user.id;
    const priceToPay = rentalPrice > 0 ? rentalPrice : (gamePrice > 0 ? gamePrice : 0);
    
    if (priceToPay > 0 && !isAdmin) {
      setShowPurchaseModal(true);
      return;
    }

    if (isAdmin) {
      try {
        const result = await createRentMutation.mutateAsync({
          userId,
          gameId,
          rentalType: 'assinatura',
          startDate: new Date().toISOString().split('T')[0],
          days: undefined,
          paymentMethod: 'credit_card',
          forcePaymentSuccess: true,
        });

        if (result.payment.success) {
          queryClient.invalidateQueries({ queryKey: ['rents'] });
          queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
          
          AlertService.success(
            'Jogo adicionado! 🎮',
            `O jogo "${game.title}" foi adicionado à sua biblioteca!`,
            () => {
              queryClient.invalidateQueries({ queryKey: ['rents'] });
              queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
              queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
              navigate('/library');
            }
          );
        }
      } catch (error) {
        AlertService.error('Erro', error.message || 'Erro ao adicionar jogo');
      }
      return;
    }

    let backendRentalType = 'unitario';
    let backendDays = 30;
    
    if (rentalType === 'assinatura_full') {
      if (freeGamesCount >= 3) {
        backendRentalType = 'unitario';
        backendDays = 30;
      } else {
        backendRentalType = 'assinatura';
        backendDays = undefined;
      }
    } else {
      backendRentalType = 'unitario';
      backendDays = 30;
    }

    try {
      const result = await createRentMutation.mutateAsync({
        userId,
        gameId,
        rentalType: backendRentalType,
        startDate: new Date().toISOString().split('T')[0],
        days: backendDays,
        paymentMethod: 'credit_card',
        forcePaymentSuccess: true,
      });

      if (result.payment.success) {
        if (result.price > 0) {
          const newBalance = (user.wallet || 0) - result.price;
          updateWallet(newBalance);
          await refreshWallet();
        }

        queryClient.invalidateQueries({ queryKey: ['rents'] });
        queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
        
        AlertService.success(
          'Jogo adicionado! 🎮',
          `O jogo "${game.title}" foi adicionado à sua biblioteca!${result.price > 0 ? `\n\nPreço: R$ ${result.price.toFixed(2)}` : '\n\nJogo grátis!'}`,
          () => {
            queryClient.invalidateQueries({ queryKey: ['rents'] });
            queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
            queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
            navigate('/library');
          }
        );
      }
    } catch (error) {
      AlertService.error('Erro', error.message || 'Erro ao criar aluguel');
    }
  };

  const handleConfirmPurchase = async () => {
    if (!game || !gameId || !user) return;

    const userId = user.id;

    let backendRentalType = 'unitario';
    let backendDays = 30;
    
    if (rentalType === 'assinatura_full') {
      if (freeGamesCount >= 3) {
        backendRentalType = 'unitario';
        backendDays = 30;
      } else {
        backendRentalType = 'assinatura';
        backendDays = undefined;
      }
    } else {
      backendRentalType = 'unitario';
      backendDays = 30;
    }

    try {
      const result = await createRentMutation.mutateAsync({
        userId,
        gameId,
        rentalType: backendRentalType,
        startDate: new Date().toISOString().split('T')[0],
        days: backendDays,
        paymentMethod: 'credit_card',
        forcePaymentSuccess: true,
      });

      if (result.payment.success) {
        if (result.newBalance !== undefined) {
          updateWallet(result.newBalance);
        } else if (result.price > 0) {
          const newBalance = (user.wallet || 0) - result.price;
          updateWallet(newBalance);
        }
        
        await refreshWallet();
        
        queryClient.invalidateQueries({ queryKey: ['rents'] });
        queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
        queryClient.invalidateQueries({ queryKey: ['wallet', user.id] });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
        
        const finalBalance = result.newBalance !== undefined 
          ? result.newBalance 
          : (result.price > 0 ? (user.wallet || 0) - result.price : user.wallet || 0);
        
        const successMessage = result.price > 0
          ? `O jogo "${game.title}" foi adicionado à sua biblioteca!\n\n💰 Preço pago: R$ ${result.price.toFixed(2)}\n💳 Novo saldo: R$ ${finalBalance.toFixed(2)}`
          : `O jogo "${game.title}" foi adicionado à sua biblioteca!\n\n🎁 Jogo grátis!`;
        
        setShowPurchaseModal(false);
        
        AlertService.success(
          'Compra realizada! 🎮',
          successMessage,
          () => {
            queryClient.invalidateQueries({ queryKey: ['rents'] });
            queryClient.invalidateQueries({ queryKey: ['rents', 'active'] });
            queryClient.refetchQueries({ queryKey: ['rents', 'active', user.id] });
            navigate('/library');
          }
        );
      }
    } catch (error) {
      if (error.message?.includes('Saldo insuficiente')) {
        AlertService.error('Saldo insuficiente', error.message);
      } else {
        AlertService.error('Erro', error.message || 'Erro ao realizar compra');
      }
    }
  };

  if (!uuid) {
    return (
      <div className="flex-1 items-center justify-center p-4 bg-[#0a0c10] min-h-screen flex">
        <Text className="text-center text-xl text-red-500">Jogo não encontrado</Text>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex-1 items-center justify-center bg-[#0a0c10] min-h-screen flex flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <Text className="text-gray-400 mt-4">Carregando detalhes...</Text>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex-1 items-center justify-center p-4 bg-[#0a0c10] min-h-screen flex flex-col">
        <Text className="text-red-400 text-xl mb-2">Erro ao carregar jogo</Text>
        <Text className="text-gray-400">{error?.message || 'Jogo não encontrado'}</Text>
        <Link to="/catalog" className="mt-4 text-blue-400 hover:underline">
          Voltar para o catálogo
        </Link>
      </div>
    );
  }

  const parallaxOffset = Math.min(scrollY * 0.3, 200);

  return (
    <div className="flex-1 flex-row bg-[#0a0c10] min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 relative overflow-x-hidden">
        {/* Hero Section com Parallax */}
        <div 
          className="relative w-full"
          style={{ 
            height: '70vh',
            minHeight: '600px',
            maxHeight: '800px',
            overflow: 'hidden',
          }}>
          {/* Background Image com Parallax */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: game.imageUrl ? `url(${game.imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: `translateY(${parallaxOffset}px) scale(1.05)`,
              transition: 'transform 0.1s ease-out',
            }}>
            {/* Overlay Gradiente */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(10, 12, 16, 0.2) 0%, rgba(10, 12, 16, 0.5) 40%, rgba(10, 12, 16, 0.85) 70%, rgba(10, 12, 16, 0.98) 100%)',
              }}
            />
          </div>

          {/* Conteúdo do Hero */}
          <div className="relative z-10 h-full flex flex-col justify-end">
            <div className="px-8 lg:px-12 pb-8 lg:pb-12">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-xl px-4 py-2.5 transition-all duration-200 group shadow-lg hover:shadow-xl">
                  <ArrowLeft size={18} className="text-white group-hover:-translate-x-1 transition-transform" />
                  <Text className="text-sm font-semibold text-white">Voltar para o catálogo</Text>
                </Link>
              </div>

              {/* Título e Informações */}
              <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                {/* Capa do Jogo */}
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 w-full lg:w-[280px]"
                  style={{
                    height: '400px',
                    maxWidth: '280px',
                  }}>
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-white/5 h-full">
                      <Text className="text-8xl">🎮</Text>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Informações Principais */}
                <div className="flex-1 w-full min-w-0">
                  <h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
                    style={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #bc7cff 50%, #f472b6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1.1,
                    }}>
                    {game.title}
                  </h1>

                  {/* Tags e Badges */}
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                      <Package size={16} className="text-blue-400" />
                      <Text className="text-white text-sm font-semibold">{game.quantity} disponíveis</Text>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
                      <PlayStationLogo size={16} />
                      <Text className="text-white text-sm font-semibold">{gamePlatform}</Text>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-full px-4 py-2 border border-yellow-500/30 shadow-lg">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <Text className="text-white text-sm font-bold">4.9</Text>
                    </div>
                  </div>

                  {/* Botão de Ação Principal */}
                  {canRent && (
                    <div className="w-full max-w-md">
                      {isAdmin ? (
                        <button
                          onClick={handleRent}
                          disabled={createRentMutation.isPending}
                          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl px-8 py-4 font-bold text-white transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 w-full">
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {createRentMutation.isPending ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                              <>
                                <Sparkles size={20} />
                                <span>Adicionar à Biblioteca</span>
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ) : (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                          {gamePrice > 0 && rentalType === 'assinatura_full' && freeGamesCount < 3 ? (
                            <>
                              <div className="mb-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles size={18} className="text-green-400" />
                                  <Text className="text-green-400 font-bold text-sm">JOGO GRÁTIS - ASSINATURA FULL</Text>
                                </div>
                                <Text className="text-white text-xs mb-1">
                                  Você tem {3 - freeGamesCount} jogos grátis restantes
                                </Text>
                                <Text className="text-gray-400 text-xs">
                                  Preço original: R$ {gamePrice.toFixed(2)}
                                </Text>
                              </div>
                              <button
                                onClick={handleRent}
                                disabled={createRentMutation.isPending}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl px-6 py-4 font-bold text-white transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 disabled:opacity-60">
                                {createRentMutation.isPending ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto"></div>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <Sparkles size={18} />
                                    Resgatar Grátis ({freeGamesCount + 1}/3)
                                  </span>
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Text className="text-gray-400 text-sm">Preço</Text>
                                  <Text className="text-3xl font-black text-white">
                                    R$ {(rentalPrice > 0 ? rentalPrice : gamePrice).toFixed(2)}
                                  </Text>
                                </div>
                                {rentalType === 'assinatura_full' && freeGamesCount >= 3 && (
                                  <Text className="text-yellow-400 text-xs">
                                    ⚠️ Limite de jogos grátis atingido
                                  </Text>
                                )}
                              </div>
                              <button
                                onClick={handleRent}
                                disabled={createRentMutation.isPending}
                                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 rounded-xl px-6 py-4 font-bold text-white transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-60">
                                {createRentMutation.isPending ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto"></div>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <Shield size={18} />
                                    Alugar/Comprar Agora
                                  </span>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-20 bg-[#0a0c10]">
          <div className="px-8 lg:px-12 py-12">
            {/* Descrição */}
            <div className="mb-12 max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                <Text className="text-3xl font-bold text-white">Sobre o Jogo</Text>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
                <Text className="text-gray-300 leading-7 text-base md:text-lg whitespace-pre-line">
                  {gameDescription}
                </Text>
              </div>
            </div>

            {/* Informações Técnicas */}
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                <Text className="text-3xl font-bold text-white">Informações Técnicas</Text>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-lg">
                      <PlayStationLogo size={24} />
                    </div>
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">Plataforma</Text>
                  </div>
                  <Text className="text-white text-xl font-bold">{gamePlatform}</Text>
                </div>

                <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-green-500/20 rounded-lg">
                      <Download size={24} className="text-green-400" />
                    </div>
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">Tamanho</Text>
                  </div>
                  <Text className="text-white text-xl font-bold">{gameSize}</Text>
                </div>

                <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-lg">
                      <Users size={24} className="text-purple-400" />
                    </div>
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">Multiplayer</Text>
                  </div>
                  <Text className="text-white text-xl font-bold">{gameMultiplayer}</Text>
                </div>

                <div className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-orange-500/20 rounded-lg">
                      <Globe size={24} className="text-orange-400" />
                    </div>
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">Idiomas</Text>
                  </div>
                  <Text className="text-white text-xl font-bold">{gameLanguages}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modais */}
      {canRent && !isAdmin && (
        <SubscriptionModal
          visible={showSubscriptionModal}
          onSelect={(type) => {
            handleSubscriptionSelect(type);
          }}
          onClose={() => {
            if (!hasChosenSubscription) {
              setRentalType(null);
              setHasChosenSubscription(true);
              const subscriptionKey = `subscription_chosen_${user?.id}`;
              localStorage.setItem(subscriptionKey, JSON.stringify({ type: null, date: new Date().toISOString() }));
            }
            setShowSubscriptionModal(false);
          }}
        />
      )}
      {canRent && game && !isAdmin && (rentalPrice > 0 || gamePrice > 0) && (
        <PurchaseConfirmModal
          visible={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={handleConfirmPurchase}
          gameTitle={game.title}
          gamePrice={rentalPrice > 0 ? rentalPrice : gamePrice}
          isProcessing={createRentMutation.isPending}
        />
      )}
    </div>
  );
}
