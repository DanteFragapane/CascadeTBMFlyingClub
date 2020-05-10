bot.on('message', (message) => {
	// If the message was sent by this bot, return immediately
	if (message.author.id === env.clientId) return;
	// If the message is not in a guild, return immediately
	if (!message.guild) return;

	const content = message.content.toLowerCase();

	// Check to see if the message is actually a command for the bot
	if (content.startsWith('!tbm')) {
		// If so, split the message by each space, the second item will be the command, i.e. !tbm flight ...
		const split = content.split(' ');
		const command = split[1] || nul;

		// This is the "flight log" command
		if (command === 'flight' && split[2] === 'log') {
			// Make sure that all the parts necessary are there. No point checking for split[3] or split[4], if 3/4 isn't there, 5 won't be there either.
			if (!split[5]) {
				message.reply(
					'Please enter two valid ICAO airport codes and the nickname for the airframe used. Use ``!tbm airframes show`` to see all airframes.'
				);
				return;
			}

			// Make the two codes uppercase, ICAO codes are uppercase. Make the nickname lowercase,  they're all lowercase
			split[3] = split[3].toUpperCase();
			split[4] = split[4].toUpperCase();
			split[5] = split[5].toLocaleLowerCase();

			// Check to see if the codes are valid, thank you github datasets!
			if (!airports.includes(split[3]) || !airports.includes(split[4])) {
				message.reply('Please enter two valid ICAO airport codes.');
				return;
			}

			// Run the findPilotID function, give it connection, the ID, and a callback
			functions.findPilotID(connection, message.author.id, (err, results) => {
				if (err) {
					console.error(err);
					message.reply('Unkown error has occured. Please check logs.');
					return false;
				}

				// If there were no results
				if (results.length === 0) {
					message.reply(
						'User has not been found in the database. Please talk to an admin to get yourself registered, or use the register command (if one exists).'
					);
					return false;
				}

				// If more than one result, not good. It should be unique!!
				if (results.length > 1) {
					console.error(`Too many results found for Discord ID: ${authorID}`);
					message.reply('Too many results! Could not find you, please contact the bot owner!');
				}

				const pilotID = results[0].pilotID;

				functions.findAirframe(connection, split[5], (err, results) => {
					if (err) {
						console.error(err);
						message.reply('Unkown error has occured. Please check logs.');
						return;
					}

					if (results.length === 0) {
						message.reply(
							'Please use a valid nickname for the airframe used. Use ``!tbm airframes show`` to see all airframes.'
						);
						return;
					}

					if (results.length > 1) {
						message.reply(
							'Unable to find the airframe, too many results. Talk to the bot owner, this should not happen.'
						);
					}

					// Actually insert the log into the `flights` table
					connection.query(
						'INSERT INTO flights SET ?',
						{
							pilotId: pilotID,
							origin: split[3],
							destination: split[4],
							maintenanceID: 0,
							date: message.createdAt,
							airframeID: results[0].id
						},
						(err) => {
							if (err) {
								console.error(err);
								return;
							}
							message.channel.send(`Flight logged from ${split[3]} to ${split[4]}`);
						}
					);
				});
			});
		} // END OF FLIGHT

		if (command === 'airframes') {
			if (split[2] === 'show') {
				if (!split[3]) {
				}
			}
		}
	} // END OF TBM
});