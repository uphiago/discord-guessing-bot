const embedBuilder = require("../../datastore/embedBuilder");
const { addNewEntry } = require("../../datastore/store");
//const { verifyWarnChannel } = require("../datastore/warnRoom");

const startGame = async (msg, word) => {
    if (!word) {
        const wordErrorEmbed = embedBuilder.wordErrorEmbed(word);
        await msg.reply({ embeds: [wordErrorEmbed] });
        return;
    }

    if (word.length > 500) {
        const wordSizeErrorEmbed = embedBuilder.wordErrorEmbed();
        await msg.reply({ embeds: [wordSizeErrorEmbed] });
        return;
    }

    //use this to work with announcements room,
    //const warnChannel = await verifyWarnChannel(msg);
    //if (!warnChannel) return;

    // const warnStartEmbed = embedBuilder.warnStartEmbed();
    // await warnChannel.send({ embeds: [warnStartEmbed] });

    addNewEntry(msg.guildId, word);

    const gameStartEmbed = embedBuilder.gameStartEmbed(word);
    await msg.channel.send({ embeds: [gameStartEmbed] });
};

module.exports.startGame = startGame;
