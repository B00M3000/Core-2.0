module.exports = (client, message) => {
  if(message.content.startsWith('<@') && message.mentions.users.first() && message.mentions.users.first().id === client.user.id) { 
    message.channel.send(`Prefix is \`${process.env.PREFIX}\``)
    return true;
  }
  return false;
}