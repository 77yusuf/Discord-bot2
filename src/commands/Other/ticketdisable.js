const ticketSchema = require('../../Schemas/ticketSchema');
const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
  .setName('tickets-löschen')
  .setDescription('Lösche das Ticket-System!'),

  async execute (interaction, client) {
    try {
      const GuildID = interaction.guild.id;

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return await interaction.reply({ content: 'Du bist nicht dazu berechtigt diesen Befehl auszuführen...', ephemeral: true })

      const embed2 = new EmbedBuilder()
      .setColor('#00c7fe')
      .setDescription('Das Ticket-System ist bereits gelöscht!')
      .setTimestamp()
      .setAuthor({ name: 'Ticket System'})
      .setFooter({ text: 'Ticket System gelöscht'})


      const data = await ticketSchema.findOne({ GuildID: GuildID });
      if (!data)
      return await interaction.reply({ embeds: [embed2], ephemeral: true});
      
      await ticketSchema.findOneAndDelete({ GuildID: GuildID});

      const channel = client.channels.cache.get(data.Channel);
      if (channel) {
        await channel.message.fetch({ limit: 1}).then(messages => {
          const lastMessage = messages.first();
          if (lastMessage.author.id === client.user.id) {
            lastMessage.delete();
          }
        });
      }

      const embed = new EmbedBuilder()
      .setColor('#00c7fe')
      .setDescription('Ticket System wurde gelöscht')
      .setTimestamp()
      .setAuthor({ name: 'Ticket System'})
      .setFooter({ text: 'Ticket System geklöscht'})

      await interaction.reply({ embeds: [embed] });
     } catch (err) {
        console.error(err);
     }
  }
};