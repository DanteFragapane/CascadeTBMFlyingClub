module.exports = {
    help: {
        name: "Help",
        description: "The... the help command. Really? You wanted to know more about the help command?"
    },
    run: (bot, message, args) => {
        console.log(args)
        const command = bot.commands.get(args[0])
        if(!command) {
            message.reply("Please give a valid command.") 
            return
        }
        message.reply(command.help.description)
    }
}