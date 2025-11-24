import React from 'react';
import { Link } from 'react-router-dom';
import { useReturnRent } from '../../data/rents/returnRent';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { Text } from '../ui/Text';
import { AlertService } from '../../services/AlertService';

export function LibraryGameCard({ game, rentId, onReturned }) {
  const returnRentMutation = useReturnRent();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const executeReturn = async () => {
    if (!rentId || (typeof rentId === 'number' && (isNaN(rentId) || rentId <= 0))) {
      AlertService.error('Erro', 'ID do aluguel inválido. Não é possível devolver este jogo.');
      return;
    }

    try {
      const result = await returnRentMutation.mutateAsync({
        rentId,
      });

      await new Promise(resolve => setTimeout(resolve, 500));

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

      if (onReturned) {
        onReturned();
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      if (result.hasFine && result.daysOverdue > 0) {
        const message = `Jogo devolvido com sucesso!\n\nMulta por atraso: R$ ${parseFloat(result.fineAmount).toFixed(2)}\nDias de atraso: ${result.daysOverdue}`;
        AlertService.success('Devolução Processada', message);
      } else {
        AlertService.success('Sucesso', `"${game.title}" foi removido da sua biblioteca com sucesso!`);
      }
    } catch (error) {
      let errorMessage = 'Erro ao devolver jogo';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      AlertService.error('Erro', errorMessage);
    }
  };

  const handleReturn = () => {
    AlertService.confirm(
      'Confirmar Devolução',
      `Tem certeza que deseja devolver "${game.title}"?`,
      () => executeReturn()
    );
  };

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
      {/* Imagem do Jogo */}
      <div className="relative w-full overflow-hidden" style={{ height: '280px' }}>
        {game.imageUrl ? (
          <Link to={`/games/${game.uuid}`}>
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
        ) : (
          <Link to={`/games/${game.uuid}`}>
            <div className="flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 h-full">
              <Text className="text-8xl">🎮</Text>
            </div>
          </Link>
        )}
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge de Quantidade */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg">
            <Text className="text-[10px] text-white font-bold">
              {game.quantity} unid.
            </Text>
          </div>
        </div>

      </div>

      {/* Informações do Jogo */}
      <div className="p-4">
        <Link to={`/games/${game.uuid}`}>
          <Text 
            className="text-sm font-semibold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors duration-200" 
            style={{ 
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
            {game.title}
          </Text>
        </Link>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleReturn();
            }}
            disabled={returnRentMutation.isPending}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              returnRentMutation.isPending 
                ? 'bg-red-900/60 border border-red-700/50 cursor-not-allowed' 
                : 'bg-red-900/40 border border-red-700/30 hover:bg-red-900/60 active:bg-red-900/70 cursor-pointer'
            }`}
            style={{
              boxShadow: returnRentMutation.isPending
                ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                : '0 2px 8px rgba(239, 68, 68, 0.1)',
            }}
            onMouseEnter={(e) => {
              if (!returnRentMutation.isPending) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!returnRentMutation.isPending) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.1)';
              }
            }}>
            {returnRentMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <Text className="text-white text-xs font-medium">
                  Devolvendo...
                </Text>
              </>
            ) : (
              <>
                <Trash2 size={16} className="text-red-400" strokeWidth={2.5} />
                <Text className="text-red-400 text-xs font-bold">
                  Devolver Jogo
                </Text>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
