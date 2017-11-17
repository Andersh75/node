var express = require('express');
var app = express();

app.get('/', (req, res) => res.send('Hello World!'))

//setting middleware
app.use(express.static(__dirname + 'public')); //Serves resources from public folder


var server = app.listen(5500);



const R = require('ramda');
const https = require('https');

var logOn = true;

var poem = 'Twas brillig, and the slithy toves\n' +
'Did gyre and gimble in the wabe;\n' +
'All mimsy were the borogoves,\n' +
'And the mome raths outgrabe.';



////
function altUncurried(func1, func2) {
    return function (val) {
       return func1(val) || func2(val);
    }
}

const alt = curry(altUncurried);

function applyOperation(a, b, opt) {
    return opt(a, b);
}

function argsToArray(args) {
    return Array.prototype.slice.call(args, 0);
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

function curry2(fn) {
    return function(firstArg) {
        return function(secondArg) {
            return fn(firstArg, secondArg);
        }
    }
}

function filter(callback, array) {
    return array.filter(callback);
}

function firstInAr(arr) {
    return arr[0];
}

function forEach(callback, array) {
    for (var i = 0; i < array.length; i = i + 1) {
        callback(array[i], i);
    }
}

function isEmptyAr(arr) {
    return !arr.length;
}

function isNull(val) {
    return val === null;
}

function joinWord(sentence, word) {
    return sentence + ' ' + word;
}

function logUncurried(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
}

const log = curry(logUncurried);

function map(callback, array) {
    var newArray = [];
    for (var i = 0; i < array.length; i = i + 1) {
        newArray[i] = callback(array[i], i);
    }
    return newArray;
}

function multiplier(a, b) {
    return a * b;
}

function negate(func) {
    return function() {
        return !func.apply(null, arguments);
    }
}

function reduce(callback, initialValue, array) {
    var working = initialValue;
    //console.log('array:', typeof(initialValue));
    for (var i = 0; i < array.length; i = i + 1) {
        working = callback(working, array[i]);
        //console.log('working: ', working);
    }
    return working;
}

function replace(find, replacement, str) {
    return str.replace(find, replacement);
}

function restInAr(arr) {
    return arr.slice(1, arr.length);
}

function seqUncurried() {
    const funcs = Array.prototype.slice.call(arguments);
    return function (val) {
        funcs.forEach(function (fn) {
            fn(val);
        });
    };
}

const seq = curry(seqUncurried);

function sumOfAr(arr) {
    console.log(arr);
    if(isEmptyAr(arr)) {
        return 0;
    }
    return firstInAr(arr) + sumOfAr(restInAr(arr));
}

// const trimSurroundingSpaces2 = (str) => str.replace(/^\s*|\s*$/g, '');

// const trimSurroundingSpaces3 = function(str) {
//     return str.replace(/^\s*|\s*$/g, '');
// }

function trimSurroundingSpacesUncurried(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

const trimSurroundingSpaces = curry(trimSurroundingSpacesUncurried);

function trimDashesUncurried(str) {
    return str.replace(/\-/g, '');
}

trimDashes = curry(trimDashesUncurried);

function Tuple( /* types */ ) {
    const typeInfo = Array.prototype.slice.call(arguments, 0);
    const _T =  function( /* values */ ) {
        const values = Array.prototype.slice.call(arguments, 0);

        if(values.some((val) => val === null || val === undefined)) {
            throw new ReferenceError('Tuples may not have any null values');
        }

        if(values.length !== typeInfo.length) {
            throw new TypeError('Tuple arity does not match its prototype');
         }

         values.map(function(val, index) {
            this['_' + (index + 1)] = checkType(typeInfo[index])(val);
            }, this);

        Object.freeze(this);
    };

    _T.prototype.values = function() {
        return Object.keys(this).map(function(k) {
             return this[k];
        }, this);
    };
    return _T; 
}       


function wrapWith(tag, str) {
    return '<' + tag + '>' + str + '</' + tag + '>';
}

function addClassname(classname, element) {
    return element.setAttribute("class", classname);;
}




////
const checkType = curry2(function(typeDef, actualType) {
    if(R.is(typeDef, actualType)) {
       return actualType;
    }
    else {
        throw new TypeError('Type mismatch.Expected [' + typeDef + '] but found [' + typeof actualType + ']');
    }
});

// function composeNOTWORKING() {
//     var args = argsToArray(arguments);
//     var start = args.length - 1;
    
//     return function() {
//         var i = start;
//         var remainingArgs = argsToArray(arguments);
//         var result = args[start]().apply(this, remainingArgs);
        
//         i = i - 1;
//         while (i >= 0) {
//             result = args[i]().call(this, result);
//             i = i - 1;
//         }
//         //log(result);
//         return result;
//     };
// }

function compose(/* fns */) {
    let args = arguments;
    let start = args.length - 1;
    return function() {
        let i = start;
        let result = args[start].apply(this, arguments);
        while (i--)
            result = args[i].call(this, result);
        return result;
    }; 
}

function flatter(r, a) {
    if (Array.isArray(a)) {
        return reduce(flatter, r, a);
    }
    r.push(a);
    return r;
}

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

const isNotNull = negate(isNull);

function partial() {
    var args = argsToArray(arguments);

    var fn = args.shift();

    return function() {
        var remainingArgs = argsToArray(arguments);
        return fn.apply(this, args.concat(remainingArgs));
    };
}

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


function addClassnameCurried() {
    return curry(function(classname, element) {
        return element.setAttribute("class", classname);
    });
}




////
function addBreaks() {
    return partial(replace, '\n', '<br/>\n');
}

function addBreaksCurried() {
    return replaceCurried()('\n', '<br/>\n');
}

function flatten(data) {
    return reduce(flatter, [], data);
}

function getJSONPrefixed() {
    return getJSONCurried()('https://kth.instructure.com/api/v1/');
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

function wrapDivCurried() {
    return wrapWithCurried()('div');
}

function wrapPCurried() {
    return wrapWithCurried()('p');
}

function addClassnameNormalCurried() {
    return addClassnameCurried()('myClassname');
}



////
function modifyPoem() {
    return compose(wrapBlockquoteCurried, wrapPCurried, addBreaksCurried, replaceBrilligCurried);
}

function addElement() {
    return compose(wrapDivCurried);
}

// function modifyPoem() {
//     return compose(wrapBlockquote, wrapP, addBreaks, replaceBrillig);
// }

// function modifyPoem() {
//     return R.pipe(replaceBrillig, addBreaks, wrapP, wrapBlockquote);
// }


let myTest = modifyPoem()(poem);

// log(modifyPoem()(poem));

// log(addElement()(modifyPoem()(poem)))

//log(addElement()(myTest));


//forEach(modifyPoem(), [poem, poem, poem]);



//log(map(modifyPoem(), [poem, poem, poem]));


// log(reduce(joinWord, '', map(modifyPoem(), [poem, poem, poem])));

//log(reduce(joinWord, '', [poem, poem, poem]));


// log(filter(function(item) { return item % 2 === 0;}, [1, 2, 3, 4, 5, 6]));

//log(R.or(false, false));


let myAr = getJSONPrefixed()('courses/3808/group_categories?access_token=8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh').then(function(data) {
    //console.log(data);
    return map(function(item) {
        return item.id;
    }, data);
});

let myAr2 = myAr.then(function(data) {
    return Promise.all(map(function(item) {
        return getJSONPrefixed()('group_categories/' + item + '/groups?access_token=8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh')
    }, data));
});


let myAr3 = myAr2.then(function(data) {

    return map(function(item) {
        return item;
    }, data);
});


// myAr3.then(function(data) {
//     console.log(flatten(data));
// });

//myAr3.then(data => flatten(data));



// function flatter(r, a) {
//     if (Array.isArray(a)) {
//         return a.reduce(flatter, r);
//     }
//     r.push(a);
//     return r;
// }






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


//log(multiplier(2, 3));

log(applyOperation(4, 3, multiplier));

log(isNotNull(null));

log(sumOfAr([1, 2, 3, 4, 5]));



// const isValid = function (str) {
//     if(str.length === 0){
//        return new Status(false,
//             'Invald input. Expected non-empty value!');
// }
// else {
//        return new Status(true, 'Success!');
//     }
// } 





// const Status = Tuple(Boolean, String);

// log(Status(true, "hello"));




//log(checkType(String)(42));

const test1 = curry(multiplier);

const test2 = partial(multiplier);

const logger = function(appender, layout, name, level, message) {
    const appenders = {
        'alert': new Log4js.JSAlertAppender(),
        'console': new Log4js.BrowserConsoleAppender()
    };
    const layouts = {
        'basic': new Log4js.BasicLayout(),
        'json': new Log4js.JSONLayout(),
        'xml' : new Log4js.XMLLayout()
    };
    appender = appenders[appender];
    appender.setLayout(layouts[layout]);
    const logger = new Log4js.getLogger(name);
    logger.addAppender(appender);
    logger.log(level, message, null);
};


log(test1(6)(5));
log(test2(6, 5));



log(trimSurroundingSpaces(trimDashes('dsfsfsd')));

log(compose(trimSurroundingSpaces, trimDashes)('  --dffsdfsdf  sdfsdf-  --sdf'));

seq(log, log)('  --dffsdfsdf  sdfsdf-  --sdf');

compose(seq(log, log, log), trimDashes, trimSurroundingSpaces)('  --dffsdfsdf  sdfsdf-  --sdf');

