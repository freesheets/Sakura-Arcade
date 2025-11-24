export async function createGame(game) {
  try {
    const response = await fetch('http://localhost:3000/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar jogo');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

