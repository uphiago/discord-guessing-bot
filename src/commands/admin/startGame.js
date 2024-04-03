const embedBuilder = require("../../datastore/embedBuilder");
const { addNewGame } = require("../../datastore/store");

const startGame = async (msg, args) => {
    const matches = msg.content.match(/^(\$startgame\s+")(.+)"\s+(\d+)$/);

    if (!matches || matches.length < 4) {
        await msg.reply("Incorrect command format. Use: $startgame \"word or phrase\" number_of_winners");
        return;
    }

    const word = matches[2];
    const winnersLimit = parseInt(matches[3], 10);

    if (word.length > 500) {
        await msg.reply("The word/phrase is too long. Please try again with fewer than 500 characters.");
        return;
    }

    if (isNaN(winnersLimit) || winnersLimit < 1 || winnersLimit > 100) {
        await msg.reply("Please provide a valid number of winners (between 1 and 100).");
        return;
    }

    if (!addNewGame(msg.guild.id, word, winnersLimit)) {
        await msg.reply("This word is already being used in an active game on this server. Run $running to see more.");
        return;
    }

    try {
        const gameStartEmbed = embedBuilder.gameStartEmbed(word, winnersLimit);
        await msg.channel.send({ embeds: [gameStartEmbed] });
    } catch(error) {
        await msg.reply(error.message);
    }
};

module.exports = { startGame };