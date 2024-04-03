const  discord = require("discord.js")
const { startGame } = require("./commands/admin/startGame.js")
const { wordToEnd } = require("./commands/admin/endGame.js")
const { checkGuessedWord } = require("./commands/game/guessCommand.js")
const { listRunningGames } = require("./commands/admin/listRunningGames.js");
const guessCommand = require("./commands/game/guessSlash.js");
const embedBuilder = require("./datastore/embedBuilder.js");
const { showWinners } = require("./commands/admin/winners.js");
require("dotenv").config()

const client = new discord.Client( { intents: ["DIRECT_MESSAGES","GUILD_MESSAGES","GUILDS"] } )
const validCommands = ['help', 'startgame', 'endgame', 'running', 'winners'];

client.on("ready",() => {
    console.log("Bot up and running")
})

process.on('unhandledRejection', error => {
    console.error('unhandledRejection:', error);
});
process.on('uncaughtException', error => {
    console.error('uncaughtException:', error);
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (!interaction.guildId) {
        await interaction.reply("I don't talk with strangers.");
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'guess') {
        await guessCommand.execute(interaction);
    }
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot || !msg.content.startsWith("$")) return;
    
    const contentArray = msg.content.substring(1).split(" ");
    const command = contentArray[0]; 
    const args = contentArray.slice(1);

    if (!validCommands.includes(command)) {
        return;
    }

    if (!msg.member.permissions.has("ADMINISTRATOR")) {
        return;
    }

        switch (command) {
            case "help":
                const helpEmbed = embedBuilder.helpEmbed();
                await msg.reply({ embeds: [helpEmbed] });
                break;
            case "startgame":
                startGame(msg, args); 
                break;
            // case "guess":
            //     checkGuessedWord(msg, args.join(" "));
            //     break;
            case "winners":
                const word = args.join(' '); // Junta os argumentos de volta em uma string
                showWinners(msg, word);
                break;
            case "endgame":
                wordToEnd(msg);
                break;
            case "running":
                listRunningGames(msg);
                break;
            default:
                const commandErrorEmbed = embedBuilder.commandErrorEmbed();
                await msg.reply({ embeds: [commandErrorEmbed] });
        }
    });


client.login(process.env.BOT_TOKEN)