const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName("chatbotrules")
  .setDescription("Chatbot Regeln!"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
    .setTitle(`Regeln für die Benutzung des Chatbots!`)
    .setDescription(`Es darf nicht gespammt werden! 
    Die Antwort muss auf maximal 2000 Zeichen begrenzt sein!`)
    .setColor(0x18e1ee)
    //.setImage(client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .setTimestamp()
    .setAuthor({ 
      url: `https://www.youtube.com/@FloxTP`,
      iconURL: interaction.user.displayAvatarURL(),
      name: interaction.user.tag
    })
    .setFooter({
      iconURL: client.user.displayAvatarURL(),
      text: client.user.tag
    })
    .setURL('https://www.youtube.com/@FloxTP')
    .addFields([
      {
        name: `Wie kann ich die Antwort auf 2000 Zeichen begrenzen?`,
        value: '"Die Anwort darf Maximal 2000 Zeichen haben"',
        inline: true
      },
      {
        name: `Spamming`,
        value: 'Wird mit einem Timeout geahndet!',
        inline: true
      }
    ]);

    await interaction.reply({
      embeds: [embed]
    });
  }
}