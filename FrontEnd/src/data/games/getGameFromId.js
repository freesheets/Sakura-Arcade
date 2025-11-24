import { useQuery } from '@tanstack/react-query';

export function getGameFromId(id) {
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ['games', id],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/games');
      const games = await response.json();
      return games.find((game) => game.uuid === id || String(game.id) === String(id));
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return {
    isPending,
    error,
    data,
    isFetching,
    refetch,
  };
}

