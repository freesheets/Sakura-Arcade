import { useQuery } from '@tanstack/react-query';

export function getUsers() {
  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error('Erro ao buscar usuários');
        }
        const result = await response.json();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 3 * 60 * 1000,
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

