const Discord = require('discord.js');
const ShrineAPI = require('./shrine');
const jsonfs = require('./jsonfs');

const AUTOSHRINE_DATA_PATH = `${process.cwd()}/data/autoshrine.json`;

/** 
 * @typedef {object} AutoshrineEntry 
 * @property {string} channelId
 * @property {number} lastId
 */
/** @type {AutoshrineEntry[]} */
let data = [];
/**
 * Adds a discord channel to the autoshrine.
 * @param {Discord.Channel} channel
 * @returns {"add" | "rem"} - What action took place.  
 */
function toggleChannel(channel) {
    let newData = data.filter(ash => ash.channelId != channel.id);
    if (newData.length != data.length) {
        data = newData;
        return "rem"
    }
    else {
        data.push({
            channelId: channel.id,
            lastId: -1
        });
        return "add";
    }
}

let interval = null;
/**
 * Starts the autoshrine backend.
 * @param {Discord.Client} client.
 */
function start(client) {
    // TODO load from file.
    data = jsonfs.readSync(AUTOSHRINE_DATA_PATH, { def: data });
    interval = setInterval(run, 15000, client);
}
/**
 * @param {Discord.Client} client 
 */
async function run(client) {
    console.log('Running autoshrine...', data);
    let shrine = await ShrineAPI.fetch();
    for (let ash of data) {
        if (ash.lastId != shrine.id) {
            // Send Mesasge
            /** @type {Discord.DMChannel} */
            let channel = await client.channels.fetch(ash.channelId);
            channel.send(ShrineAPI.toMessage(shrine));

            // Set lastId
            ash.lastId = shrine.id;
        }
    }
    await jsonfs.write(AUTOSHRINE_DATA_PATH, data);
    console.log('Finished.');
}
/**
 * Stops the autoshrine backend.
 */
function stop() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

module.exports = {
    start: start,
    stop: stop,
    toggleChannel: toggleChannel
}