const { MessageEmbed } = require('discord.js')
const walkSync = require('../walkSync.js')

module.exports = {
  name: 'reload',
  aliases: [],
  reqPerm: "BOT_ADMIN",
  run: async(client, message, args) => {
    const commandName = args[0].toLowerCase();
    const command = client.commands.get(commandName)
    
    if(!command) return message.channel.send(`\`${commandName}\` isn't a valid command!`)
    
    delete require.cache[require.resolve(command.path)];
    
    const _command = require(`${command.path}`)
    _command.path = command.path;  
    client.commands.set(_command.name, _command);
    console.log(`Reloaded: ${_command.name}`)
    
    message.channel.send(`Reloaded the \`${command.name}\` command.`)
  }
}