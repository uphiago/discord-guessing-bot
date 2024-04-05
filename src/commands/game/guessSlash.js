import { SlashCommandBuilder } from '@discordjs/builders';
import { getRunningGames, recordWinner } from "../../datastore/store.js";
import embedBuilder from '../../datastore/embedBuilder.js';

export default {
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

        let outputMessage = null;
        let replyEmbed = null;

        games.forEach(game => {
            if (game.word === userWord) {
                const result = recordWinner(interaction.guildId, interaction.user.id, game.gameId);
                
                switch (result) {
                    case "success":
                        replyEmbed = embedBuilder.successGuessEmbed(interaction.user.username, game.word);
                        break;
                    case "limit_reached":
                        replyEmbed = embedBuilder.limitGuessEmbed(interaction.user.username, game.word);
                        break;
                    case "already_won":
                        replyEmbed = embedBuilder.winnerGuessEmbed(interaction.user.username, game.word);
                        break;
                    case "not_found":
                        replyEmbed = embedBuilder.notfoundGuessEmbed(interaction.user.username, game.word);
                        break;
                    default:
                        replyEmbed = embedBuilder.errorGuessEmbed(interaction.user.username, game.word);
                        break;
                }
            }
            else if (game.word !== userWord) {
                replyEmbed = embedBuilder.failGuessEmbed(interaction.user.username, game.word);
            }
        });

        if (replyEmbed) {
            await interaction.editReply({ content: outputMessage, embeds: [replyEmbed] });
        } else {
            await interaction.editReply({ content: outputMessage });
        }
    },
};

