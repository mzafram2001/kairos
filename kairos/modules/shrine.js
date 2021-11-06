const jsonfs = require('./jsonfs');
const fetch = require('node-fetch');
const Discord = require("discord.js");
const client = new Discord.Client();
const {Client, MessageEmbed} = require('discord.js');

/**
 * @typedef {object} Shrine
 * @property {number} id
 * @property {any[]} perks
 */
const SHRINE_CACHE_PATH = `${process.cwd()}/tmp/shrine.json`;

/**
 * An API for the Shrine of Secrets.
 */
class ShrineAPI {
    /**
     * Fetches the shrine of secrets.
     * @return {Promise<Shrine>}
     */
    static async fetch() {
        const time = Math.floor(new Date().getTime() / 1000);

        // Read shrine cache.
        /** @type {Shrine} */
        let shrine = await jsonfs.read(SHRINE_CACHE_PATH);
        let useEndpoint = (!shrine || time >= shrine.end);

        // Fetch from endpoint.
        if (useEndpoint) {
            let response = await fetch('https://dbd.onteh.net.au/api/shrine');
            let data = await response.json();
            if (shrine == null || shrine.id != data.id) {
                shrine = data;
                for (let i = 0; i < shrine.perks.length; i++) {
                    shrine.perks[i].info = await ShrineAPI.fetchPerk(shrine.perks[i].id);
                }
                await jsonfs.write(SHRINE_CACHE_PATH, shrine);
            }
        }

        // Return result.
        shrine.current = time < shrine.end;
        return shrine;
    }
    /**
     * Fetches perk information.
     */
    static async fetchPerk(perkId) {
        let response = await fetch(`https://dbd.onteh.net.au/api/perkinfo?perk=${perkId}`);
        return await response.json();
    }

    /**
     * Converts a shrine to a string.
     * @param {Shrine} shrine 
     * @returns {string} 
     */
    static toMessage(shrine) {
        let content = `${shrine.current ? 'Today' : 'Yesterday'}'s shrine of secrets is`;
        shrine.perks.forEach((perk, i) => {
            let quote = perk.shards > 2000 ? '***' : '**';
            content += `${i > 0 ? ',' : ''} ${i == 3 ? 'and ' : ''}${quote}${perk.info.name}${quote}`;
        });

        const embed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setTitle('KΛIROS !K SHRINE')
            .setDescription(`${content}!`)
            .setFooter('© MiZaMo#9999')
            .setThumbnail('https://i.imgur.com/V4kH5hU.png');
        return embed;
        //return `${content}!`;
    }
}

module.exports = ShrineAPI;