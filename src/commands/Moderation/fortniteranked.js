const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('fortniterank')
  .setDescription('Dies ist der Command für die Ranked-Rolle!')
  .addRoleOption(option => option.setName('unreal').setDescription('Unreal').setRequired(true))
  .addRoleOption(option => option.setName('champ').setDescription('Champ').setRequired(true))
  .addRoleOption(option => option.setName('elite').setDescription('Elite').setRequired(true))
  .addRoleOption(option => option.setName('dia').setDescription('Diamand').setRequired(true)),
  async execute (interaction, client) {

    const unreal = interaction.options.getRole("unreal");
    const champ = interaction.options.getRole("champ");
    const elite = interaction.options.getRole("elite");
    const dia = interaction.options.getRole("dia");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "Du hast keine Berechtigung dies zu tun", ephemeral: true});

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('button3')
      .setLabel(`${unreal.name}`)
      .setEmoji(`<:1166022103594709013:1197591061967675422>`)
      .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
      .setCustomId('button4')
      .setLabel(`${champ.name} `)
      .setEmoji(`<:1166022083109728356:1197591060755533944>`)
      .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
      .setCustomId('button5')
      .setLabel(`${elite.name} `)
      .setEmoji(`<:1166022543979843634:1197591064144515103>`)
      .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
      .setCustomId('button6')
      .setLabel(`${dia.name}   `)
      .setEmoji(`<:1166023394421116998:1197591065444753408>`)
      .setStyle(ButtonStyle.Primary),
    )

    const embed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`Welchen Rank bist du in Fortnite?`)
    .setDescription(`Fortnite Ranked: ${unreal}, ${champ}, ${elite}, ${dia}`)

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async (i) => {

      const member = i.member;

      if (i.guild.members.me.roles.highest.position < unreal.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } else if (i.guild.members.me.roles.highest.position < champ.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } else if (i.guild.members.me.roles.highest.position < elite.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      } else if (i.guild.members.me.roles.highest.position < dia.position) {
        i.update({ content: "Meine Rolle ist unter den Rollen die ich versuche zu vergeben", ephemeral: true});
        return;
      }

      if (i.customId === 'button3') {
        member.roles.add(unreal);
        i.reply({ content: `Nun hast du die Rolle ${unreal.name}`, ephemeral: true });
      }

      if (i.customId === 'button4') {
        member.roles.add(champ);
        i.reply({ content: `Nun hast du die Rolle ${champ.name}`, ephemeral: true });
      }

      if (i.customId === 'button5') {
        member.roles.add(elite);
        i.reply({ content: `Nun hast du die Rolle ${elite.name}`, ephemeral: true });
      }

      if (i.customId === 'button6') {
        member.roles.add(dia);
        i.reply({ content: `Nun hast du die Rolle ${dia.name}`, ephemeral: true });
      }

    })
  }
}