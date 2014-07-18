#request-callback-wrapper

Wraps a callback for request to handle errors, status codes and ECONNREFUSED in a nicer way

## Usage

    var wrapCallback = require('request-callback-wrapper'),
        request = require('request');

    request('/users', wrapCallback(function(error, users){
            if(error){
                return console.log(error);
            }

            console.log(users);
        })
    );