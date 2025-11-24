export async function updateGame(gameId, game) {
  try {
    const response = await fetch(`http://localhost:3000/games/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar jogo');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

