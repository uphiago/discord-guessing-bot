const { checkGameStarted, getWordForGroup, deleteEntry } = require("../../datastore/store")
const embedBuilder = require('../../datastore/embedBuilder');

const checkGuessedWord = async (msg, userWord) => {
    if (!userWord || userWord.length === 0) {
        const embed = embedBuilder.guessResultEmbed('noGuess', userWord);
        await msg.reply({ embeds: [embed] });
        return;
    }

    if (!checkGameStarted(msg.guildId)) {
        const embed = embedBuilder.guessResultEmbed('noGame');
        await msg.reply({ embeds: [embed] });
        return;
    }

    const botWord = getWordForGroup(msg.guildId);
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
        const embed = embedBuilder.guessResultEmbed('correct', userWord, botWord, replyList);
        await msg.reply({ embeds: [embed] });
        deleteEntry(msg.guildId);
    } else if (botWord.length !== userWord.length) {
        const embed = embedBuilder.guessResultEmbed('lengthError', userWord, botWord, replyList);
        await msg.reply({ embeds: [embed] });
    } else {
        const embed = embedBuilder.guessResultEmbed('incorrect', userWord, botWord, replyList);
        await msg.reply({ embeds: [embed] });
    }
};

module.exports.checkGuessedWord = checkGuessedWord