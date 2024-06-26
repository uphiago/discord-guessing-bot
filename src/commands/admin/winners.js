import embedBuilder from "../../datastore/embedBuilder.js";
import { getRunningGames } from '../../datastore/store.js';

const showWinners = async (msg, word) => {
    const games = getRunningGames(msg.guild.id);
    const game = games.find(game => game.word === word);

    if (!game) {
        const embed = embedBuilder.customErrorEmbed(
            'Game Not Found',
            `There are no active or completed games with the word "${word}".`
        );
        await msg.reply({ embeds: [embed] });
        return;
    }

    if (game.winners.length > 0) {
        const winnersList = game.winners.map(id => `<@${id}>`).join(', ');
        const embed = embedBuilder.customErrorEmbed(
            'Winners',
            `The winners for the word "${word}" are: ${winnersList}`
        );
        await msg.reply({ embeds: [embed] });
    } else {
        const embed = embedBuilder.customErrorEmbed(
            'No Winners',
            `There are no winners for the word "${word}" yet.`
        );
        await msg.reply({ embeds: [embed] });
    }
};

export { showWinners };