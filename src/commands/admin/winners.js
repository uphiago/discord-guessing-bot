const { getRunningGames } = require('../../datastore/store');

const showWinners = async (msg, word) => {
    const games = getRunningGames(msg.guild.id);
    const game = games.find(game => game.word.toLowerCase() === word.toLowerCase());

    if (!game) {
        await msg.reply("There are no active or completed games with that word.");
        return;
    }

    if (game.winners.length > 0) {
        const winnersList = game.winners.map(id => `<@${id}>`).join(', ');
        await msg.reply(`The winners for the word "${word}" are: ${winnersList}`);
    } else {
        await msg.reply(`There are no winners for the word yet "${word}".`);
    }
};

module.exports = { showWinners };