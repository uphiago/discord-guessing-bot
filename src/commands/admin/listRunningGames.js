const { getRunningGames } = require('../../datastore/store');
const { MessageEmbed } = require('discord.js'); // Se não estiver importando em outro local

const listRunningGames = async (msg) => {
    const runningGames = getRunningGames(msg.guild.id);

    if (runningGames.length === 0) {
        await msg.channel.send("Atualmente, não há jogos em andamento.");
        return;
    }

    const embed = new MessageEmbed()
        .setTitle("Jogos em andamento")
        .setColor("#0099ff");

        runningGames.forEach((game, index) => {
            embed.addFields({
                name: `Jogo ${index + 1}`,
                value: `Palavra/Frase: **${game.word}**\nLimite de Ganhadores: **${game.winnersLimit}**\nGanhadores Atuais: **${game.winners.length}/${game.winnersLimit}**`,
                inline: false
            });
        });

    await msg.channel.send({ embeds: [embed] });
};

module.exports = { listRunningGames };