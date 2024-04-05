import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, token } from './config.json';
import fs from 'fs';
import path from 'path';

const commands = [];
const commandsPath = path.join(__dirname, '..', '/bot_functions');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Starting the process of registering application commands (/) globally.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Application commands (/) registered globally successfully.');
    } catch (error) {
        console.error(error);
    }
})();
