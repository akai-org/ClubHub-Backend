const bcrypt = require('bcrypt');
const config = require('config')
const bcryptSaltRounds = config.get('bcrypt.saltRounds')

hash = async (text) =>{

    const hash = await bcrypt.hash(text, bcryptSaltRounds);
    return hash;
}

module.exports = {hash}