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
                { name: '$startgame <word>', value: 'Starts a new game.', inline: false },
                { name: '$endgame <word>', value: 'Finish the game.', inline: false },
                { name: '$help', value: 'Open settings help.', inline: false },
                { name: '$running', value: 'Show all games running.', inline: false },
                { name: '$winners <word>', value: 'Show the winners.', inline: false },
                { name: '/guess <word>', value: 'Try to guess the word. **Players.**', inline: false }
            )
            .setFooter({ text: 'Enjoy it!' })
            .setTimestamp();
    },

    guessSizeErrorEmbed: () => {
        return new MessageEmbed()
        .setColor('#FF5555')
        .setTitle('Guess Too Long')
        .setDescription('Your guess exceeds the maximum size limit of 500 characters! Please, try a shorter word.')
        .setFooter({ text: 'Please, try again with a shorter word!' })
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
};

module.exports = embedBuilder;
