const {getCurrTime} = require('./time')

function logRequestCall(req, res, next){
    console.log(getCurrTime() , 'Request on path: ', req.path);
    const startHrTime = process.hrtime();

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log(`Response time ${req.method} ${req.url} : ${elapsedTimeInMs} ms\n\tHTTP status Code : ${res.statusCode}`);
    });

    const originalEnd = res.end;

    res.end = function (data, encoding, callback) {
        console.log('Sending Response.');
        return originalEnd.call(this, data, encoding, callback);
    };

    next();
}

module.exports = {logRequestCall}
