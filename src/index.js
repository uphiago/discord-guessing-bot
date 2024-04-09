import { Client, GatewayIntentBits } from "discord.js";
import dotenv from 'dotenv';
import { startGame } from "./commands/admin/startGame.js";
import { listRunningGames } from "./commands/admin/listRunning.js";
import { showWinners } from "./commands/admin/winners.js";
import wordToEnd from "./commands/admin/endGame.js"
import guessCommand from "./commands/game/guessSlash.js";
import embedBuilder from "./datastore/embedBuilder.js";
import { displayTopPlayers } from "./datastore/userRanking.js";
import { updatePointsForTry, updatePointsForWin } from "./datastore/config.js";

dotenv.config();

const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ],
})
const validCommands = ['help', 'startgame', 'endgame', 'running', 'winners', 'guesstry', 'guesswin', 'ranking'];

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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
            case "help": {
                const helpEmbed = embedBuilder.helpEmbed();
                await msg.reply({ embeds: [helpEmbed] });
                break;
            }
            case "startgame": {
                startGame(msg, args); 
                break;
            }
            case "winners": {
                const word = args.join(' ');
                showWinners(msg, word);
                break;
            }
            case "endgame": {
                wordToEnd(msg);
                break;
            }
            case "running": {
                listRunningGames(msg);
                break;
            }
            case "guesstry": {
                const newTryPoints = parseInt(args[0], 10);
                updatePointsForTry(newTryPoints);
                msg.reply(`Pontos por tentativa atualizados para: ${newTryPoints}`);
                break;
            }
            case "guesswin": {
                const newWinPoints = parseInt(args[0], 10);
                updatePointsForWin(newWinPoints);
                msg.reply(`Pontos por vitória atualizados para: ${newWinPoints}`);
                break;
            }
            case "ranking": {
                displayTopPlayers(msg.guild.id, msg);
                break;
            }
            default: {
                const commandErrorEmbed = embedBuilder.commandErrorEmbed();
                await msg.reply({ embeds: [commandErrorEmbed] });
            }
        }
    });


client.login(process.env.BOT_TOKEN)