module.exports = {
  help: {
    name: "Airframe",
    description: "The root command for all airframe related commands.",
  },
  run: (bot, message, args) => {
    if (args[0] === "show") {
      if (args[1] === "all") {
        bot.config.connection.query(
          "SELECT * FROM airframes",
          (err, results, fields) => {
            let finalMessage = "All airframes:\n"
            results.forEach((element, index) => {
              console.log(element)
              finalMessage += `${element.id} | ${element.name}\n`
            })

            message.reply(finalMessage)
          }
        )
      } // End all
      else if (args[1]) {
        bot.config.connection.query(
          "SELECT * FROM airframes WHERE name = ?",
          args[1],
          (err, results) => {
            message.reply(`\n${results[0].id} | ${results[0].name}`)
          }
        )
      }
    }
  },
}
