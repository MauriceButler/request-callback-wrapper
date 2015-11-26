var test = require('tape'),
    errors = require('generic-errors'),
    wrapCallback = require('../');

test('wrapCallback Exists', function (t) {
    t.plan(2);
    t.ok(wrapCallback, 'wrapCallback Exists');
    t.equal(typeof wrapCallback, 'function', 'wrapCallback is an function');
});

test('standard error', function (t) {
    t.plan(2);

    var testError = new Error('BOOM!!'),
        callback = wrapCallback(function(error, data){
            t.equal(error, testError, 'correct error');
            t.notOk(data, 'no data');
        });

    callback(testError);
});

test('ECONNREFUSED error', function (t) {
    t.plan(3);

    var testError = new Error('connect ECONNREFUSED'),
        callback = wrapCallback(function(error, data){
            t.notEqual(error, testError, 'different error instance');
            t.equal(error.message, 'connect ECONNREFUSED at Test.<anonymous> (' + __filename + ':27:20)' , 'correct error message');
            t.notOk(data, 'no data');
        });

    callback(testError);
});

test('ETIMEDOUT error', function (t) {
    t.plan(3);

    var testError = new Error('connect ETIMEDOUT'),
        callback = wrapCallback(function(error, data){
            t.notEqual(error, testError, 'different error instance');
            t.equal(error.message, 'connect ETIMEDOUT at Test.<anonymous> (' + __filename + ':40:20)' , 'correct error message');
            t.notOk(data, 'no data');
        });

    callback(testError);
});

function errorCallback(t, expectedMessage, expectedCode){
    return function(error, result){
        t.ok(errors.BaseError.isGenericError(error), 'is a generic error');
        t.equal(error.message, expectedMessage, 'correct message');
        t.equal(error.code, expectedCode, 'correct code');
        t.notOk(result, 'no result');
    };
}

test('standard error code', function (t) {
    t.plan(4);

    var testData = {message: 'was a 500'},
        testResponse = {statusCode: 500},
        callback = wrapCallback(errorCallback(t, testData.message, 500));

    callback(null, testResponse, testData);
});

test('non standard error code', function (t) {
    t.plan(4);

    var testData = {message: 'was a 666'},
        testResponse = {statusCode: 666},
        callback = wrapCallback(errorCallback(t, testData.message, 666));

    callback(null, testResponse, testData);
});

test('error with additional data', function (t) {
    t.plan(5);

    var testData = {message: 'has extra data', foo: 'extra data'},
        testResponse = {statusCode: 422},
        callback = wrapCallback(function(error, result){
            errorCallback(t, testData.message, 422)(error, result);
            t.equal(error.foo, testData.foo, 'extra data was added');
        });

    callback(null, testResponse, testData);
});

test('body is a string with error status code', function (t) {
    t.plan(4);

    var testData = 'Totes body and that',
        testResponse = {statusCode: 444},
        callback = wrapCallback(errorCallback(t, testData, 444));

    callback(null, testResponse, testData);
});

test('error status code but no error value', function (t) {
    t.plan(4);

    var testData = null,
        testResponse = {statusCode: 777},
        callback = wrapCallback(errorCallback(t, 'An unknown error occured', 777));

    callback(null, testResponse, testData);
});

test('error with code in data < 400 is deaulted to 500', function (t) {
    t.plan(4);

    var testData = {code: 111, message: 'test message'},
        testResponse = {statusCode: 888},
        callback = wrapCallback(errorCallback(t, testData.message, 500));

    callback(null, testResponse, testData);
});

test('error with code in data > 400 isnt changed', function (t) {
    t.plan(4);

    var testData = {code: 999, message: 'test message'},
        testResponse = {statusCode: 888},
        callback = wrapCallback(errorCallback(t, testData.message, 999));

    callback(null, testResponse, testData);
});

test('success', function (t) {
    t.plan(2);

    var testData = {success: 'winning'},
        testResponse = {statusCode: 200},
        callback = wrapCallback(function(error, data){
            t.notOk(error, 'no error');
            t.equal(data, testData, 'correct data');
        });

    callback(null, testResponse, testData);
});