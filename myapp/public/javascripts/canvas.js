'use strict';


var logOn = true;

const log = curry(function(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
});



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








const map = curry(function(callback, array) {
    var newArray = [];
    for (var i = 0; i < array.length; i = i + 1) {
        newArray[i] = callback(array[i], i);
    }
    return newArray;
});

const reduce = curry(function(callback, initialValue, array) {
    var working = initialValue;
    //console.log('array:', typeof(initialValue));
    for (var i = 0; i < array.length; i = i + 1) {
        working = callback(working, array[i]);
        //console.log('working: ', working);
    }
    return working;
});




const stringAdder = curry(function(acc, nextString) {
    return acc + nextString;
});



//DOM

const appendInnerHTMLFn = curry(function(inner, el) {
    el.innerHTML = inner;
    return el;
});

const createElementFn = curry(function(tag) {
    return document.createElement(tag);
});

const getElementByFn = curry(function(kind, name) {
    switch(kind) {
        case 'Id':
            return document.getElementById(name);
            break;
        case 'Class':
            return document.getElementsByClassName(name);
            break;
    }   
});

const setAttributeFn = curry(function(attribute, name, el) {
    el.setAttribute(attribute, name);
    return el;
});

const wrapTagFn = curry(function(tag, str) {
    return '<' + tag + '>' + str + '</' + tag + '>';
});









const headerboxItemsCourses = 
    [
        {
            lable: 'KURS',
            class: 'table-tesla__header__lablebox--course'
        },
        {
            lable: 'PERIOD',
            class: 'table-tesla__header__lablebox-period'
        },
        {
            lable: 'PROGRAM',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: 'ÅRSKURS',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: 'EXAMINATOR',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: 'ANSVARIG',
            class: 'table-tesla__table__header__lablebox-programandyear'
        }
    ];

const makeHeaderboxDivString = curry(function(str) {
        return '<div class="table-tesla__table__headerbox">' + str + '</div>';
});

const makeHeaderboxChildDivStrings = curry(function(item) {
    return '<div class="' + item.class + '"><div class="table-tesla__header__cell__text">' + item.lable + '</div></div>';
});



var RequestCanvas = prepareRequestCanvas(
    'https://kth.instructure.com/api/v1'
);


function prepareRequestCanvas(baseUrl) {
    return(relUrlObj) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', baseUrl + '/' + relUrlObj.area + '/' + relUrlObj.areaId + '/' + relUrlObj.what + '?per_page=' + relUrlObj.perPage + '&access_token=' + relUrlObj.token);
            request.responseType = 'application/json';
            request.send();
            //console.log(baseUrl + '/' + relUrl);
            request.onload = () => resolve(JSON.parse(request.response));
        })
    };
};




document.addEventListener("DOMContentLoaded", function () {

    setAttributeFn('class', 'schedule-tesla__left', getElementByFn('Id', 'courses'));
    appendInnerHTMLFn((compose(makeHeaderboxDivString, reduce(stringAdder, ''), map(makeHeaderboxChildDivStrings))(headerboxItemsCourses)), getElementByFn('Id', 'courses'));

    
        var canvasData = {};
        var searchObj = {
            area: "users",
            areaId: "5091",
            what: "courses",
            perPage: "100",
            token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
        }

        var fn = function canvasUsersGetter(item) {
            let searchObj = {
                area: "courses",
                areaId: item.id,
                what: "group_categories",
                perPage: "100",
                token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
            }

            return RequestCanvas(searchObj);
        }


        var fn2 = function canvasUsersGetter2(item) {
            console.log(item);
            let searchObj = {
                area: "group_categories",
                areaId: item.id,
                what: "groups",
                perPage: "100",
                token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
            }

            return RequestCanvas(searchObj);
        }

        var fn3 = function canvasUsersGetter2(item) {
            console.log(item);
            let searchObj = {
                area: "groups",
                areaId: item.id,
                what: "users",
                perPage: "100",
                token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
            }

            return RequestCanvas(searchObj);
        }

        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
              return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
          }


        RequestCanvas(searchObj).then((objs) => {

            var actions = flatten(objs).map(fn);
            var results = Promise.all(actions);
    
            results.then((objs) => {

                var actions2 = flatten(objs).map(fn2);
                var results2 = Promise.all(actions2);

                results2.then(objs => {

                    var actions3 = flatten(objs).map(fn3);
                    var results3 = Promise.all(actions3);

                    results3.then(objs => {
                        
                        if (Array.isArray(objs)) {
                            objs.forEach(
                                function (obj) {
                                    if (Array.isArray(obj)) {
                                        obj.forEach(
                                            function(item) {
                                                (function (childEl,inner) {
                                                    console.log(inner);

                                                    childEl.innerHTML = '<div class="table-tesla__table__rowbox">\
                                                    <div class="table-tesla__table__row">\
                                                      <div class="table-tesla__cell__text">' + inner.id + '</div>\
                                                      <div class="table-tesla__cell__text">' + inner.name + '</div>\
                                                      <div class="table-tesla__cell__text">' + inner.sortable_name + '</div>\
                                                      <div class="table-tesla__cell__text--bold">' + inner.short_name + '</div>\
                                                      <div class="table-tesla__cell__text">' + inner.login_id + '</div>\
                                                      <div class="table-tesla__cell__text">' + inner.sis_user_id + '</div>\
                                                    </div>\
                                                  </div>'
                                                    //parentEl.appendChild(childEl);
                                                    getElementByFn('Id', 'courses').appendChild(childEl);
                                                    
                                                })(createElementFn('div'), item)
                                            }

                                        );
                                        
                                    }
                                    
                                });

                        }
                                
                });
            });
       
        });
    })
});