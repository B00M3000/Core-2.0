const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Schematic } = require('mindustry-schematic-parser')

const itemEmojis = [
  { name: "", id: "" }
]

module.exports = (client, message) => {
  if(!isValidSchematic(message.content)) return false;
  
  const schematic = decodeSchematic(message.content)
  if(!schematic) return false;
  
  const embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle(schematic.name)
    .setFooter(schematic.description)
    
  var requirementsString = ""
  const requirements = schematic.requirements
  for(itemName in requirements){
    var itemAmount = requirements[itemName]
    var itemEmoji = itemEmojis.find(e => e.name == itemName)
    if(itemEmoji){
      var emoji = (itemEmoji.emoji) ? itemEmoji.emoji : itemEmoji[itemName]['emoji'] = client.emojis.cache.get(itemEmoji.id)
    
      requirementsString += `${emoji}${itemAmount} `
    } else {
      requirementsString += ` ${itemAmount} ${itemName},`
    }
  }
  embed.addField('Requirements', requirementsString.slice(0, requirementsString.length-1))
  
  const schematicBuffer = Buffer.from(message.content, 'base64')
  const schematicAttachment = new MessageAttachment(schematicBuffer, `${schematic.name}.msch`)
    
  schematic.toImageBuffer()
    .then(async imageBuffer => {
      const attachment = new MessageAttachment(imageBuffer, 'schematic.png')
  
      embed.attachFiles([attachment, schematicAttachment])
      embed.setImage('attachment://schematic.png')
      
      await message.delete()
      message.channel.send(embed)
      
      return true;
    })
}

function decodeSchematic(base64Code){
  try {
    return Schematic.decode(base64Code);
  } catch (error) {
    return null;
  }
} 

function isValidSchematic(base64Code) {
  try {
    const buffer = Buffer.from(base64Code, 'base64')
    const decoded = buffer.toString();
    const header = 'msch';
    // the startsWith method doesn't work
    for (let i = 0; i < header.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (header[i] != decoded[i]) return false;
    }
    return true;
  } catch {
    return false;
  }
}
