import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveRents } from '../data/rents/getActiveRents';
import { useReturnRent } from '../data/rents/returnRent';
import { getGames } from '../data/games/getGames';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Gamepad2
} from 'lucide-react';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AlertService } from '../services/AlertService';

export default function RentsDashboardScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, error, data: rents, refetch } = getActiveRents(user?.id);
  const { data: games } = getGames();
  const returnRentMutation = useReturnRent();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleReturn = async (rentId, gameTitle) => {
    AlertService.confirm(
      'Confirmar Devolução',
      `Deseja devolver "${gameTitle}"?`,
      async () => {
        try {
          const result = await returnRentMutation.mutateAsync({ rentId });
          if (result.hasFine) {
            AlertService.success(
              'Devolução Processada',
              `Jogo devolvido com sucesso!\n\nMulta por atraso: R$ ${parseFloat(result.fineAmount).toFixed(2)}\nDias de atraso: ${result.daysOverdue}`
            );
          } else {
            AlertService.success('Sucesso!', 'Jogo devolvido com sucesso!');
          }
          await refetch();
        } catch (error) {
          let errorMessage = 'Erro ao processar devolução';
          
          if (error?.message) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          } else if (error?.error) {
            errorMessage = error.error;
          }
          
          AlertService.error('Erro', errorMessage);
        }
      }
    );
  };

  const getGameTitle = (gameId) => {
    const game = games?.find((g) => {
      const gId = typeof g.id === 'string' ? Number(g.id) : g.id;
      return gId === gameId;
    });
    return game?.title || `Jogo #${gameId}`;
  };

  const getDaysUntilReturn = (expectedReturnDate) => {
    if (!expectedReturnDate) return null;
    const today = new Date();
    const returnDate = new Date(expectedReturnDate);
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (expectedReturnDate) => {
    const days = getDaysUntilReturn(expectedReturnDate);
    return days !== null && days < 0;
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="overflow-y-auto" style={{ maxHeight: '100vh' }}>
        {isPending && (
          <div className="flex-1 items-center justify-center p-8 flex flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <Text className="mt-4 text-gray-400">Carregando aluguéis...</Text>
          </div>
        )}

        {error && (
          <div className="flex-1 items-center justify-center p-8 flex flex-col">
            <AlertTriangle size={48} className="text-red-400" />
            <Text className="mt-4 text-center text-xl text-red-400">
              Erro ao carregar aluguéis
            </Text>
            <Text className="mt-2 text-center text-gray-400">{error.message}</Text>
            <Button onClick={onRefresh} className="mt-4" variant="outline">
              <Text>Tentar Novamente</Text>
            </Button>
          </div>
        )}

        {!isPending && !error && (
          <div className="p-4" style={{ gap: 16 }}>
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/5 border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex-row items-center justify-between flex">
                  <div>
                    <Text className="text-sm text-gray-400 mb-1">Aluguéis Ativos</Text>
                    <Text className="text-4xl font-bold text-white">
                      {rents?.length || 0}
                    </Text>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-full">
                    <Gamepad2 size={32} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {!rents || rents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 items-center py-12 flex flex-col">
                  <Package size={64} className="text-gray-500" />
                  <Text className="mt-4 text-xl font-semibold text-center text-gray-400">
                    Nenhum aluguel ativo
                  </Text>
                  <Text className="mt-2 text-center text-gray-400">
                    Você ainda não possui jogos alugados
                  </Text>
                </CardContent>
              </Card>
            ) : (
              rents.map((rent) => {
                const gameTitle = getGameTitle(rent.gameId);
                const daysUntilReturn = getDaysUntilReturn(rent.expectedReturnDate);
                const overdue = isOverdue(rent.expectedReturnDate);
                const hasFine = rent.daysOverdue && rent.daysOverdue > 0;

                return (
                  <Card
                    key={rent.id}
                    className={`shadow-lg ${
                      overdue
                        ? 'border-l-4 border-l-red-500 bg-red-500/5'
                        : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex-row items-start justify-between flex">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{gameTitle}</CardTitle>
                          <div className="flex-row items-center gap-2 mt-1 flex">
                            <div
                              className={`px-3 py-1 rounded-full ${
                                rent.rentalType === 'assinatura'
                                  ? 'bg-blue-500/20'
                                  : 'bg-purple-500/20'
                              }`}
                            >
                              <Text
                                className={`text-xs font-semibold ${
                                  rent.rentalType === 'assinatura'
                                    ? 'text-blue-400'
                                    : 'text-purple-400'
                                }`}
                              >
                                {rent.rentalType === 'assinatura' ? '📱 Assinatura' : '🎮 Unitário'}
                              </Text>
                            </div>
                            {overdue && (
                              <div className="bg-red-500/20 px-3 py-1 rounded-full">
                                <Text className="text-xs font-semibold text-red-400">
                                  ⚠️ Atrasado
                                </Text>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent style={{ gap: 16 }}>
                      <div style={{ gap: 8 }}>
                        <div className="flex-row items-center gap-2 flex">
                          <Calendar size={16} className="text-gray-400" />
                          <Text className="text-sm text-gray-400">Início:</Text>
                          <Text className="text-sm font-medium text-white">
                            {new Date(rent.startDate).toLocaleDateString('pt-BR')}
                          </Text>
                        </div>
                        {rent.expectedReturnDate && (
                          <div className="flex-row items-center gap-2 flex">
                            <Clock size={16} className="text-gray-400" />
                            <Text className="text-sm text-gray-400">Devolução:</Text>
                            <Text
                              className={`text-sm font-medium ${
                                overdue ? 'text-red-400' : 'text-white'
                              }`}
                            >
                              {new Date(rent.expectedReturnDate).toLocaleDateString('pt-BR')}
                            </Text>
                            {daysUntilReturn !== null && (
                              <Text
                                className={`text-xs ml-2 ${
                                  overdue
                                    ? 'text-red-400 font-semibold'
                                    : daysUntilReturn <= 3
                                    ? 'text-yellow-500'
                                    : 'text-gray-400'
                                }`}
                              >
                                ({overdue ? `${Math.abs(daysUntilReturn)} dias atrasado` : `${daysUntilReturn} dias restantes`})
                              </Text>
                            )}
                          </div>
                        )}
                      </div>

                      {hasFine && rent.fineAmount && (
                        <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                          <div className="flex-row items-center gap-2 flex">
                            <AlertTriangle size={18} className="text-red-400" />
                            <Text className="text-sm font-semibold text-red-400">
                              Multa por atraso: R$ {parseFloat(rent.fineAmount).toFixed(2)}
                            </Text>
                          </div>
                          <Text className="text-xs text-red-400/80 mt-1">
                            {rent.daysOverdue} dia{rent.daysOverdue !== 1 ? 's' : ''} de atraso
                          </Text>
                        </div>
                      )}

                      <Button
                        onClick={() => handleReturn(rent.id, gameTitle)}
                        disabled={returnRentMutation.isPending}
                        variant={overdue ? 'destructive' : 'default'}
                        className="w-full mt-2">
                        {returnRentMutation.isPending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                        ) : (
                          <div className="flex-row items-center gap-2 flex">
                            <CheckCircle size={20} className="text-white" />
                            <Text className="ml-2 font-semibold text-white">Devolver Jogo</Text>
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

