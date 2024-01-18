module.exports = {
  name: 'ping',
  description: 'Das ist der Ping Command',

  run: (client, message, args ) => {
    message.reply("pong!")
  }
}