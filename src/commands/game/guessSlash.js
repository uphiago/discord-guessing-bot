const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRunningGames, deleteEntry, recordWinner } = require("../../datastore/store");
const embedBuilder = require('../../datastore/embedBuilder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Guess the word!')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word you think is correct')
				.setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const userWord = interaction.options.getString('word');

        if (userWord.length > 500) {
            const guessSizeErrorEmbed = embedBuilder.guessSizeErrorEmbed();
            await interaction.editReply({ embeds: [guessSizeErrorEmbed] });
            return;
        }

        const games = getRunningGames(interaction.guildId);
        if (games.length === 0) {
            await interaction.editReply("The game hasn't started yet.");
            return;
        }

        let outputMessage = "Sorry, that's not correct. Try again!"; // Mensagem padrão por defeito

        games.forEach(game => {
            if (game.word === userWord) {
                const result = recordWinner(interaction.guildId, interaction.user.id, game.gameId);
                
                switch (result) {
                    case "success":
                        outputMessage = `Congratulations! ${interaction.user.username} got the word right.`;
                        break;
                    case "limit_reached":
                        outputMessage = "This guess has already reached the maximum number of winners.";
                        break;
                    case "already_won": // Lida com o caso de já ter acertado antes.
                        outputMessage = `You have already guessed the word correctly, ${interaction.user.username}!`;
                        break;
                    case "not_found":
                        outputMessage = "Game not found.";
                        break;
                    default:
                        outputMessage = "An unexpected error occurred.";
                        break;
                }
            }
        });

        await interaction.editReply(outputMessage);
    },
};