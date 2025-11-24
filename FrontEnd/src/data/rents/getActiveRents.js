import { useQuery } from '@tanstack/react-query';

export function getActiveRents(userId) {
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ['rents', 'active', userId],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:3000/rents/active');
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error('Erro ao buscar aluguéis ativos');
        }
        const result = await response.json();
        let rents = Array.isArray(result) ? result : [];
        
        if (userId) {
          rents = rents.filter((rent) => {
            return rent.userId === userId;
          });
        }
        
        return rents;
      } catch (error) {
        return [];
      }
    },
    enabled: userId !== undefined && userId !== null,
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });

  return {
    isPending,
    error,
    data,
    isFetching,
    refetch,
  };
}

