const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('genderrole')
  .setDescription('Dies ist der Gender-Role Command!')
  .addRoleOption(option => option.setName('man').setDescription('Mann').setRequired(true))
  .addRoleOption(option => option.setName('woman').setDescription('Frau').setRequired(true)),
 // .addRoleOption(option => option.setName('role3').setDescription('Dies ist die erste Role die du einstellen will').setRequired(true)),
  async execute (interaction, client) {

    const man = interaction.options.getRole("man");
    const woman = interaction.options.getRole("woman");
    //const role3 = interaction.options.getRole("role3");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Du hast keine Berechtigung dies zu tun", ephemeral: true});

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('button7')
      .setLabel(`${man.name}`)
      .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
      .setCustomId('button8')
      .setLabel(`${woman.name}`)
      .setStyle(ButtonStyle.Danger),

     // new ButtonBuilder()
     // .setCustomId('button3')
     // .setLabel(`${role3.name}`)
     // .setStyle(ButtonStyle.Secondary)
    )

    const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Welches Geschlecht hast du?`)
    .setDescription(`Bist du ein ${man}? 
    oder eine ${woman}?`)

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async (i) => {

      const member = i.member;

      if (i.guild.members.me.roles.highest.position < man.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } else if (i.guild.members.me.roles.highest.position < woman.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } //else if (i.guild.members.me.roles.highest.position < role2.position) {
      //  i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
      //  return;
      //}

      if (i.customId === 'button7') {
        member.roles.add(man);
        i.reply({ content: `Nun hast du die Rolle ${man.name}`, ephemeral: true });
      }

      if (i.customId === 'button8') {
        member.roles.add(woman);
        i.reply({ content: `Nun hast du die Rolle ${woman.name}`, ephemeral: true });
      }

      //if (i.customId === 'button1') {
      //  member.roles.add(role3);
      //  i.reply({ content: `Nun hast du die Rolle ${role3.name}`, ephemeral: true });
      //}

    })
  }
}