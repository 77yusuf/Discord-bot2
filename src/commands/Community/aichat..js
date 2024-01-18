const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('chatbot')
  .setDescription('Du kannst mit diesem ChatBot interagieren!')
  .addStringOption(option => option.setName('eingabe').setDescription('Die Nachricht an ChatGPT!').setRequired(true)),
  async execute (interaction) {
    await interaction.reply({ content: 'schreibt...', ephemeral: true })

    const { options } = interaction;
    const query = options.getString('eingabe');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('https://chat-app-f2d296.zapier.app/');
    const textBoxSelector = 'textarea[aria-label="chatbot-user-prompt"]';
    await page.waitForSelector(textBoxSelector);
    await page.type(textBoxSelector, query);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-testid="final-bot-response"] p');
    let value = await page.$$eval('[data-testid="final-bot-response"]', async (elements) => {
      return elements.map((element) => element.textContent);

    });
    setTimeout(async () => {
      if (value.length == 0) return await interaction.editReply({ content: 'Error!'});
    }, 30000)

    await browser.close();
    value.shift();
    await interaction.editReply({ content: `${value.join(`{\n\n\n\n}`)}`})
  }
 }