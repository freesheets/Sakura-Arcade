import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useReturnRent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rentId }) => {
      if (!rentId || (typeof rentId === 'number' && (isNaN(rentId) || rentId <= 0))) {
        throw new Error('ID do aluguel inválido');
      }

      const rentIdNum = typeof rentId === 'string' ? Number(rentId) : rentId;
      if (isNaN(rentIdNum) || rentIdNum <= 0 || !Number.isInteger(rentIdNum)) {
        throw new Error('ID do aluguel inválido');
      }

      const response = await fetch(`http://localhost:3000/rents/${rentIdNum}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao devolver jogo';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || error.message || errorMessage;
          } else {
            const text = await response.text();
            if (text) {
              errorMessage = text.length > 100 ? `${text.substring(0, 100)}...` : text;
            } else {
              errorMessage = `Erro ${response.status}: ${response.statusText}`;
            }
          }
        } catch (parseError) {
          errorMessage = `Erro ${response.status}: ${response.statusText || 'Erro ao processar resposta do servidor'}`;
        }
        
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (jsonError) {
        throw new Error('Resposta inválida do servidor');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rents'] });
    },
  });
}

