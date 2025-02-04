const bcrypt = require('bcrypt');
const config = require('../setup/config.js')

hash = async (text) =>{
    const hash = await bcrypt.hash(text, config.get('bcrypt.saltRounds'));
    return hash;
}

module.exports = {hash}