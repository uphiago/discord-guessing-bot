let games = {};

// Permitir múltiplos jogos com um limite de 10 por servidor
const addNewGame = (guildId, word, winnersLimit) => {
    if (!games[guildId]) {
        games[guildId] = [];
    } else {
        // Verifica se algum jogo neste servidor já usa esta palavra
        const isWordUsed = games[guildId].some(game => game.word.toLowerCase() === word.toLowerCase());
        if (isWordUsed) {
            return false; // Indica que a palavra já está sendo usada e o novo jogo não foi adicionado
        }
    }

    if (games[guildId].length >= 10) {
        throw new Error("Limite máximo de jogos em andamento atingido.");
    }

    games[guildId].push({ word, winners: [], winnersLimit, gameId: `${guildId}-${games[guildId].length + 1}` });
    return true; // Indica sucesso na adição do novo jogo
};

const getRunningGames = (guildId) => {
    return games[guildId] || [];
};

const checkGameStarted = (guildId) => {
    // Agora verifica se existe um jogo ativo no servidor
    return !!games[guildId];
};

const recordWinner = (guildId, userId, gameId) => {
    const gameIndex = games[guildId].findIndex(game => game.gameId === gameId);
    
    if (gameIndex === -1) {
        console.log("Jogo não encontrado.");
        return "not_found";
    }

    const game = games[guildId][gameIndex];

    // Verifica se o usuário já é um ganhador
    if (game.winners.includes(userId)) {
        console.log("Este jogador já acertou a palavra.");
        return "already_won";
    }

    // Caso contrário, procede com o registro do novo ganhador
    if (game.winners.length < game.winnersLimit) {
        game.winners.push(userId);
        console.log("Jogador registrado.");
        return "success";
    }

    // Se o limite de ganhadores for atingido
    console.log("Limite de jogadores atingido.");
    return "limit_reached";
};

const deleteEntry = (guildId, word) => {
    if (games[guildId]) {
        const gameIndex = games[guildId].findIndex(game => game.word === word);
        
        if (gameIndex !== -1) {
            const [removedGame] = games[guildId].splice(gameIndex, 1); // Remove e captura o jogo
            if (games[guildId].length === 0) {
                delete games[guildId];
            }
            return removedGame; // Retorna o jogo removido
        }
    }
    return null; // Retornando null para indicar falha na remoção
};

module.exports = {
    addNewGame,
    getRunningGames,
    checkGameStarted,
    recordWinner,
    deleteEntry,
};