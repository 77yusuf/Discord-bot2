const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField,
ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType, REST, Routes, ApplicationCommandOptionType } = require('discord.js');


const ticketSchema = require('../../Schemas/ticketSchema');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('Bereitet das Ticket-System vor.')
  .addChannelOption(option => option.setName('channel').setDescription('In diesen Channel wird das Ticket-Panel gesendet.').setRequired(true).addChannelTypes(ChannelType.GuildText))
  .addChannelOption(option => option.setName('kategorie').setDescription('In welcher Kategorie der Channel für die Tickets erstellt werden soll.').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
  .addRoleOption(option => option.setName('rolle').setDescription('Welche Rolle gepingt werden soll wenn ein Ticket erstellt wird.').setRequired(true))
  .addChannelOption(option => option.setName('ticket-logs').setDescription('In diesen Channel werden die Transcripte geschickt.').setRequired(true))
  .addStringOption(option => option.setName('beschreibung').setDescription('Das ist die Beschreibung des Ticket-Panels.')
  .setRequired(true).setMinLength(1).setMaxLength(1000))
  .addStringOption(option => option.setName('farbe').setDescription('Die Farbe des Panels.')
  .addChoices(
    {name: 'Rot', value: 'Red'},
    {name: 'Blau', value: 'Blue'},
    {name: 'Grün', value: 'Green'},
    {name: 'Gelb', value: 'Yellow'},
    {name: 'Lila', value: 'Purple'},
    {name: 'Pink', value: 'DarkVividPink'},
    {name: 'Weiß', value: 'White'},
    {name: 'Orange', value: 'Orange'},
    
  ).setRequired(true)),

  async execute (interaction, client) {
    try {
      const { options, guild } = interaction;
      const color = options.getString('farbe');
      const msg = options.getString('beschreibung');
      const GuildID = interaction.guild.id;
      const panel = options.getChannel('channel');
      const category = options.getChannel('kategorie');
      const role = options.getRole('rolle');
      const logs = options.getChannel('ticket-logs');


      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({ content: 'Du bist nicht dazu berechtigt dies zu tun!',
        ephemeral: true });
      }

      
      //const data = await ticketSchema.findOne({ GuildID: GuildID });
      //if (data) return await interaction.reply({ content: 'Du hast bereits ein Ticket system!',
      //ephemeral: true })

      else {
        await ticketSchema.create({
          GuildID: GuildID,
          Channel: panel.id,
          Category: category.id,
          Role: role.id,
          Logs: logs.id,
        })

        const embed = new EmbedBuilder()
        .setColor(`${color}`)
        .setTimestamp()
        .setTitle('Bewerbung')
        .setDescription(`${msg}`)


        const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('ticket')
          .setLabel('Erstelle ein Ticket')
          .setStyle(ButtonStyle.Secondary)
        )

        const channel = client.channels.cache.get(panel.id);
        await channel.send({ embeds: [embed], components: [button] });

        await interaction.reply({ content: `Das Ticket-Panel wurde in den folgenden Channel gesendet ${channel}.`, ephemeral: true }); 
      }
    } catch (err) {
      console.error(err);
    }
  }
}
