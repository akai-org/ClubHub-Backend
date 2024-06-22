const {getCurrTime} = require('./time')

function log(req, res, next){
    console.log(getCurrTime() , 'Request on path: ', req.path);
    console.log("authorization :",req.headers['authorization']); 

    next(); 
}

module.exports = {log}
