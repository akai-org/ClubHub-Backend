const bcrypt = require('bcrypt');
const config = require('config')
const bcryptSaltRounds = config.get('bcryptSaltRounds')

hash = async (text) =>{

    const hash = await bcrypt.hash(text, bcryptSaltRounds);
    return hash;
}

module.exports = {hash}