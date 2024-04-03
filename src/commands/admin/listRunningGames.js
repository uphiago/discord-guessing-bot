const { getRunningGames } = require('../../datastore/store');
const { MessageEmbed } = require('discord.js');

const listRunningGames = async (msg) => {
    const runningGames = getRunningGames(msg.guild.id);

    if (runningGames.length === 0) {
        await msg.channel.send("Currently, there are no games in progress.");
        return;
    }

    const embed = new MessageEmbed()
        .setTitle("Games Running")
        .setColor("#0099ff");

        runningGames.forEach((game, index) => {
            embed.addFields({
                name: `Game ${index + 1}`,
                value: `Word/Phrase: **${game.word}**\nWinners Limit: **${game.winnersLimit}**\nCurrent Winners: **${game.winners.length}/${game.winnersLimit}**`,
                inline: false
            });
        });

    await msg.channel.send({ embeds: [embed] });
};

module.exports = { listRunningGames };