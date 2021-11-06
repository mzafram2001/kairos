const fs = require('fs');
const pth = require('path');
/**
 * @typedef {object} ReadOptions
 * @property {any} def - Default value.
 * @property {fs.BaseEncodingOptions} charset
 */
module.exports = {
    /**
     * Reads a json file synchronously and returns it's object or null.
     * 
     * @param {fs.PathLike} path 
     * @param {ReadOptions} options
     * @returns {any} the object from the file or null if file doesn't exist.
     */
    readSync: function(path, { def, charset } = { def: null, charset: 'utf8' }) {
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, charset));
        }
        else return def;
    },
    /**
     * Reads a json file and returns it's object or null.
     * @param {fs.PathLike} path 
     * @param {ReadOptions} options
     * @return {Promise<any>}
     */
    read: async function(path, { def, charset } = { def: null, charset: 'utf8' }) {
        if (fs.existsSync(path)) {
            let data = await fs.promises.readFile(path, charset);
            return JSON.parse(data);
        }
        else return def;
    },
    /**
     * Writes an object as a json file synchronously.
     * 
     * @param {fs.PathLike} path 
     * @param {any} obj
     * @param {fs.BaseEncodingOptions} charset 
     */
    writeSync: function(path, obj, charset = 'utf8') {
        let dirname = pth.dirname(path);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }
        fs.writeFileSync(path, JSON.stringify(obj), charset);
    },
    /**
     * Writes an object as a json file.
     * 
     * @param {fs.PathLike} path 
     * @param {any} obj
     * @param {fs.BaseEncodingOptions} charset 
     * @return {Promise}
     */
    write: async function(path, obj, charset = 'utf8') {
        let dirname = pth.dirname(path);
        if (!fs.existsSync(dirname)) {
            await fs.promises.mkdir(dirname);
        }
        await fs.promises.writeFile(path, JSON.stringify(obj), charset);
    }
}