import React from 'react';
import { Link } from 'react-router-dom';
import { useDeleteGame } from '../../data/games/deleteGame';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Edit, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Text } from '../ui/Text';
import { AlertService } from '../../services/AlertService';

export function GameCard({ game, showDeleteButton = false, onDeleted, onEdit }) {
  const deleteGameMutation = useDeleteGame();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const executeDelete = async (gameId) => {
    try {
      await deleteGameMutation.mutateAsync(gameId);
      await new Promise(resolve => setTimeout(resolve, 300));
      await queryClient.invalidateQueries({ queryKey: ['games'] });
      await queryClient.refetchQueries({ queryKey: ['games'] });
      if (onDeleted) {
        onDeleted();
      }
      AlertService.success('Sucesso', `"${game.title}" foi removido do catálogo com sucesso!`);
    } catch (error) {
      const errorMessage = error?.message || error?.error || 'Erro ao remover jogo. Tente novamente.';
      AlertService.error('Erro ao Remover', errorMessage);
    }
  };

  const handleDelete = async () => {
    let gameId = typeof game.id === 'string' ? Number(game.id) : game.id;
    
    if (isNaN(gameId) || gameId <= 0 || !Number.isInteger(gameId)) {
      AlertService.error('Erro', 'ID do jogo inválido. Não é possível remover este jogo.');
      return;
    }

    AlertService.confirm(
      'Remover Jogo',
      `Tem certeza que deseja remover "${game.title}" do catálogo?\n\nEsta ação não pode ser desfeita.`,
      () => executeDelete(gameId)
    );
  };

  const shouldShowDeleteButton = isAdmin && showDeleteButton;

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
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
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 h-full">
              <Text className="text-8xl">🎮</Text>
            </div>
          </Link>
        )}
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Botão Ver Detalhes no hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
          <Link to={`/games/${game.uuid}`} className="block">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg px-4 py-2.5 font-semibold text-white text-sm transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2">
              <Eye size={16} />
              Ver Detalhes
            </button>
          </Link>
        </div>
        
        {/* Badges e Botões */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {isAdmin && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(game);
              }}
              className="bg-blue-500/90 hover:bg-blue-500 rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-110 backdrop-blur-sm"
              title="Editar jogo">
              <Edit size={14} className="text-white" strokeWidth={2.5} />
            </button>
          )}
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
            className="text-sm font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200" 
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
          {shouldShowDeleteButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteGameMutation.isPending}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                deleteGameMutation.isPending 
                  ? 'bg-red-900/60 border border-red-700/50 cursor-not-allowed' 
                  : 'bg-red-900/40 border border-red-700/30 hover:bg-red-900/60 active:bg-red-900/70 cursor-pointer'
              }`}
              style={{
                boxShadow: deleteGameMutation.isPending
                  ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                  : '0 2px 8px rgba(239, 68, 68, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!deleteGameMutation.isPending) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!deleteGameMutation.isPending) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.1)';
                }
              }}>
              {deleteGameMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <Text className="text-white text-xs font-medium">
                    Removendo...
                  </Text>
                </>
              ) : (
                <>
                  <Trash2 size={16} className="text-red-400" strokeWidth={2.5} />
                  <Text className="text-red-400 text-xs font-bold">
                    Remover Jogo
                  </Text>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
