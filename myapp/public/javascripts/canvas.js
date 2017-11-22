'use strict';

const logOn = true;

const log = my.curry(function(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
});


var events = (function(){
    var topics = {};
    var hOP = topics.hasOwnProperty;
  
    return {
      subscribe: function(topic, listener) {
        // Create the topic's object if not yet created
        if(!hOP.call(topics, topic)) topics[topic] = [];
  
        // Add the listener to queue
        var index = topics[topic].push(listener) -1;
  
        // Provide handle back for removal of topic
        return {
          remove: function() {
            delete topics[topic][index];
          }
        };
      },
      publish: function(topic, info) {
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if(!hOP.call(topics, topic)) return;
  
        // Cycle through topics queue, fire!
        topics[topic].forEach(function(item) {
                item(info != undefined ? info : {});
        });
      }
    };
})();


events.subscribe('click', function(obj) {
    log(obj);

    helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);

    let xxx = data.courses.filter(function(course) {
        log(course.id);
       return course.id == obj;
    });

    log(xxx);

    xxx[0].group_categories.forEach(buildGroupCategoryInMain);
        
});

events.subscribe('clack', function(obj) {
    log(obj);

    // helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);

    let xxx = data.courses.filter(function(course) {
        let xxx = [];
        xxx = course.group_categories.filter(function(group_category) {
            //log(group_category.id);
            return group_category.id == obj;
        })
        return xxx.length > 0;
    });

    let yyy = xxx[0].group_categories.filter(function(group_category) {
        return group_category.id == obj;
    });


    log(yyy);

    yyy[0].groups.forEach(buildGroupInMain);
        
});


events.subscribe('clock', function(obj) {
    log(obj);




    let xxx = data.courses.filter(function(course) {
        let xxx = [];
        xxx = course.group_categories.filter(function(group_category) {
            let xxx = [];
            xxx = group_category.groups.filter(function(group) {
                //log(group_category.id);
                return group.id == obj;
            })
            //log(group_category.id);
            return xxx.length > 0;
        })
        return xxx.length > 0;
    });

    let yyy = [];
    yyy = xxx[0].group_categories.filter(function(group_category) {
        let xxx = [];
        xxx = group_category.groups.filter(function(group) {
            //log(group_category.id);
            return group.id == obj;
        })
        //log(group_category.id);
        return xxx.length > 0;
    });

    log(yyy);
    
    let zzz = [];
    zzz = yyy[0].filter(function(group) {
        //log(group_category.id);
        return group.id == obj;
    });

    log(zzz);
        
});




function buildCoursesInSideboxLeft(course) {
    
    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel4;
    let innerEl;

    elLevel1 = my.compose(helper.dom.setAttribute('id', course.id), helper.dom.uncheck, helper.dom.setAttribute('data-name', 'checkbox-E'), helper.dom.setAttribute('name', 'checkbox-E'), helper.dom.setAttribute('type', 'radio'), helper.dom.setAttribute('class', 'w-checkbox-input'), helper.dom.createElement)('input');
    elLevel2 = my.compose(helper.dom.setAttribute('class', 'w-checkbox w-clearfix'), helper.dom.createElement)('div');
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel1 = my.compose(helper.dom.setAttribute('for', 'checkbox-E'), helper.dom.setAttribute('class', 'field-label-8 w-form-label'), helper.dom.createElement)('label');
    innerEl = course.name;
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'checkboxblock__entry'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);

    elLevel4 = helper.dom.getElement('id', 'classtypesBox');
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel3);

    elLevel3.addEventListener('click', function() {
        helper.dom.check(this.children[0].children[0]);
        events.publish('click', this.children[0].children[0].id);
    });
}


function buildGroupCategoryInMain(group_category) {
    
    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel4;
    let innerEl;

    innerEl = group_category.id;
    elLevel1 = my.compose(helper.dom.setAttribute('id', group_category.id), helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);

    elLevel2 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__row'), helper.dom.createElement)('div');
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = group_category.name;
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__rowbox'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);

    elLevel4 = helper.dom.getElement('id', 'courses');
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel3);

    elLevel3.addEventListener('click', function() {
        events.publish('clack', this.children[0].children[0].id);
        RequestNode(group_category.groups).then((objs) => {
            log(objs);
        })
    });
}


function buildGroupInMain(group) {
    
    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel4;
    let innerEl;

    innerEl = group.id;
    elLevel1 = my.compose(helper.dom.setAttribute('id', group.id), helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);

    elLevel2 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__row'), helper.dom.createElement)('div');
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = group.name;
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__rowbox'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);

    elLevel4 = helper.dom.getElement('id', group.group_category_id).parentElement.parentElement;
    elLevel4 = helper.dom.appendSiblingNodeCS(elLevel4, elLevel3);

    elLevel3.addEventListener('click', function() {
        events.publish('clock', this.children[0].children[0].id);
    });
}



function initalAddToDOM(courses) {
    log(courses);
    
    //BUILD SIDEBOX
    courses.forEach(buildCoursesInSideboxLeft);


    //BUILD MAIN
    helper.dom.setAttribute('class', 'schedule-tesla__left', helper.dom.getElement('id', 'courses'));
    helper.dom.appendInnerHTMLIO((my.compose(makeHeaderboxDivString, helper.reduce(helper.str.adder, ''), helper.map(makeHeaderboxChildDivStrings))(headerboxItemsCourses)), helper.dom.getElement('id', 'courses'));

    courses[0].group_categories.forEach(buildGroupCategoryInMain);


}


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



//HTML
const makeHeaderboxDivString = my.curry(function(str) {
        return '<div class="table-tesla__table__headerbox">' + str + '</div>';
});

const makeHeaderboxChildDivStrings = my.curry(function(item) {
    return '<div class="' + item.class + '"><div class="table-tesla__header__cell__text">' + item.lable + '</div></div>';
});



//AJAX
const RequestCanvas = prepareRequestCanvas(
    'https://kth.instructure.com/api/v1'
);

const RequestNode = prepareRequestNode(
    'http://0.0.0.0:3000/api/users'
);

function prepareRequestCanvas(baseUrl) {
    return(relUrlObj) => {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            request.open('GET', baseUrl + '/' + relUrlObj.area + '/' + relUrlObj.areaId + '/' + relUrlObj.what + '?per_page=' + relUrlObj.perPage + '&access_token=' + relUrlObj.token);
            request.responseType = 'application/json';
            request.send();
            //console.log(baseUrl + '/' + relUrl);
            request.onload = () => resolve(JSON.parse(request.response));
        })
    };
};

function prepareRequestNode(baseUrl) {
    return(data) => {
        return new Promise((resolve, reject) => {
            //var datatest = {name:"John"};
            //var datatest = '{"location": "York","haveBeen": true,"rating": 4}';
            var jsonData = JSON.stringify(data);
            var request = new XMLHttpRequest();
            request.open('POST', baseUrl, true);
            request.setRequestHeader('Content-type', 'application/json');
            request.send(jsonData);
            
            //console.log(baseUrl + '/' + relUrl);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var json = request.responseText;
                    console.log(json);
                    resolve(request.responseText)
                }
            };


            // var xhr = new XMLHttpRequest();
            // var url = "http://0.0.0.0:3000/api/users";
            // xhr.open("POST", url, true);
            // xhr.setRequestHeader("Content-type", "application/json");
            // xhr.onreadystatechange = function () {
            //     if (xhr.readyState === 4 && xhr.status === 200) {
            //         var json = JSON.parse(xhr.responseText);
            //         console.log(xhr.responseText);
            //     }
            // };
            //var data = JSON.stringify();
            //xhr.send('{"email": "hey@mail.com", "password": "101010"}');
            // request.onload = () => {
            //     log('RESPONSE');
            //     log(request.response);
            //     resolve(request.response)};
        })
    };
};

const fn = function canvasUsersGetter(item) {
    const searchObj = {
        area: "courses",
        areaId: item.id,
        what: "group_categories",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    return RequestCanvas(searchObj);
}


const fn2 = function canvasUsersGetter2(item) {
    //console.log(item);
    const searchObj = {
        area: "group_categories",
        areaId: item.id,
        what: "groups",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    return RequestCanvas(searchObj);
}

const fn3 = function canvasUsersGetter2(item) {
    //console.log(item);
    const searchObj = {
        area: "groups",
        areaId: item.id,
        what: "users",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    return RequestCanvas(searchObj);
}




//DATA
var data = {};








document.addEventListener("DOMContentLoaded", function () {
    // var xhr = new XMLHttpRequest();
    // var url = "http://0.0.0.0:3000/api/users";
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-type", "application/json");
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         var json = JSON.parse(xhr.responseText);
    //         console.log(xhr.responseText);
    //     }
    // };
    // //var data = JSON.stringify();
    // xhr.send('{"email": "hey@mail.com", "password": "101010"}');



    const searchObj = {
        area: "users",
        areaId: "5091",
        what: "courses",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    };

    RequestCanvas(searchObj).then((objs) => {

        data.courses = helper.arr.flatten(objs);
        data.courses.forEach(function(course) {
            course.group_categories = [];
        })
      
        let results = Promise.all(helper.map(fn, data.courses));

        results.then((objs) => {

            helper.arr.flatten(objs).forEach(function(obj) {

                data.courses.forEach(function(course) {
                    if (course.id === obj.course_id) {
                        obj.groups = [];
                        course.group_categories.push(obj);
                    };
                });
            })

            let results = Promise.all(helper.map(fn2, helper.arr.flatten(objs)));

            results.then(objs => {

                helper.arr.flatten(objs).forEach(function(obj) {

                    data.courses.forEach(function(course) {
                        course.group_categories.forEach(function(group_category) {
                            if (group_category.id === obj.group_category_id) {
                                obj.users = [];
                                group_category.groups.push(obj);
                                
                                // REQUESTING USERS
                                [obj].map(fn3).forEach(function(item) {
                                    item.then(objs => {
                                        //log(objs);
                                        objs.forEach(function(user) {
                                            obj.users.push(user);
                                        })
                                    })
                                })
                            };
                        });
                    });
                })

            }).then(initalAddToDOM(data.courses));
    
        });
    })
});


                //     var results = Promise.all(helper.arr.flatten(objs).map(fn3));

                //     results.then(objs => {

                //         helper.arr.flatten(objs).forEach(function(obj) {
                //             data.courses.forEach(function(course) {
                //                 course.group_categories.forEach(function(group_category) {
                //                     group_category.groups.forEach(function(group) {
                //                         if (group.id === obj.group_id) {
                //                             group.users.push(obj);
                //                         };
                //                     });
                //                 });
                //             });
                //         })

                //         log(data.courses);
                        
                //         
                                
                // });

                  //log(data.courses);

        //var actions = helper.arr.flatten(objs).map(fn);


        //log(data.courses);



        // let myTestAr = [];
        
        //     myTestAr.push('one', 'two', 'three');
        
        //     myTestAr.pop();
        
        //     myTestAr.shift();
        
        //     myTestAr.unshift('newOne', 'newTwo');
        
        //     myTestAr.forEach(function (item) {
        //         my.compose(helper.dom.appendChildNodeOI(helper.dom.getElement('id', 'sideboxesRight')), helper.dom.setAttribute('class', item), helper.dom.createElement)('div');
        //     });
        
        //     myTestAr.forEach(function (item) {
        //         my.compose(helper.dom.appendChildNodeOI(helper.dom.getElement('id', 'sideboxesRight')), helper.dom.setAttribute('data-sdfsdf', item), helper.dom.setAttribute('class', item), helper.dom.createElement)('div');
        //     });
            
        
        //   
        
        
            // if (Array.isArray(courses)) {
    //     courses.forEach(
    //         function (obj) {


    //             if (Array.isArray(obj)) {
    //                 obj.forEach(
    //                     function(item) {
    //                         (function (childEl,inner) {
    //                             //console.log(inner);

    //                             childEl.innerHTML = ''
    //                             //parentEl.appendChild(childEl);
    //                             helper.dom.getElement('id', 'courses').appendChild(childEl);
                                
    //                         })(helper.dom.createElement('div'), item)
    //                     }

    //                 );
                    
    //             }
                
    //         });

    // }
        
            
        
        
        
        
        
        
        
        
        

