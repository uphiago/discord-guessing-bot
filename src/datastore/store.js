let games = {};
let ranking = {};

const addNewGame = (guildId, word, winnersLimit) => {
    if (!games[guildId]) {
        games[guildId] = [];
    } else {
        const isWordUsed = games[guildId].some(game => game.word === word);
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


const addPointsForTry = (guildId, userId, points) => {
    if (!ranking[guildId]) {
        ranking[guildId] = {};
    }
    if (!ranking[guildId][userId]) {
        ranking[guildId][userId] = 0;
    }
    ranking[guildId][userId] += points;
};

const addPointsForWin = (guildId, userId, points) => {
    addPointsForTry(guildId, userId, points);
};

const getTopPlayers = (guildId, limit = 10) => {
    const players = Object.entries(ranking[guildId] || {}).map(([userId, points]) => ({ userId, points }));
    return players.sort((a, b) => b.points - a.points).slice(0, limit);
};


export {
    addNewGame,
    getRunningGames,
    checkGameStarted,
    recordWinner,
    deleteEntry,
    addPointsForTry,
    addPointsForWin,
    getTopPlayers
};