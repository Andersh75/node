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



const isEven = curry(function(x) {
    return (x % 2 === 0);
})


const stringAdder = curry(function(acc, nextString) {
    return acc + nextString;
});

log(stringAdder('hej', 'då1'));

log(stringAdder('hej')('då2'));

log(stringAdder()('hej')('då3'));


const myTest = compose(stringAdder('hej'), stringAdder('abc'));

log(myTest('dfg'));

log(myTest('rrrrr'));


//Set
Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}


//DOM
const appendInnerHTMLFn = curry(function(inner, el) {
    el.innerHTML = inner;
    return el;
});

const appendChildNodeFn = curry(function(el, child) {
    el.appendChild(child);
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


const makeCheckboxBlockStr = curry(function(str) {
    return '<div class="checkboxblock__entry">\
    <div class="w-checkbox w-clearfix">\
    <input checked="checked" class="w-checkbox-input" data-name="checkbox-E" id="checkbox-E" name="checkbox-E" type="radio">\
    <label class="field-label-8 w-form-label" for="checkbox-E">' + str + '</label>\
    </div>\
    </div>';
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


var data = {};



document.addEventListener("DOMContentLoaded", function () {




    var numbersAr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    //Destructive    
    log(numbersAr.reverse());           //returns reversed Array
    log(numbersAr.push(12, 13));        //concatinates Array at the back with content of choice. Returns Array.length
    log(numbersAr.unshift(-4, -3));     //concatinates Array at the front with content of choice. Returns Array.length
    log(numbersAr.pop());               //removes one element from Array at the end. Returns content of removed element
    log(numbersAr.shift());             //removes one element from Array at the front. Returns content of removed element
    log(numbersAr.splice(5,3,2,3,4));   //we are removing three elements, starting from the index 5, and we are also adding the elements 2, 3, and 4, starting at index 5. Returns Array with removed elements
    

    //Non destructive
    log(numbersAr.concat(0, [1, 2]));   //returns new concatinated Array
    log(numbersAr.every(isEven));       //returns true if every element return true in test
    log(numbersAr.some(isEven));        //returns true if some element return true in test
    log(numbersAr.join(' '));           //returns Array as string with separator of choice
    log(numbersAr.indexOf(1));          //returns first position of content of choice
    log(numbersAr.lastIndexOf(1));      //returns last position of content of choice
    log(numbersAr.slice(3));            //returns new Array from position 4
    log(numbersAr.slice(3, 5));         //returns new Array with position 4 and 5
    log(numbersAr.toString());          //returns Array as string with separator ','
    //numbersAr.filter(fn);             //returns new Array with each element that evaluates to true in the function provided
    //numbersAr.map(fn);                //returns new Array from a function that contains the criteria/condition and returns the elements of the array that match the criteria
    //numbersAr.reduce(fn);
    log(Array.from(numbersAr));         //returns new Array as a copy



    //Set with array iterator
    var mySet = new Set(numbersAr);     //returns new Set based on an iterable (array or string). In a Set every value appear once;

    log(mySet.has(5));                  //returns true if parameter is in set
    log(mySet.size);                    //returns the number of values in the Set object.               
    log(mySet.add(16));                 //appends a new element with the given value to the Set object. Returns the Set object.
    //log(mySet.clear());                 //removes all elements from the Set object. No return.
    log(mySet.delete(5));               //returns true if parameter is in set
    
    var setA = new Set([1, 2, 3, 4]),
        setB = new Set([2, 3]),
        setC = new Set([3, 4, 5, 6]);

    log(setA.isSuperset(setB));         //returns true if setA is superset of setB
    log(setA.union(setC));              //returns union set of setA and setB
    log(setA.intersection(setC));       //returns intersection set of setA and setB
    log(setA.difference(setC));         //returns set that contains the unique part of setA compared to setB
    mySet.forEach(function(item) {      //calls callbackFn once for each value present in the Set object, in insertion order. No return
        return log(item);
    });
    log(Array.from(mySet));             //returns Array from Set


    /* Not working
    log(mySet.values());
    log(mySet.keys());
    log(mySet.entries());
    */    


    //Set with string iterator
    var stringAr = 'abcdefghijklmnopq';
    var mySetString = new Set(stringAr);     //returns new Set based on an iterable (array or string). In a Set every value appear once;
    
    log(mySetString.has('e'));                  //returns true if parameter is in set
    log(mySetString.size);                    //returns the number of values in the Set object.               
    log(mySetString.add('r'));                 //appends a new element with the given value to the Set object. Returns the Set object.
    //log(mySetString.clear());                 //removes all elements from the Set object. No return.
    log(mySetString.delete('c'));               //returns true if parameter is in set
    var setA = new Set('abcd'),
    setB = new Set('bc'),
    setC = new Set('cdfg');

    log(setA.isSuperset(setB));         //returns true if setA is superset of setB
    log(setA.union(setC));              //returns union set of setA and setB
    log(setA.intersection(setC));       //returns intersection set of setA and setB
    log(setA.difference(setC));         //returns set that contains the unique part of setA compared to setB

    setA.forEach(function(item) {      //calls callbackFn once for each value present in the Set object, in insertion order. No return
        return log(item);
    });
    log(Array.from(mySetString));       //returns Array from Set


    /* Not working
    log(mySet.values());
    log(mySet.keys());
    log(setA.entries());
    */


    //Set with object iterator
    /* Not working
    var objAr = {a: 1, b: 2};
    var mySetObj = new Set(objAr);     //returns new Set based on an iterable (array or string). In a Set every value appear once;
    */
    
    









    let myTestAr = [];

    myTestAr.push('one', 'two', 'three');

    myTestAr.pop();

    myTestAr.shift();

    myTestAr.unshift('newOne', 'newTwo');

    myTestAr.forEach(function (item) {
        compose(appendChildNodeFn(getElementByFn('Id', 'sideboxesRight')), setAttributeFn('class', item), createElementFn)('div');
    });

    myTestAr.forEach(function (item) {
        compose(appendChildNodeFn(getElementByFn('Id', 'sideboxesRight')), setAttributeFn('data-sdfsdf', item), setAttributeFn('class', item), createElementFn)('div');
    });
    

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
            //console.log(flatten(objs));
            data.courses = flatten(objs);

            //classtypesBox
            //log(compose(reduce(stringAdder, ''), makeCheckboxBlockStr, map((item) => item.name))(data.courses));
            appendInnerHTMLFn(compose(reduce(stringAdder, ''), map(makeCheckboxBlockStr), map((item) => item.name))(data.courses), getElementByFn('Id', 'classtypesBox'));

            var results = Promise.all(actions);
    
            results.then((objs) => {

                var actions2 = flatten(objs).map(fn2);
                console.log(flatten(objs));
                var results2 = Promise.all(actions2);

                results2.then(objs => {

                    var actions3 = flatten(objs).map(fn3);
                    console.log(flatten(objs));
                    var results3 = Promise.all(actions3);

                    results3.then(objs => {
                        
                        if (Array.isArray(objs)) {
                            objs.forEach(
                                function (obj) {
                                    if (Array.isArray(obj)) {
                                        obj.forEach(
                                            function(item) {
                                                (function (childEl,inner) {
                                                    //console.log(inner);

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