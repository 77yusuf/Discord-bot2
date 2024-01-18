const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();
client.prefix = new Map();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
const prefixFolders = fs.readdirSync("./src/prefix").filter((f) => f.endsWith(".js"));

for (arx of prefixFolders) {
    const Cmd = require('./prefix/' + arx)
    client.prefix.set(Cmd.name, Cmd)
}

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

// prefix commands messageCreate

client.on('messageCreate', async message => {
    const prefix = "?";

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const prefixcmd = client.prefix.get(command);
    if (prefixcmd) {
        prefixcmd.run(client, message, args)
    }
});

// Ticket System

const { createTranscript} = require('discord-html-transcripts');
// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');



// ticket System code

const ticketSchema = require('./Schemas/ticketSchema');

client.on(Events.InteractionCreate, async (interaction) => {
    const { customId, guild, channel } = interaction;
    if (interaction.isButton()) {
        if (customId === "ticket") {
            let data = await ticketSchema.findOne({
                GuildID: interaction.guild.id,
            });

            if (!data) return await interaction.reply({ content: "Das Ticket System ist noch nicht im Betrieb!", 
            ephemeral: true });

            const role = guild.roles.cache.get(data.Role)
            const cate = data.Category;
            const posChannel = interaction.guild.channels.cache.find(c => c.topic && c.topic.includes(`Ticket Besitzer: ${interaction.user.id}`))

            if (posChannel) {
                return await interaction.reply({ content: `Du hast bereits ein offenes Ticket: <#${posChannel.id}>`,
            ephemeral: true })
            }
            
            await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                parent: cate,
                type: ChannelType.GuildText,
                topic: `Ticket Besitzer: ${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: role.id,
                        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                    },
                    {
                        id: interaction.member.id,
                        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                    },
                ],
            }).then(async (channel) => {
                const openembed = new EmbedBuilder()
                .setColor(`#00c7fe`)
                .setTitle("Ticket Erstellt")
                .setDescription(`Willkommen in deinem Ticket **${interaction.user.username}**!\n Reagiere mit 🔒 um dein Ticket wieder zu schließen`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({ text: `${interaction.guild.name}´s Tickets`})


                const closeButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('closeticket')
                        .setLabel('Schließen')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒')
                    )
                    await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })

                    const openTicket = new EmbedBuilder()
                    .setDescription(`Ticket erstellt in <#${channel.id}>`)

                    await interaction.reply({ embeds: [openTicket], ephemeral: true })  
            })
        }

        if (customId === "closeticket") {
            const closingEmbed = new EmbedBuilder()
            .setDescription('🔒 Bist du dir sicher, dass du das Ticket schließen möchtest?')
            .setColor('DarkRed')

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('yesclose')
                .setLabel('Ja')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✅'),

                new ButtonBuilder()
                .setCustomId('nodont')
                .setLabel('Nein')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
            )

            await interaction.reply({ embeds: [closingEmbed], components: [buttons]})
        }

        if (customId === "yesclose") {
            let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
            const transcript = await createTranscript(channel, {
                limit: -1,
                returnBuffer: false,
                filename: `ticket-${interaction.user.username}.html`,
            });

            const transcriptEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}´s Transcripts`, iconURL: guild.iconURL() })
            .addFields(
                { name: `Geschlossen von`, value: `${interaction.user.tag}` } 
            )
            .setColor('Red')
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: `${interaction.guild.name}´s Tickets`})


            const processEmbed = new EmbedBuilder()
            .setDescription('Ticket wird in 10 sekunden geschlossen...')
            .setColor('Red')

            await interaction.reply({ embeds: [processEmbed] })

            await guild.channels.cache.get(data.Logs).send({
                embeds: [transcriptEmbed],
                files: [transcript],
            });

            setTimeout(() => {
                interaction.channel.delete()

            }, 10000);
        }
        if (customId === "nodont") {
            const noEmbed = new EmbedBuilder()
            .setDescription('Das Ticket wird nicht geschlossen!')
            .setColor('Red')

            await interaction.reply({ embeds: [noEmbed], ephemeral: true })
        }
    }
})