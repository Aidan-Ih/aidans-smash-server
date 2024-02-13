const runNutbot = () => {
    const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
    const fs = require('node:fs');
    const path = require('node:path');
    require('dotenv').config();
    token = process.env.NUTBOT_TOKEN
    // Create a new client instance
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

    client.commands = new Collection();

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    // When the client is ready, run this code (only once).
    // It makes some properties non-nullable.
    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on("messageCreate", message => {
        // weegee: 369305001211854858
        if (message.author.id === "369305001211854858") {
            const content = message.content;
            if (content === content.toUpperCase()) {
                const lower = content.toLowerCase()
                message.channel.send("Message From Weegee: " + lower.charAt(0).toUpperCase() + lower.slice(1));
                message.delete(1000);
            }

        }
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // Log in to Discord with your client's token
    client.login(token);
}

module.exports = runNutbot;