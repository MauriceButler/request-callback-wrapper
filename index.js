function getStackInfo(){
    var orig = Error.prepareStackTrace,
        error = new Error(),
        stack;

    Error.prepareStackTrace = function(){return arguments[1];};
    Error.captureStackTrace(error, arguments.callee);

    stack = error.stack[1];

    Error.prepareStackTrace = orig;

    return ' at ' + (stack.fun.name || 'anonymous') + ' (' + stack.getFileName() + ':' + stack.getLineNumber() + ')';
}

module.exports = function (callback){
    var stackInfo = getStackInfo();

    return function (error, response, data){
        if(error){
            if(error.message === 'connect ECONNREFUSED'){
                error = new Error(error.message += stackInfo);
            }

            return callback(error);
        }

        if(response && response.statusCode >= 400){
            return callback(data);
        }

        callback(null, data);
    };
};