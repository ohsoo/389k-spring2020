var assert = require('assert');

/* FUNCTIONS */
var functions = require('../index');

var avgLenOfVals = functions.avgLenOfVals;
var applyFunToArray = functions.applyFunToArray


function upperArr(arr){
    var newArr = []
    for (var i = 0; i < arr.length; i ++){
        newArr[i] = arr[i].toUpperCase();
    }
    return newArr;
}

function lowerArr(arr){
    var newArr = []
    for (var i = 0; i < arr.length; i ++){
        newArr[i] = arr[i].toLowerCase();
    }
    return newArr;
}

describe('applyFunToArray', function() {
    var str = 'hEllo,    woRld';
    it('testing upper case func', function() {
        assert.deepEqual(['HELLO','WORLD'], applyFunToArray(str, upperArr));
    });
});

