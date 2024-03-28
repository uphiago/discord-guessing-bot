const { addNewEntry } = require("../datastore/store");
const { verifyWarnChannel } = require("../datastore/warnRoom");
const embedBuilder = require("../datastore/embedBuilder");

const startGame = async (msg, word) => {
    if (!word) {
        const wordErrorEmbed = embedBuilder.wordErrorEmbed(word);
        await msg.reply({ embeds: [wordErrorEmbed] });
        return;
    }
    
    const warnChannel = await verifyWarnChannel(msg);

    if (!warnChannel) return;

    addNewEntry(msg.guildId, word);

    const gameStartEmbed = embedBuilder.gameStartEmbed(word);
    await msg.channel.send({ embeds: [gameStartEmbed] });

    const warnStartEmbed = embedBuilder.warnStartEmbed();
    await warnChannel.send({ embeds: [warnStartEmbed] });
};

module.exports.startGame = startGame;
