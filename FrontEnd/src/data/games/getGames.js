import { useQuery } from '@tanstack/react-query';

export function getGames() {
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:3000/games');
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error('Erro ao buscar jogos');
        }
        const result = await response.json();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  return {
    isPending,
    error,
    data,
    isFetching,
    refetch,
  };
}

