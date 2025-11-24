import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateRent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rent) => {
      const response = await fetch('http://localhost:3000/rents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rent),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar aluguel');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

