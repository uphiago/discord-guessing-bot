const { MessageEmbed } = require('discord.js');

const embedBuilder = {

    customErrorEmbed: (title, description, fields = []) => {
        let embed = new MessageEmbed()
            .setColor('#FF5555')
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: 'Please, try again!' })
            .setTimestamp();

        if (fields.length > 0) {
            embed = embed.addFields(fields);
        }

        return embed;
    },

    warnErrorEmbed: (errorType, details = '') => {
        const errorTypes = {
            'configNotFound': {
                title: 'Canal de Avisos Não Configurado',
                description: 'Try `$warnroom <ID do canal>` to set the channel.'
            },
            'fetchError': {
                title: 'Error when searching for Channel',
                description: 'There was an error trying to search for the announcement channel.'
            },
            'channelNotFound': {
                title: 'Channel not found',
                description: 'The specified channel was not found on the server.'
            },
        };

        const error = errorTypes[errorType] || {
            title: 'Erro Desconhecido',
            description: 'Um erro desconhecido ocorreu.'
        };

        let finalDescription = error.description;
        if (details) {
            finalDescription += ` Detalhes: ${details}`;
        }

        return embedBuilder.customErrorEmbed(error.title, finalDescription);
    },

    helpEmbed: () => {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Word Gessing Bot')
            .setDescription('How the commands work?')
            .addFields(
                { name: '$startgame <word>', value: 'Starts a new game. **Admins.**', inline: false },
                { name: '$guess <word>', value: 'Try to guess the word. **Admins.**', inline: false },
                { name: '$endgame', value: 'Finish the game. **Admins.**', inline: false },
                { name: '$help', value: 'Open settings help. **Admins .**', inline: false },
                { name: '$warnroom', value: 'Set warn channel $warnroom channelId. **Admins.**', inline: false },
                { name: '/guess <word>', value: 'Try to guess the word. **Players.** (this slash only works after deploy on server)', inline: false }
            )
            .setFooter({ text: 'Enjoy it!' })
            .setTimestamp();
    },

    wordErrorEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Word Gessing Bot')
        .setDescription('You need to pick a word! Try: $startgame <word>')
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    gameStartEmbed: (word) => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Game Started!')
        .setDescription(`The members now can try to guess the word: ${word}`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    warnStartEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Game Started!!!')
        .setDescription(`Try to guess the word:`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    tryGuessEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Game Started!!!')
        .setDescription(`You need to use $guess <word>`)
        .setFooter({ text: 'Enjoy it!' })
    },

    endGameEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Word Gessing Bot')
        .setDescription(`The Game Has Ended!`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    commandErrorEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Word Gessing Bot')
        .setDescription(`I don't know this command, Try again!`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    warnSuccessEmbed: (channelId) => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Word Gessing Bot')
        .setDescription(`The warn channel as been set to <#${channelId}>`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    guessInactiveEmbed: () => {
        return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Word Gessing Bot')
        .setDescription(`No game running!`)
        .setFooter({ text: 'Enjoy it!' })
        .setTimestamp();
    },

    guessResultEmbed: (result, userWord, correctWord, replyList) => {
        let embed = new MessageEmbed()
            .setTitle('Word Guessing Bot');
        
        switch(result) {
            case 'correct':
                embed.setColor('#00C800');
                embed.setDescription(`Congrats! You guessed the correct word: ${correctWord}`);
                break;
            case 'incorrect':
                embed.setColor('#FF5555');
                embed.setDescription(`Guess: ${userWord} -> ${replyList.join("")}`)
                     .setFooter({ text: 'Try again!' });
                break;
            case 'lengthError':
                embed.setColor('#FF5555');
                embed.setDescription(`The guessed word length is incorrect. Please guess a word with ${correctWord.length} letters.`);
                break;
            case 'noGame':
                embed.setColor('#FF5555');
                embed.setDescription(`No game running! Please ask admin to $startgame`);
                break;
            default:
                embed.setColor('#FF5555');
                embed.setDescription(`Error! Try running $guess <word>`);
        }
        
        return embed;
    },
    


};

module.exports = embedBuilder;
