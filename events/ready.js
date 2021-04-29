const wait = require('util').promisify(setTimeout);

module.exports = {
  name: 'ready',
  run: async(client) => {
    console.log(`Logged in as ${client.user.tag}`)
    
    let i = 0

    setInterval(function(){
      let activities = [`${client.guilds.cache.size} servers!`, `${client.channels.cache.size} channels!`, `${client.users.cache.size} users!`]

      client.user.setActivity(activities[i], { type : "WATCHING" })

      i = (i + 1) % activities.length
    }, 10 * 1000);
  }
}