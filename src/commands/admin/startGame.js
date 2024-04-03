const embedBuilder = require("../../datastore/embedBuilder");
const { addNewGame } = require("../../datastore/store");

const startGame = async (msg, args) => {
    const matches = msg.content.match(/^(\$startgame\s+")(.+)"\s+(\d+)$/);

    if (!matches || matches.length < 4) {
        await msg.reply("Formato do comando incorreto. Use: $startgame \"palavra ou frase\" número_de_ganhadores");
        return;
    }

    const word = matches[2];
    const winnersLimit = parseInt(matches[3], 10);

    if (!addNewGame(msg.guild.id, word, winnersLimit)) {
        await msg.reply("Essa palavra já está sendo usada em um jogo ativo neste servidor.");
        return;
    }

    if (word.length > 500) {
        await msg.reply("A palavra/frase é longa demais. Por favor, tente novamente com menos de 500 caracteres.");
        return;
    }

    if (isNaN(winnersLimit) || winnersLimit < 1 || winnersLimit > 100) {
        await msg.reply("Por favor, forneça um número válido de ganhadores (entre 1 e 100).");
        return;
    }

    try {
        // The game has been added successfully at this point; prepare and send the embed.
        const gameStartEmbed = embedBuilder.gameStartEmbed(word, winnersLimit);
        await msg.channel.send({ embeds: [gameStartEmbed] });
    } catch(error) {
        // Catch block for catching and handling any errors that occur during the reply or embed sending process.
        await msg.reply(error.message);
    }
};

module.exports = { startGame };