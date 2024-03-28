const  discord = require("discord.js")
const env = require("dotenv")
const { startGame } = require("./bot_functions/startGame.js")
const { checkGuessedWord } = require("./bot_functions/guessCommand.js")
const { deleteEntry, isGameActive } = require("./datastore/store.js");
const embedBuilder = require("./datastore/embedBuilder.js");
const { configureWarnChannel } = require("./datastore/warnRoom.js");
const guessCommand = require("./bot_functions/guessSlash.js");
env.config()

const client = new discord.Client( { intents: ["DIRECT_MESSAGES","GUILD_MESSAGES","GUILDS"] } )
const validCommands = ['help', 'startgame', 'guess', 'endgame', 'warnroom'];

client.on("ready",() => {
    console.log("Bot up and running")
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'guess') {
        const userWord = interaction.options.getString('palavra');
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