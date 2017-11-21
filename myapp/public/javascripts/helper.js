var helper = {};
(function() {


    //Map, Reduce, Filter
    this.map = my.curry(function(callback, array) {
        var newArray = [];
        for (var i = 0; i < array.length; i = i + 1) {
            newArray[i] = callback(array[i], i);
        }
        return newArray;
    });

    this.reduce = my.curry(function(callback, initialValue, array) {
        var working = initialValue;
        //console.log('array:', typeof(initialValue));
        for (var i = 0; i < array.length; i = i + 1) {
            working = callback(working, array[i]);
            //console.log('working: ', working);
        }
        return working;
    });





    //Booleans
    this.isEven = my.curry(function(x) {
        return (x % 2 === 0);
    });


    //Strings
    this.str = {
        adder: my.curry(function(acc, nextString) {
        return acc + nextString;
        })
    };



    //Arrays
    this.arr = {
        flatten: my.curry(function(arr) {
            return arr.reduce(function (flat, toFlatten) {
              return flat.concat(Array.isArray(toFlatten) ? helper.arr.flatten(toFlatten) : toFlatten);
            }, []);
          })
    };
    
    
   

    

    //DOM
    this.dom = {

        appendInnerHTMLIO: my.curry(function(inner, el) {
            el.innerHTML = inner;
            return el;
        }),
        appendInnerHTMLOI: my.curry(function(el, inner) {
            el.innerHTML = inner;
            return el;
        }),
        appendChildNodeIO: my.curry(function(child, el) {
            el.appendChild(child);
            return el;
        }),
        appendChildNodeOI: my.curry(function(el, child) {
            el.appendChild(child);
            return el;
        }),
        appendSiblingNodeCS: my.curry(function(el, sibling) {
            el.insertAdjacentElement('afterend',sibling);
            return el;
        }),
        check: my.curry(function(el) {
            el.checked = true;
            return el;
        }),
        createElement: my.curry(function(tag) {
            return document.createElement(tag);
        }),
        getElement: my.curry(function(kind, name) {
            switch(kind) {
                case 'id':
                    return document.getElementById(name);
                    break;
                case 'class':
                    return document.getElementsByClassName(name);
                    break;
            }   
        }),
        removeChildrenUntil: my.curry(function(el, numb) {
            while (el.children.length > numb) {
            el.removeChild(el.lastChild);
            }
        }),
        setAttribute: my.curry(function(attribute, name, el) {
            el.setAttribute(attribute, name);
            return el;
        }),
        uncheck: my.curry(function(el) {
            el.checked = false;
            return el;
        }),
        wrapTag: my.curry(function(tag, str) {
            return '<' + tag + '>' + str + '</' + tag + '>';
        }) 
    };


    




}).apply(helper);    












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

