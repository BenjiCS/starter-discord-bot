module.exports = (message) => {
  if (message.content === 'ping') {
    message.reply('pong')
  }
}
