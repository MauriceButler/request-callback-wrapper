var test = require('grape'),
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
            t.equal(error.message, 'connect ECONNREFUSED at anonymous (' + __filename + ':26)' , 'correct error message');
            t.notOk(data, 'no data');
        });

    callback(testError);
});

test('statusCode 400', function (t) {
    t.plan(2);

    var testData = {error: 'was a 400'},
        testResponse = {statusCode: 400},
        callback = wrapCallback(function(error, data){
            t.equal(error, testData, 'correct data as error');
            t.notOk(data, 'no data');
        });

    callback(null, testResponse, testData);
});

test('statusCode 500', function (t) {
    t.plan(2);

    var testData = {error: 'was a 500'},
        testResponse = {statusCode: 500},
        callback = wrapCallback(function(error, data){
            t.equal(error, testData, 'correct data as error');
            t.notOk(data, 'no data');
        });

    callback(null, testResponse, testData);
});

test('statusCode 500', function (t) {
    t.plan(2);

    var testData = {error: 'was a 500'},
        testResponse = {statusCode: 500},
        callback = wrapCallback(function(error, data){
            t.equal(error, testData, 'correct data as error');
            t.notOk(data, 'no data');
        });

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
