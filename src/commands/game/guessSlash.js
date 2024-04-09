import { SlashCommandBuilder } from '@discordjs/builders';
import { getRunningGames, recordWinner, addPointsForTry, addPointsForWin } from "../../datastore/store.js";
import embedBuilder from '../../datastore/embedBuilder.js';
import { getConfig } from "../../datastore/config.js";

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
        const { guesstry, guesswin } = getConfig(); 

        const userWord = interaction.options.getString('word').toLowerCase();

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

        let replyEmbed = null;
        let guessedCorrectly = false;

        for (const game of games) {
            if (game.word.toLowerCase() === userWord) {
                guessedCorrectly = true;
                const result = recordWinner(interaction.guildId, interaction.user.id, game.gameId);
                
                switch (result) {
                    case "success":
                        addPointsForWin(interaction.guildId, interaction.user.id, guesswin);
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
                break;
            }
        }

        if (!guessedCorrectly) {
            addPointsForTry(interaction.guildId, interaction.user.id, guesstry);
            replyEmbed = embedBuilder.failGuessEmbed(interaction.user.username, userWord);
        }

        if (replyEmbed) {
            await interaction.editReply({ embeds: [replyEmbed] });
        } else {
            await interaction.editReply("There was an error processing your guess.");
        }
    },
};