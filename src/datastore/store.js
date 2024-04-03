let games = {};

const addNewGame = (guildId, word, winnersLimit) => {
    if (!games[guildId]) {
        games[guildId] = [];
    } else {
        const isWordUsed = games[guildId].some(game => game.word.toLowerCase() === word.toLowerCase());
        if (isWordUsed) {
            return false;
        }
    }

    if (games[guildId].length >= 10) {
        throw new Error("Maximum number of ongoing games reached.");
    }

    games[guildId].push({ word, winners: [], winnersLimit, gameId: `${guildId}-${games[guildId].length + 1}` });
    return true;
};

const getRunningGames = (guildId) => {
    return games[guildId] || [];
};

const checkGameStarted = (guildId) => {
    return !!games[guildId];
};

const recordWinner = (guildId, userId, gameId) => {
    const gameIndex = games[guildId].findIndex(game => game.gameId === gameId);
    
    if (gameIndex === -1) {
        return "not_found";
    }

    const game = games[guildId][gameIndex];

    if (game.winners.includes(userId)) {
        return "already_won";
    }

    if (game.winners.length < game.winnersLimit) {
        game.winners.push(userId);
        return "success";
    }

    return "limit_reached";
};

const deleteEntry = (guildId, word) => {
    if (games[guildId]) {
        const gameIndex = games[guildId].findIndex(game => game.word === word);
        
        if (gameIndex !== -1) {
            const [removedGame] = games[guildId].splice(gameIndex, 1);
            if (games[guildId].length === 0) {
                delete games[guildId];
            }
            return removedGame;
        }
    }
    return null;
};

module.exports = {
    addNewGame,
    getRunningGames,
    checkGameStarted,
    recordWinner,
    deleteEntry,
};