const { Client, IntentsBitField, Partials } = require('discord.js')
const CH = require('command-handler')
const path = require('path')
require('dotenv/config')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel],
})

client.on('ready', async () => {
  console.log('The bot is ready!')

  let memberCount = client.guilds.cache.reduce(
    (acc, guild) => acc + (guild.memberCount || 0),
    0
  )
  console.log(`Per shard count: ${memberCount}`)

  try {
    memberCount = await client.shard.broadcastEval((client) => {
      return client.guilds.cache.reduce(
        (acc, guild) => acc + (guild.memberCount || 0),
        0
      )
    })

    memberCount = memberCount.reduce((acc, count) => acc + count, 0)

    console.log(`Total member count: ${memberCount}`)
  } catch (ignored) {}

  new CH({
    client,
    mongoUri: process.env.MONGO_URI,
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ['927974245525520444'],
    botOwners: ['250281859294953483'],
    cooldownConfig: {
      errorMessage: 'Please wait {TIME}',
      botOwnersBypass: false,
      dbRequired: 300, // 5 minutes
    },
    events: {
      dir: path.join(__dirname, 'events'),
    },
    validations: {
      runtime: path.join(__dirname, 'validations', 'runtime'),
      syntax: path.join(__dirname, 'validations', 'syntax'),
    },
  })
})
client.login(process.env.TOKEN)
