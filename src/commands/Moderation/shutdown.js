const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('herunterfahren')
  .setDescription('Mit diesem Command kannst du den TP-MANAGER herunterfahren!'),
  async execute (interaction, client) {

    if (interaction.client.id != '613671308005474304') return;
    else {

      const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`Der TP-MANAGER wurde heruntergefahren!`)
       
      await interaction.reply ({ content: ':loading1:  dein Bot wird deaktiviert...', ephemeral: true });
      await client.user.setStatus(`invisible`);

      setTimeout(async () => {
      await interaction.editReply({ content: '', embeds: [embed] });
      process.exit();
      }, 2000);
    }
  }
}