//----------------------------- SETUP -----------------------------//
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.listen(3000, () => console.log(`FUNCIONAMIENTO CORRECTO`));

//----------------------------- SISTEMA 24/7 -----------------------------//

const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
const ShrineAPI = require('./modules/shrine');
const ash = require('./modules/autoshrine');
dotenv.config();

//---------------------------- PREFIX ----------------------------//
const prefix = '!k';

//---------------------------- CODIGO DEL BOT ----------------------------//

//---------------------------- READY EVENT ----------------------------//
client.on("ready", () => {
  console.log(`INICIADO COMO BOT: ${client.user.tag}`);
  let serverIn = client.guilds.cache.size;

  client.user.setPresence({
    activity: {
      name: `${serverIn} servers | ${prefix} start | updating v1.1`,
      type: "WATCHING"
    },
    status: 'dnd'
  })
    .catch(console.error);
});

//---------------------------- MESSAGE EVENT ----------------------------//
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (xor(process.env.DEBUGGING, message.channel.id == process.env.TEST_CHANNEL)) return;

  switch (message.content.toLowerCase()) {
    default:
      message.channel.startTyping();
      const embed = new MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle('KΛIROS ERROR')
        .setDescription('Using the !autoshrine command **failed**.')
        .setFooter('Developed by MiZaMo#6322')
        .setThumbnail('https://i.imgur.com/V4kH5hU.png');
      message.channel.send({ embed });
      message.channel.startTyping();
      break;
    case '!k start': start(message);
      break;
    case '!k shrine':
      // Start typing
      message.channel.startTyping();

      // Fetch dbd shrine info
      ShrineAPI.fetch().then((shrine) => {
        message.channel.send(ShrineAPI.toMessage(shrine));
        // console.log(shrine);
        message.channel.stopTyping(true);
      });;
      break;
    case '!k autoshrine':
      // Setup auto shrine for this channel.
      let action = ash.toggleChannel(message.channel);
      if (action == 'add') {
        message.channel.startTyping();
        const embed = new MessageEmbed()
          .setColor('#FFFFFF')
          .setTitle('KΛIROS !K AUTOSHRINE')
          .setDescription('**Success!** Every new Shrine of Secrets will automatically be posted to this channel.')
          .setFooter('Developed by MiZaMo#6322')
          .setThumbnail('https://i.imgur.com/uqb3NMU.png');
        message.channel.send({ embed });
        message.channel.stopTyping();
      }
      else if (action == 'rem') {
        message.channel.startTyping();
        const embed = new MessageEmbed()
          .setColor('#FFFFFF')
          .setTitle('KΛIROS !K AUTOSHRINE')
          .setDescription('**Success!** This channel will no longer receive Shrine of Secrets updates.')
          .setFooter('Developed by MiZaMo#6322')
          .setThumbnail('https://i.imgur.com/uqb3NMU.png');
        message.channel.send({ embed });
        message.channel.stopTyping();
      }
      break;
  }
});

//---------------------------- FUNCTION ----------------------------//
function xor(a, b) {
  /**
   * Logical XOR
   * @param {any} a 
   * @param {any} b 
   * @returns {boolean}
  */
  return (!a && b) || (!b && a);
}

function start(message) {
  const embed = new MessageEmbed()
    .setColor('#FFFFFF')
    .setTitle('KΛIROS !K START')
    .setDescription('Dead By Daylight (DBD) companion bot for tracking weekly Shrine of Secrets, get any info about survivors, killers, maps and more!')
    .addFields(
      { name: '`!k start`', value: 'View all commands' },
      { name: '`!k shrine | !k autoshrine`', value: 'Shows current Shrine of Secrets perks' },
      { name: '`!k {survivorName} | !k {perkName} | !k {mapName}`', value: 'Upcoming commands...' },
    )
    .setFooter('Developed by MiZaMo#6322')
    // .setImage('https://i.imgur.com/XzQmlX9.png') // KAIROS BANNER
    .setThumbnail('https://i.imgur.com/V4kH5hU.png'); // KAIROS LOGO
  message.channel.send({ embed });
}

//---------------------------- LOGIN ----------------------------//
const mySecret = process.env['TOKEN']
client.login(mySecret);