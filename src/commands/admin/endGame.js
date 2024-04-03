const { deleteEntry } = require("../../datastore/store");
const embedBuilder = require('../../datastore/embedBuilder');

async function wordToEnd(msg) {
    const contentArray = msg.content.split(" ");
    const wordToEnd = contentArray.slice(1).join(" ");

    if (!wordToEnd) {
        await msg.reply("Please provide the game word you wish to end.");
        return;
    }

    const removedGame = deleteEntry(msg.guildId, wordToEnd);

    if (removedGame) {
        let winnerMessage = "There were no winners for this game.";
        
        if (removedGame.winners && removedGame.winners.length > 0) {
            const winnersList = removedGame.winners.map(id => `<@${id}>`).join(', ');
            winnerMessage = `The winners are: ${winnersList}`;
        }

        const endGameEmbed = embedBuilder.endGameEmbed();
        await msg.reply({ embeds: [endGameEmbed], content: winnerMessage });
    } else {
        await msg.reply("Could not find a game with the specified word.");
    }
}

module.exports = { wordToEnd };