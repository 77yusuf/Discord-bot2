const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('agerole')
  .setDescription('Dies ist der Command für die Alter-Rolle!')
  .addRoleOption(option => option.setName('underage').setDescription('<18').setRequired(true))
  .addRoleOption(option => option.setName('adult').setDescription('18+').setRequired(true)),
 // .addRoleOption(option => option.setName('role3').setDescription('Dies ist die erste Role die du einstellen will').setRequired(true)),
  async execute (interaction, client) {

    const underage = interaction.options.getRole("underage");
    const adult = interaction.options.getRole("adult");
    //const role3 = interaction.options.getRole("role3");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Du hast keine Berechtigung dies zu tun", ephemeral: true});

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('button1')
      .setLabel(`${underage.name}`)
      .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
      .setCustomId('button2')
      .setLabel(`${adult.name}`)
      .setStyle(ButtonStyle.Success),

     // new ButtonBuilder()
     // .setCustomId('button3')
     // .setLabel(`${role3.name}`)
     // .setStyle(ButtonStyle.Secondary)
    )

    const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Wie alt bist du?`)
    .setDescription(`Bist du ${underage}? 
    oder ${adult}?`)

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async (i) => {

      const member = i.member;

      if (i.guild.members.me.roles.highest.position < underage.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } else if (i.guild.members.me.roles.highest.position < adult.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } //else if (i.guild.members.me.roles.highest.position < role2.position) {
      //  i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
      //  return;
      //}

      if (i.customId === 'button1') {
        member.roles.add(underage);
        i.reply({ content: `Nun hast du die Rolle ${underage.name}`, ephemeral: true });
      }

      if (i.customId === 'button2') {
        member.roles.add(adult);
        i.reply({ content: `Nun hast du die Rolle ${adult.name}`, ephemeral: true });
      }

      //if (i.customId === 'button1') {
      //  member.roles.add(role3);
      //  i.reply({ content: `Nun hast du die Rolle ${role3.name}`, ephemeral: true });
      //}

    })
  }
}