const {getCurrTime} = require('./time')

function log(req, res, next){
    console.log(getCurrTime() , 'Request on path: ', req.path);
    //console.log("authorization :",req.headers['authorization']); 
    const startHrTime = process.hrtime();

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log(`Response time ${req.method} ${req.url} : ${elapsedTimeInMs} ms`);
    });

    const originalEnd = res.end;

    res.end = function (data, encoding, callback) {
        console.log('Sending Response...');
        return originalEnd.call(this, data, encoding, callback);
    };

    next();
}

module.exports = {log}
