var getStack = require('get-stack');

module.exports = function (callback){
    var stackInfo = getStack(1);

    return function (error, response, data){
        if(error){
            if(error.message === 'connect ECONNREFUSED'){
                error = new Error(error.message += ' at ' + stackInfo);
            }

            return callback(error);
        }

        if(response && response.statusCode >= 400){
            return callback(data);
        }

        callback(null, data);
    };
};