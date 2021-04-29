require('dotenv').config();

const { Client, Collection } = require('discord.js');
const mongo = require('./mongo.js');
const path = require('path');
const walkSync = require('./walkSync.js');
const logger = require('./logger.js')

const client = new Client();

mongo().then(() => {
  console.log('Mongo Connection Established')
})

client.commandFiles = walkSync(path.join(__dirname, '/commands'));
client.eventFiles = walkSync(path.join(__dirname, '/events'));

client.commands = new Collection();
client.events = new Collection();

for (const file of client.commandFiles) {
  const command = require(`${file}`);
  client.commands.set(command.name, command);
  console.log(`Loaded: ${command.name}`)
}

for (const file of client.eventFiles) {
  const event = require(`${file}`);
  client.events.set(event.name, event)
  console.log(`Loaded: ${event.name}`)
  client.on(event.name, (...args) => event.run(client, ...args));
  console.log(`Started: ${event.name}`)
}

client.login(process.env.TOKEN)