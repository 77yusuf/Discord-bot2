const mongoose = require('mongoose');
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODBURL);
        console.log("Erfolgreich mit der Datenbank verbunden!");
    }   catch (error) {
        console.log(`Error ${error}`);
    }
})();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Bereit!');

        const activity = [
            'Abonniere FloxTP auf YT!',
            'Lass ein like da und teile unsere Videos!'
        ]

        setInterval(() => {
            const botStatus = activity[Math.floor(Math.random() * activity.length)];
            client.user.setPresence({ activities: [{ name: `${botStatus}`}]});
        }, 3000)

        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};