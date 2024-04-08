import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();
const clientId = process.env.BOT_ID;
const token = process.env.BOT_TOKEN;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const commands = [];
const commandsPath = path.join(__dirname, '..', '..', 'commands', 'game');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('BOT_ID:', clientId ? 'true' : 'false');
console.log('TOKEN:', token ? 'true' : 'false');
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ('default' in command && 'data' in command.default) {
        commands.push(command.default.data.toJSON());
    } else {
        console.log(`Erro ao carregar comando de: ${filePath}`);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Starting the process of registering application commands (/) globally.');
        console.log('Comandos que serão registrados:', commands);
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log('Application commands (/) registered globally successfully.');
        console.log('Comandos registrados com sucesso:', data);
    } catch (error) {
        console.error(error);
    }
})();