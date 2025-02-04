const logger = require('../utils/logger/instance');

exports.loggerMiddleware = (options) => {
    return function (req, res, next) {
        const start = Date.now();
        const originalSend = res.send; 

        let responseBody = null;

        res.send = function (body) {
            responseBody = body;
            return originalSend.apply(this, arguments);
        };

        res.on('finish', () => {
            let parsedBody = responseBody;
            try {
                if (typeof responseBody === 'string') {
                    parsedBody = JSON.parse(responseBody); 
                }
            } catch (err) {
                parsedBody = responseBody; // Keep original body if parsing fails
            }

            logger.info({
                message: `${req.method} request ${req.baseUrl}${req.path}`,
                timestamp: new Date().toISOString(),
                path: req.route ? req.route.path : req.path, 
                request: {
                    body: req.body,
                    queryParams: req.query, 
                    headers: req.headers, 
                }, 
                response: {
                    status: res.statusCode, 
                    body: parsedBody,
                }, 
                responseTime: `${Date.now() - start}ms`,
            });
        });

        next(); 
    }
};
