const  discord = require("discord.js")
const { startGame } = require("./commands/admin/startGame.js")
const { checkGuessedWord } = require("./commands/game/guessCommand.js")
const { deleteEntry } = require("./datastore/store.js");
const { configureWarnChannel } = require("./commands/admin/warnRoom.js");
const guessCommand = require("./commands/game/guessSlash.js");
const embedBuilder = require("./datastore/embedBuilder.js");
require("dotenv").config()

const client = new discord.Client( { intents: ["DIRECT_MESSAGES","GUILD_MESSAGES","GUILDS"] } )
const validCommands = ['help', 'startgame', 'guess', 'endgame', 'warnroom'];

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
        await interaction.reply("Desculpe, mas eu não suporto comandos via Mensagem Direta.");
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'guess') {
        const userWord = interaction.options.getString('word');
        await guessCommand.execute(interaction);
    }
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.startsWith("$")) {
        const [command, ...args] = msg.content.substring(1).split(" ");

        if (!validCommands.includes(command)) {
            return;
        }
        // if you want to use $guess, just put "&& command !== "guess"" inside this if to open him to users
        // with $guess you can receive differents outputs when guessing
        if (!msg.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        switch (command) {
            case "help":
                const helpEmbed = embedBuilder.helpEmbed();
                await msg.reply({ embeds: [helpEmbed] });
                break;
            case "startgame":
                    startGame(msg, args.join(" "));
                break;
            case "guess":
                    checkGuessedWord(msg, args.join(" "));
                break;
            case "endgame":
                deleteEntry(msg.guildId);
                const endGameEmbed = embedBuilder.endGameEmbed();
                await msg.reply({ embeds: [endGameEmbed] });
                break;
            case "warnroom":
                await configureWarnChannel(msg, args);
                break;                
            default:
                const commandErrorEmbed = embedBuilder.commandErrorEmbed();
                await msg.reply({ embeds: [commandErrorEmbed] });
        }
    }
});


client.login(process.env.BOT_TOKEN)