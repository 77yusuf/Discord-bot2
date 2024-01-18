const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('verifyrole')
  .setDescription('Dies ist der Verification-Role Command!')
  .addRoleOption(option => option.setName('verify').setDescription('Verification-Rolle').setRequired(true)),
  //.addRoleOption(option => option.setName('role2').setDescription('Dies ist die erste Role die du einstellen will').setRequired(true))
  //.addRoleOption(option => option.setName('role3').setDescription('Dies ist die erste Role die du einstellen will').setRequired(true)),
  async execute (interaction, client) {

    const verify = interaction.options.getRole("verify");
    //const role2 = interaction.options.getRole("role2");
    //const role3 = interaction.options.getRole("role3");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Du hast keine Berechtigung dies zu tun", ephemeral: true});

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('button9')
      .setLabel(`${verify.name}`)
      .setStyle(ButtonStyle.Success),

      //new ButtonBuilder()
      //.setCustomId('button2')
      //.setLabel(`${role2.name}`)
      //.setStyle(ButtonStyle.Secondary),

      //new ButtonBuilder()
      //.setCustomId('button3')
      //.setLabel(`${role3.name}`)
      //.setStyle(ButtonStyle.Secondary)
    )

    const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Verifizieren`)
    .setDescription(`Reagiere um dich zu verifizieren: ${verify}`)

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async (i) => {

      const member = i.member;

      if (i.guild.members.me.roles.highest.position < verify.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } //else if (i.guild.members.me.roles.highest.position < role2.position) {
        //i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        //return;
      //} else if (i.guild.members.me.roles.highest.position < role2.position) {
      //  i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
      //  return;
      //}

      if (i.customId === 'button9') {
        member.roles.add(verify);
        i.reply({ content: `Nun hast du die Rolle ${verify.name}`, ephemeral: true });
      }

      //if (i.customId === 'button2') {
      //  member.roles.add(role2);
      //  i.reply({ content: `Nun hast du die Rolle ${role2.name}`, ephemeral: true });
      //}

      //if (i.customId === 'button1') {
      //  member.roles.add(role3);
      //  i.reply({ content: `Nun hast du die Rolle ${role3.name}`, ephemeral: true });
      //}

    })
  }
}