    //TEST
    log(helper.str.adder('hej', 'då1'));
    
    log(helper.str.adder('hej')('då2'));
    
    log(helper.str.adder()('hej')('da3'));
    
    
    const myTest = my.compose(helper.str.adder('hej'), helper.str.adder('abc'));
    
    log(myTest('dfg'));
    
    log(myTest('rrrrr'));
    


    //Arrays
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
    log('helper.isEven');
    log(numbersAr.every(helper.isEven));       //returns true if every element return true in test
    log(numbersAr.some(helper.isEven));        //returns true if some element return true in test
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
    
    



    //Promises

    // Async calls in parallel
    
    // function workMyCollection(arr) {
    //     return q.all(arr.map(function(item) {
    //         return doSomethingAsync(item);
    //     }));    
    // }

    
    // Async calls in series
    
    // function workMyCollection(arr) {
    //     return arr.reduce(function(promise, item) {
    //         return promise.then(function(result) {
    //             return doSomethingAsyncWithResult(item, result);
    //         });        
    //     }, q());
    // }




