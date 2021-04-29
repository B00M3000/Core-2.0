const wait = require('util').promisify(setTimeout);

const schematicFilter = require('../filters/schematic.js')
const botMentionFilter = require('../filters/botMention.js')

module.exports = {
  name: 'message',
  run: async(client, message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    
    botMentionFilter(client, message)
    schematicFilter(client, message)
  
    if (!message.content.startsWith(process.env.PREFIX)) return;
  
    console.log(`${message.content} | ${message.author.tag} -- ${message.channel.name} -- ${message.guild.toString()}`)
  
    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
  
    var command = client.commands.get(cmd.toLowerCase())
  
    if( !command ) client.commands.forEach( $command => { $command.aliases.forEach( alias => { if(alias == cmd) command = $command } ) } )
  
    if(command){
      if(command.reqPerm == "BOT_ADMIN" && !client.ADMINS.find(admin => admin.ID === message.author.id)) return message.channel.send("This command is reserved for bot admins only.")
  
      if(command.reqPerm != "BOT_ADMIN" && command.reqPerm != "NONE" && !message.member.hasPermission(command.reqPerm)) {
        if(!client.ADMINS.find(admin => admin.ID === message.author.id)) return message.channel.send(`You need \`${command.reqPerm}\` permmision to run this command.`)
        else message.channel.send(`Bot admin detected, bypassed \`${command.reqPerm}\` permmisions for ${message.author.tag}`)
      }
      
      try { command.run(client, message, args); } catch(error) {
        message.channel.send(`An error occured when running this command! Please join my support server in my help menu and report this error and what you were doing to the Devs though the ModMail Bot. ERROR: \`\`\`${clean(error)}\`\`\``)
      }
    }
  }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}