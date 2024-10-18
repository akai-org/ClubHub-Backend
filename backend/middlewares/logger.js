const logger = require('../utils/logger/instance');

loggerMiddleware = (options)=>{
    return function (req, res, next){
        const start = Date.now();
        const originalSend = res.send; 
        let responseBody; 
        res.send = function (body) {
            responseBody = body;
            return originalSend.apply(this, arguments);
          };
    
        res.on('finish', ()=>{
            logger.info( {
                message: `${req.method} request ${req.baseUrl}${req.path}`,
                timestamp : new Date().toISOString(),
                path: req.route.path,
                request : {
                    body : req.body,
                    queryParams : req.queryParams, 
                    headers : req.headers, 
                }, 
                response : {
                    status : res.statusCode, 
                    body : JSON.parse(responseBody),
                }, 
                responseTime : Date.now() - start + 'ms',
            })
        })
    
        next(); 
    }
}




module.exports = loggerMiddleware; 