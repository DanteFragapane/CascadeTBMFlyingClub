'use strict';

// Load modules
const dotenv = require('dotenv');
const mysql = require('mysql');
const discord = require('discord.js');
const csv = require('csv-parser')
const fs = require('fs');
const Enmap = require('enmap')
const functions = require('./functions');

// Load the dotenv variables
dotenv.config();
const env = process.env;

// Create the mysql options object
const connection = mysql.createConnection({
	host: env.host,
	user: env.user,
	password: env.password,
	database: env.database
});

// Create the Discord bot client
const bot = new discord.Client();
bot.config = {prefix: process.env.prefix, connection: connection}

// Load in the airport code list, courtesy of datasets on github
const airports = [];
fs.createReadStream('./airport-codes.csv').pipe(csv()).on('data', (data) => {
	data = data.ident;
	airports.push(data);
}).on('end', () => {
  bot.config.airports = airports
});

// When the bot is ready to go
bot.on('ready', () => {
	console.log('Ready to fly!');
});
T
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, event.bind(null, bot));
  });
});

bot.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    bot.commands.set(commandName, props);
  });
});


// Login
bot.login(env.botId);
