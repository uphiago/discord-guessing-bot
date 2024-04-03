const { getRunningGames } = require('../../datastore/store');

const showWinners = async (msg, word) => {
    const games = getRunningGames(msg.guild.id);
    const game = games.find(game => game.word.toLowerCase() === word.toLowerCase());

    if (!game) {
        await msg.reply("Não há jogos ativos ou concluídos com essa palavra.");
        return;
    }

    if (game.winners.length > 0) {
        // Mapeia cada ID de usuário para uma string de menção de usuário utilizando a sintaxe <@id>
        const winnersList = game.winners.map(id => `<@${id}>`).join(', ');
        await msg.reply(`Os ganhadores para a palavra "${word}" são: ${winnersList}`);
    } else {
        await msg.reply(`Ainda não há ganhadores para a palavra "${word}".`);
    }
};

module.exports = { showWinners };