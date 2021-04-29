const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'ping',
  aliases: [],
  reqPerm: "NONE",
  run: async(client, message, args) => {

    const msg = await message.channel.send(`🏓 Pinging....`);

    const embed = new MessageEmbed()
    .setTitle("🏓Pong!")
    .setDescription(`
    Gateway Latency: ${Math.floor(msg.createdAt - message.createdAt)} ms
    API Latency: ${Math.round(client.ws.ping)} ms
    Total Guilds: ${client.guilds.cache.size}
    Total Channels: ${client.channels.cache.size}
    Total Members: ${client.users.cache.size}
    `)

    msg.edit(embed)
  }
}