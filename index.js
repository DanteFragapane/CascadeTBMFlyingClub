// Dotenv for environment variables
const dotenv = require("dotenv")
dotenv.config()

// Load discord wrapper and create client
const discord = require("discord.js")
const bot = new discord.Client()

// When the bot is ready to go
bot.on("ready", () => {
  console.log("Ready to fly!")
})

bot.on("message", (message) => {
  // If the message was NOT sent by the bot
  if (message.author.id !== process.env.clientId) {
    message.channel.send(message.content)
  }
})

bot.login(process.env.botId)
