var getStack = require('get-stack'),
    errors = require('generic-errors');

module.exports = function (callback){
    var stackInfo = getStack(1);

    return function (error, response, data){
        if(error){
            if(error.message === 'connect ECONNREFUSED' || error.message === 'connect ETIMEDOUT'){
                error = new Error(error.message += ' at ' + stackInfo);
            }

            return callback(error);
        }

        if(response && response.statusCode >= 400){
            if(errors[response.statusCode]){
                return callback(new errors[response.statusCode](data));
            }

            if(!data){
                data = {
                    message: 'An unknown error occured'
                };
            }

            if(typeof data === 'string'){
                data = {
                    message: data
                };
            }

            if(!('code' in data)){
                data.code = response.statusCode;
            }

            data.code = parseInt(data.code, 10) || 500;

            if(data.code < 400){
                data.code = 500;
            }

            return callback(new errors.BaseError(data));
        }

        callback(null, data);
    };
};