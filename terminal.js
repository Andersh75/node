const R = require('ramda');
const https = require('https');

var logOn = true;

var poem = 'Twas brillig, and the slithy toves\n' +
'Did gyre and gimble in the wabe;\n' +
'All mimsy were the borogoves,\n' +
'And the mome raths outgrabe.';


// var searchObj = {
//     area: "users",
//     areaId: "5091",
//     what: "courses",
//     perPage: "100",
//     token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
// }

// var RequestCanvas = prepareRequestCanvas(
//     'https://kth.instructure.com/api/v1'
// );

// https://kth.instructure.com/api/v1




// function prepareRequestCanvas(baseUrl) {
//     return(relUrlObj) => {
//         return new Promise((resolve, reject) => {
//             const request = new XMLHttpRequest();
//             request.open('GET', baseUrl + '/' + relUrlObj.area + '/' + relUrlObj.areaId + '/' + relUrlObj.what + '?per_page=' + relUrlObj.perPage + '&access_token=' + relUrlObj.token);
//             request.responseType = 'application/json';
//             request.send();
//             //console.log(baseUrl + '/' + relUrl);
//             request.onload = () => resolve(JSON.parse(request.response));
//         })
//     };
// };

function getJSONCurried() {
    return curry(function(baseurl, suffixurl) {
        //console.log(suffixurl);
        let url = baseurl + suffixurl;
        //console.log(url);
        return new Promise(function(resolve, reject) {
            https.get(url, function(resp) {
                let data = '';
    
                 resp.on('data', (chunk) => {
                   data += chunk;
                   //console.log(data);
                 });
    
                 resp.on('end', () => {
                    //console.log(JSON.parse(data));
                   resolve(JSON.parse(data));
                 });
    
            }).on("error", (err) => {
                reject("Error: " + err.message);
            });
        }); 
    });
}



var  getJSONPrefixed = getJSONCurried()('https://kth.instructure.com/api/v1/');


let myAr = getJSONPrefixed('courses/3808/group_categories?access_token=8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh').then(function(data) {
    //console.log(data);
    return map(function(item) {
        return item.id;
    }, data);
});

let myAr2 = myAr.then(function(data) {
    return Promise.all(map(function(item) {
        return getJSONPrefixed('group_categories/' + item + '/groups?access_token=8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh')
    }, data));
});


let myAr3 = myAr2.then(function(data) {

    return map(function(item) {
        return item;
    }, data);
});



myAr3.then(function(data) {
    console.log(data);
});




////
function compose() {
    var args = argsToArray(arguments);
    var start = args.length - 1;
    
    return function() {
        var i = start;
        var remainingArgs = argsToArray(arguments);
        var result = args[start]().apply(this, remainingArgs);
        
        i = i - 1;
        while (i >= 0) {
            result = args[i]().call(this, result);
            i = i - 1;
        }
        //log(result);
        return result;
    };
}

function curry (fn) {
    var arity = fn.length;

    function given (argsSoFar) {
        return function helper () {
            var args             = Array.prototype.slice.call(arguments, 0);
            var updatedArgsSoFar = argsSoFar.concat(args);

            if (updatedArgsSoFar.length >= arity) {
                return fn.apply(this, updatedArgsSoFar);
            }
            else {
                return given(updatedArgsSoFar);
            }
        };
    }

    return given([]);
}

function partial() {
    var args = argsToArray(arguments);

    var fn = args.shift();

    return function() {
        var remainingArgs = argsToArray(arguments);
        return fn.apply(this, args.concat(remainingArgs));
    };
}



////
function replaceCurried() {
    return curry(function(find, replacement, str) {
        var regex = new RegExp(find, 'g');
        return str.replace(regex, replacement);
    });
}

function wrapWithCurried() {
    return curry(function(tag, str) {
        return '<' + tag + '>' + str + '</' + tag + '>';
    });
}



////
function argsToArray(args) {
    return Array.prototype.slice.call(args, 0);
}

function filter(callback, array) {
    return array.filter(callback);
}

function forEach(callback, array) {
    for (var i = 0; i < array.length; i = i + 1) {
        callback(array[i], i);
    }
}

function joinWord(sentence, word) {
    return sentence + ' ' + word;
}

function log(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
}

function map(callback, array) {
    var newArray = [];
    for (var i = 0; i < array.length; i = i + 1) {
        newArray[i] = callback(array[i], i);
    }
    return newArray;
}

function reduce(callback, initialValue, array) {
    var working = initialValue;
    console.log('array:', typeof(initialValue));
    for (var i = 0; i < array.length; i = i + 1) {
        working = callback(working, array[i]);
        console.log('working: ', working);
    }
    return working;
}

function replace(find, replacement, str) {
    return str.replace(find, replacement);
}

function wrapWith(tag, str) {
    return '<' + tag + '>' + str + '</' + tag + '>';
}



////
function addBreaks() {
    return partial(replace, '\n', '<br/>\n');
}

function addBreaksCurried() {
    return replaceCurried()('\n', '<br/>\n');
}

function replaceBrillig() {
    return partial(replace, 'brillig', 'four o’clock in the afternoon');
}

function replaceBrilligCurried() {
    return replaceCurried()('brillig', 'four o’clock in the afternoon');
}

function wrapBlockquote() {
    return partial(wrapWith, 'blockquote');
}

function wrapBlockquoteCurried() {
    return wrapWithCurried()('blockquote');
}

function wrapP() {
    return partial(wrapWith, 'p');
}

function wrapPCurried() {
    return wrapWithCurried()('p');
}



////
function modifyPoem() {
    return compose(wrapBlockquoteCurried, wrapPCurried, addBreaksCurried, replaceBrilligCurried);
}

// function modifyPoem() {
//     return compose(wrapBlockquote, wrapP, addBreaks, replaceBrillig);
// }

// function modifyPoem() {
//     return R.pipe(replaceBrillig, addBreaks, wrapP, wrapBlockquote);
// }




//log(modifyPoem()(poem));


//forEach(modifyPoem(), [poem, poem, poem]);



//log(map(modifyPoem(), [poem, poem, poem]));


// log(reduce(joinWord, '', map(modifyPoem(), [poem, poem, poem])));

//log(reduce(joinWord, '', [poem, poem, poem]));


// log(filter(function(item) { return item % 2 === 0;}, [1, 2, 3, 4, 5, 6]));

//log(R.or(false, false));

