import React from 'react';
import { GameCard } from './GameCard';
import { LibraryGameCard } from './LibraryGameCard';
import { Text } from '../ui/Text';

export function GameGrid({ games, isLibrary = false, activeRents = [], onRentReturned, showDeleteButton = false, onGameDeleted, onGameEdit }) {
  const getRentIdForGame = (gameId) => {
    const gameIdNum = typeof gameId === 'string' ? Number(gameId) : gameId;
    if (isNaN(gameIdNum) || gameIdNum <= 0) return null;
    const rent = activeRents.find(r => r.gameId === gameIdNum);
    return rent?.id || null;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
        {games.map((game, index) => {
          const rentId = isLibrary ? getRentIdForGame(game.id) : null;
          
          return (
            <div 
              key={game.uuid}
              className="game-card-animate"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}>
              {isLibrary && rentId ? (
                <LibraryGameCard game={game} rentId={rentId} onReturned={onRentReturned} />
              ) : (
                <GameCard 
                  game={game} 
                  showDeleteButton={showDeleteButton}
                  onDeleted={onGameDeleted}
                  onEdit={onGameEdit}
                />
              )}
            </div>
          );
        })}
      </div>

      {games.length === 0 && (
        <div className="items-center justify-center py-12 flex">
          <Text className="text-gray-400 text-lg">Nenhum jogo encontrado</Text>
        </div>
      )}
    </div>
  );
}
