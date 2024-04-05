const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRunningGames, recordWinner } = require("../../datastore/store");
const embedBuilder = require('../../datastore/embedBuilder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Guess the word!')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('Which word do you think is the right one?')
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

        let outputMessage = "Sorry, that's not correct. Try again!";

        games.forEach(game => {
            if (game.word === userWord) {
                const result = recordWinner(interaction.guildId, interaction.user.id, game.gameId);
                
                switch (result) {
                    case "success":
                        replyEmbed = embedBuilder.successGuessEmbed(interaction.user.username, game.word);
                        outputMessage = `Congratulations! ${interaction.user.username} got the word right.`;
                        break;
                    case "limit_reached":
                        replyEmbed = embedBuilder.limitGuessEmbed(interaction.user.username, game.word);
                        outputMessage = "This guess has already reached the maximum number of winners.";
                        break;
                    case "already_won":
                        replyEmbed = embedBuilder.winnerGuessEmbed(interaction.user.username, game.word);
                        outputMessage = `You have already guessed the word correctly, ${interaction.user.username}!`;
                        break;
                    case "not_found":
                        replyEmbed = embedBuilder.notfoundGuessEmbed(interaction.user.username, game.word);
                        outputMessage = "Game not found.";
                        break;
                    default:
                        replyEmbed = embedBuilder.successGuessEmbed(interaction.user.username, game.word);
                        outputMessage = "An unexpected error occurred.";
                        break;
                }
            }
        });

        await interaction.editReply(outputMessage);
    },
};