const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkGameStarted, getWordForGroup, deleteEntry } = require("../../datastore/store");
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

        if (!checkGameStarted(interaction.guildId)) {
            await interaction.editReply("The game hasn't started yet.");
            return;
        }

        const botWord = getWordForGroup(interaction.guildId);
        const replyList = [];
        let flag = false;

        for (let i = 0; i < userWord.length; i++) {
            if (i < botWord.length && userWord[i] === botWord[i]) {
                replyList.push(userWord[i]);
            } else {
                flag = true;
                replyList.push("-");
            }
        }

        if (!flag && botWord.length === userWord.length) {
            await interaction.editReply(`Congratulations! ${interaction.user.username} got the word right. (${botWord})`);
            deleteEntry(interaction.guildId);
        } else if (botWord.length !== userWord.length) {
            await interaction.editReply(`The size of the guessed word is incorrect. Please guess a word with ${botWord.length} letters.`);
        } else {
            await interaction.editReply(`${userWord} -> ${replyList.join("")}`);
        }
    },
};