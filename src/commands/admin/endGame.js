const { deleteEntry } = require("../../datastore/store");
const embedBuilder = require('../../datastore/embedBuilder');

// Definindo `wordToEnd` como uma função assíncrona
async function wordToEnd(msg) {
    const contentArray = msg.content.split(" ");
    const wordToEnd = contentArray.slice(1).join(" ");

    if (!wordToEnd) {
        await msg.reply("Por favor, forneça a palavra do jogo que deseja terminar.");
        return;
    }

    const removedGame = deleteEntry(msg.guildId, wordToEnd);

    if (removedGame) {
        // Construa uma mensagem mostrando os ganhadores antes de enviar
        let winnerMessage = "Não houve ganhadores para este jogo.";
        
        if (removedGame.winners && removedGame.winners.length > 0) {
            const winnersList = removedGame.winners.map(id => `<@${id}>`).join(', ');
            winnerMessage = `Os ganhadores são: ${winnersList}`;
        }

        const endGameEmbed = embedBuilder.endGameEmbed(); // Este embed pode incluir informações básicas do jogo
        // Você pode querer personalizar o embed para incluir a `winnerMessage` ou enviar separadamente:
        await msg.reply({ embeds: [endGameEmbed], content: winnerMessage });
    } else {
        await msg.reply("Não foi possível encontrar um jogo com a palavra especificada.");
    }
}

module.exports = { wordToEnd };