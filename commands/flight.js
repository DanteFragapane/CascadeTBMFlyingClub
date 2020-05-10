module.exports = {
  help: {
    name: "Flight",
    description: "The root command for all flight related commands."
  },
  run: (bot, message, args) => {
    if (args[0] === "log") {
      if (args.length !== 4) {
        message.reply(
          "Please enter two valid ICAO airport codes and the nickname for the airframe used. Use ``!tbm airframes show`` to see all airframes."
        )
        return
      }

      // Make the two codes uppercase, ICAO codes are uppercase. Make the nickname lowercase, they're all lowercase
      args[1] = args[1].toUpperCase()
      args[2] = args[2].toUpperCase()
      args[3] = args[3].toLocaleLowerCase()

      // Check to see if the codes are valid, thank you github datasets!
      if (
        !bot.config.airports.includes(args[1]) ||
        !bot.config.airports.includes(args[2])
      ) {
        message.reply("Please enter two valid ICAO airport codes.")
        return
      }

      bot.config.connection.query(
        "SELECT pilotID from pilots where discordID = ?",
        message.author.id,
        (err, results) => {
          if (err) {
            console.error(err)
            message.reply("Unkown error has occured. Please check logs.")
            return false
          }

          // If there were no results
          if (results.length === 0) {
            message.reply(
              "User has not been found in the database. Please talk to an admin to get yourself registered, or use the register command (if one exists)."
            )
            return false
          }

          // If more than one result, not good. It should be unique!!
          if (results.length > 1) {
            console.error(`Too many results found for Discord ID: ${authorID}`)
            message.reply(
              "Too many results! Could not find you, please contact the bot owner!"
            )
          }

          const pilotID = results[0].pilotID

          bot.config.connection.query(
            "SELECT id FROM airframes WHERE name = ?",
            [args[3]],
            (err, results) => {
              if (err) {
                console.error(err)
                message.reply("Unkown error has occured. Please check logs.")
                return
              }

              if (results.length === 0) {
                message.reply(
                  "Please use a valid nickname for the airframe used. Use ``!tbm airframes show`` to see all airframes."
                )
                return
              }

              if (results.length > 1) {
                message.reply(
                  "Unable to find the airframe, too many results. Talk to the bot owner, this should not happen."
                )
              }

              // Actually insert the log into the `flights` table
              bot.config.connection.query(
                "INSERT INTO flights SET ?",
                {
                  pilotId: pilotID,
                  origin: args[1],
                  destination: args[2],
                  maintenanceID: 0,
                  date: message.createdAt,
                  airframeID: results[0].id,
                },
                (err) => {
                  if (err) {
                    console.error(err)
                    return
                  }
                  message.channel.send(
                    `Flight logged from ${args[1]} to ${args[2]}`
                  )
                }
              )
            }
          )
        }
      )
    }
  },
}
