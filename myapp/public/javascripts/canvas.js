'use strict';


const logOn = true;

const log = my.curry(function(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
});



//Event listeners
helper.events.subscribe('reloadedPage', function(user) {
    coursesFromUser(user).then((objs) => {

        //buildHeaderInMain();
        helper.dom.setAttribute('class', 'resurs-mainbox', helper.dom.getElement('id', 'mainbox'));

        // //log(objs);
        let innerEl = '<div class="resurs-main-header-row">\
        <div class="resurs-main-header-lable-box">\
          <div class="resurs-main-header-lable">INNEHÅLL</div>\
        </div>\
        <div class="resurs-main-header-button">\
          <div class="resurs-main-header-form-block w-form">\
            <form id="email-form-4" name="email-form-4" data-name="Email Form 4" class="resurs-main-header-form"><input type="submit" value="Skicka" data-wait="Please wait..." class="resurs-main-header-form-button w-button"></form>\
            <div class="w-form-done"></div>\
            <div class="w-form-fail"></div>\
          </div>\
        </div>\
      </div>';

      helper.dom.appendInnerHTMLIO(innerEl, helper.dom.getElement('id', 'mainbox'));
        

        data.courses = objs;
        //getAllInStore('courses');
        //getOneFromKeyInStore('courses', 675);
        getAllFromIndexInStore('group_categories', 'course_id', 675);

        

        data.courses.forEach(buildCoursesInSideboxLeft);

        objs.forEach(addObjectToCoursesStore);
        


        //Make recursive...
        data.courses.forEach(function(course) {
            course.done = false;
            helper.events.publish('prepareClickedOnCourse', course);
        });
    });
        
});

helper.events.subscribe('clickedOnCourse', function(course) {

    if (typeof course.group_categories !== "undefined" && course.group_categories.length && course.done) {
        
        helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'mainbox'), 1);
        buildGroupCategoriesAndPrepareGroups(course);
        

    } else {
        helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'mainbox'), 1);

        let groupCategoryRequestPromise = helper.map(groupCateroriesFromCourse, [course])[0];
        groupCategoryRequestPromise.then((objs) => {

            if (objs.length) {
                addGroupCategoriesToCourse(data, objs);
                buildGroupCategoriesAndPrepareGroups(course);
                course.done = true;
            } 
            
        }).catch(function() {
            console.log('fail');
            helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'mainbox'), 1);
        });
    }
    
});


helper.events.subscribe('prepareClickedOnCourse', function(course) {
    if (typeof course.group_categories === "undefined" || !course.done) {

        let groupCategoryRequestPromise = helper.map(groupCateroriesFromCourse, [course])[0];
        groupCategoryRequestPromise.then((objs) => {
    
            if (objs.length) {
                addGroupCategoriesToCourse(data, objs);
                course.done = true;
                objs.forEach(addObjectToGroupCategoriesStore);
            }        

        }).catch(function() {
            console.log('fail - groupCategoryRequestPromise', course);
        });


    }


});


helper.events.subscribe('clickedOnGroupCategory', function(group_category) {

    if (typeof group_category.groups !== "undefined" && group_category.groups.length && group_category.done) {

        //log('clicked');
        requestJsonPostFromNodeUsers(group_category.groups).then((message) => {
            log(message);
        });
        
    } else 
    {
        let groupRequestPromise = helper.map(groupsFromGroupCaterories, [group_category])[0];
        groupRequestPromise.then((objs) => {
            
                if (objs.length) {
                    data.courses.forEach(function(courseItem) {
                        //log(courseItem);
                        if (typeof courseItem.group_categories !== "undefined") {
                            courseItem.group_categories = courseItem.group_categories.map(function(groupCategory) {
                                if (objs[0].group_category_id === groupCategory.id) {
                                    groupCategory.groups = objs;
                                    groupCategory.done = false;
            
                                    let userRequestPromiseAll = Promise.all(helper.map(usersFromGroups, groupCategory.groups));
                                    userRequestPromiseAll.then((groupobjs) => addUsersToGroup(groupobjs, groupCategory)).then(function() {
                                        groupCategory.done = true;
                                        requestJsonPostFromNodeUsers(groupCategory.groups).then((message) => {
                                            log(message);
                                        })
                                    }).catch(function() {
                                        console.log('fail - userRequestPromiseAll');
                                    });
            
            
                                }
                                
                                return groupCategory;
                            });
                        }
        
        
        
                    });
                    
                }

        });

    }
    

});


helper.events.subscribe('prepareClickedOnGroupCategory', function(group_category) {
    
    if (typeof group_category.groups !== "undefined" && group_category.groups.length && group_category.done) {

            //log('without clicked');
    } else 
    {
        let groupRequestPromise = helper.map(groupsFromGroupCaterories, [group_category])[0];
        groupRequestPromise.then((objs) => {
            //log('promise without clicked');
            
                if (objs.length) {
                    data.courses.forEach(function(courseItem) {
                        if (typeof courseItem.group_categories !== "undefined") {
                            courseItem.group_categories = courseItem.group_categories.map(function(groupCategory) {
                                if (objs[0].group_category_id === groupCategory.id) {
                                    groupCategory.groups = objs;
                                    groupCategory.done = false;
            
                                    let userRequestPromiseAll = Promise.all(helper.map(usersFromGroups, groupCategory.groups));
                                    userRequestPromiseAll.then((groupobjs) => addUsersToGroup(groupobjs, groupCategory)).then(function() {
                                        groupCategory.done = true;
                                        
                                    }).catch(function() {
                                        console.log('fail - userRequestPromiseAll');
                                    });
            
            
                                }
                                
                                return groupCategory;
                            });
                        }
        
        
        
                    });
                    
                }

        });

    }

});

//TRY AND MAKE A RECURSIVE VERSION
function addGroupCategoriesToCourse(data, objs) {
    data.courses = data.courses.map(function(course) {
    
        //course.group_categories = [];

        if (objs[0].course_id === course.id) {
            course.group_categories = objs;
        }

        return course;
    });
}


function buildGroupCategoriesAndPrepareGroups(course) {
    course.group_categories.forEach(buildGroupCategoryInMain);
    course.group_categories.forEach(function(group_category) {
        helper.events.publish('prepareClickedOnGroupCategory', group_category);
    });
}


function addUsersToGroup(groupobjs, groupCategory) {
        groupCategory.groups.forEach(function(groupItem) {
            //console.log(groupobjs[0]);
            groupItem.users = groupobjs.shift();
        });
}


function cutNameAndCodeFromCourse(course) {
    
    if(helper.str.startsWith(course.name, 'AI')) {
        course.cutName = helper.str.removeFirstWordsFromString(course.name, 2);
        course.cutCode = helper.str.getFirstWordsFromString(course.name, 2);
    } else {
        course.cutName = course.name;
        course.cutCode = '';
    };

    return course;
}


function buildCoursesInSideboxLeft(course) {

    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel35;
    let elLevel4;
    let innerEl;

    course = cutNameAndCodeFromCourse(course);

    elLevel1 = my.compose(helper.dom.setAttribute('id', course.id), helper.dom.uncheck, helper.dom.setAttribute('type', 'checkbox'), helper.dom.setAttribute('class', 'resurs-form-field-checkbox w-checkbox-input'), helper.dom.createElement)('input');
    elLevel2 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field w-checkbox'), helper.dom.createElement)('div');
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel1 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field-label w-form-label'), helper.dom.createElement)('label');
    innerEl = course.cutName;
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field-row'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);

    elLevel35 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field-table'), helper.dom.createElement)('div');
    elLevel35 = helper.dom.appendChildNodeOI(elLevel35, elLevel3);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'text-block-16'), helper.dom.createElement)('div');
    innerEl = course.cutCode;
    elLevel3 = helper.dom.appendInnerHTMLOI(elLevel3, innerEl);
    elLevel35 = helper.dom.appendChildNodeOI(elLevel35, elLevel3);

    elLevel4 = helper.dom.getElement('id', 'sidebox-courses');
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel35);

   

    elLevel35.addEventListener('click', function() {

        let elements = [... elLevel4.childNodes];
        
        elements.shift();
        elements.shift();
        elements.shift();
        elements.forEach(function(childItem){
            helper.dom.uncheck(childItem.childNodes[0].childNodes[0].childNodes[0]);
        });


        helper.dom.check(this.childNodes[0].childNodes[0].childNodes[0]);
        helper.events.publish('clickedOnCourse', course);
    });
}




function buildGroupCategoryInMain(group_category) {
    
    let elLevel1;
    let elLevel2;
    let elLevel25;
    let elLevel3;
    let elLevel4;
    let elLevel5;
    let innerEl;

    elLevel2 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field w-checkbox'), helper.dom.createElement)('div');

    elLevel1 = my.compose(helper.dom.setAttribute('class', 'resurs-form-field-checkbox w-checkbox-input'), helper.dom.setAttribute('type', 'checkbox'), helper.dom.createElement)('input');
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = group_category.name;
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'main resurs-form-field-label w-form-label'), helper.dom.createElement)('label');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);


    
    elLevel25 = my.compose(helper.dom.setAttribute('class', 'resurs-main-row-form'), helper.dom.createElement)('form');
    elLevel25 = helper.dom.appendChildNodeOI(elLevel25, elLevel2);

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'resurs-main-row-form-block w-form'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel25);

    elLevel4 = my.compose(helper.dom.setAttribute('class', 'resurs-main-row'), helper.dom.createElement)('div');
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel3);



    elLevel5 = helper.dom.getElement('id', 'mainbox');
    elLevel5 = helper.dom.appendChildNodeOI(elLevel5, elLevel4);

    elLevel2.addEventListener('click', function() {
        helper.events.publish('clickedOnGroupCategory', group_category);

    });


}       


function buildHeaderInMain() {
    
    let elLevel1;
    let elLevel2;

    let elLevel3;
    let elLevel4;
    let elLevel5;
    let elLevel6;
    let innerEl;


    elLevel5 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-row'), helper.dom.createElement)('div');

    elLevel4 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-lable-box'), helper.dom.createElement)('div');
    elLevel3 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-lable'), helper.dom.createElement)('div');

    innerEl = 'GROUP CATEGORY';
    elLevel3 = helper.dom.appendInnerHTMLOI(elLevel3, innerEl);
    
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel3);

    elLevel5 = helper.dom.appendChildNodeOI(elLevel5, elLevel4);


    



    elLevel2 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-form'), helper.dom.createElement)('form');
    
    
    elLevel1 = my.compose(helper.dom.setAttribute('type', 'submit'), helper.dom.setAttribute('class', 'resurs-main-header-form-button w-button'), helper.dom.createElement)('input');
    
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);
    

    elLevel3 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-form-block w-form'), helper.dom.createElement)('div');
    elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);



    elLevel4 = my.compose(helper.dom.setAttribute('class', 'resurs-main-header-button'), helper.dom.createElement)('div');
    elLevel4 = helper.dom.appendChildNodeOI(elLevel4, elLevel3);

    elLevel5 = helper.dom.appendChildNodeOI(elLevel5, elLevel4);



    elLevel6 = my.compose(helper.dom.setAttribute('class', 'resurs-mainbox'), helper.dom.getElement('id'))('mainbox');
    
    elLevel6 = helper.dom.appendChildNodeOI(elLevel6, elLevel5);


}






// function buildGroupInMain(group) {
    
//     let elLevel1;
//     let elLevel2;
//     let elLevel3;
//     let elLevel4;
//     let innerEl;

//     elLevel2 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__row'), helper.dom.createElement)('div');

//     innerEl = group.id;
//     elLevel1 = my.compose(helper.dom.setAttribute('id', group.id), helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

//     innerEl = group.name;
//     elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

//     innerEl = '';
//     elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

//     innerEl = '';
//     elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

//     innerEl = '';
//     elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

//     innerEl = '';
//     elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
//     elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
//     elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);


//     elLevel3 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__rowbox'), helper.dom.createElement)('div');
//     elLevel3 = helper.dom.appendChildNodeOI(elLevel3, elLevel2);

//     elLevel4 = helper.dom.getElement('id', group.group_category_id).parentElement.parentElement;
//     elLevel4 = helper.dom.appendSiblingNodeCS(elLevel4, elLevel3);

//     elLevel3.addEventListener('click', function() {
//     });
// }



// const headerboxItemsCourses = 
//     [
//         {
//             lable: 'GROUP CATEGORY',
//             class: 'table-tesla__header__lablebox--course'
//         },
//         {
//             lable: '',
//             class: 'table-tesla__header__lablebox-period'
//         },
//         {
//             lable: '',
//             class: 'table-tesla__table__header__lablebox-programandyear'
//         },
//         {
//             lable: '',
//             class: 'table-tesla__table__header__lablebox-programandyear'
//         },
//         {
//             lable: '',
//             class: 'table-tesla__table__header__lablebox-programandyear'
//         },
//         {
//             lable: '',
//             class: 'table-tesla__table__header__lablebox-programandyear'
//         }
//     ];


//



// //HTML
// const makeHeaderboxDivString = my.curry(function(str) {
//         return '<div class="table-tesla__table__headerbox">' + str + '</div>';
// });

// const makeHeaderboxChildDivStrings = my.curry(function(item) {
//     return '<div class="' + item.class + '"><div class="table-tesla__header__cell__text">' + item.lable + '</div></div>';
// });



//AJAX
const requestJsonPostFromNode = helper.requestPostJson('http://0.0.0.0:3000/api');

const requestJsonPostFromNodeUsers = requestJsonPostFromNode('/users');

const requestJsonGetFromCanvas = helper.requestGetJson('https://kth.instructure.com/api/v1');


function coursesFromUser(item) {
    const searchObj = {
        area: "users",
        areaId: item,
        what: "courses",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    };

    let searchString = '/' + searchObj.area + '/' + searchObj.areaId + '/' + searchObj.what + '?per_page=' + searchObj.perPage + '&access_token=' + searchObj.token;

    return requestJsonGetFromCanvas(searchString);
}


function groupCateroriesFromCourse(item) {
    const searchObj = {
        area: "courses",
        areaId: item.id,
        what: "group_categories",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    let searchString = '/' + searchObj.area + '/' + searchObj.areaId + '/' + searchObj.what + '?per_page=' + searchObj.perPage + '&access_token=' + searchObj.token;

    return requestJsonGetFromCanvas(searchString);
}


function groupsFromGroupCaterories(item) {
    const searchObj = {
        area: "group_categories",
        areaId: item.id,
        what: "groups",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    let searchString = '/' + searchObj.area + '/' + searchObj.areaId + '/' + searchObj.what + '?per_page=' + searchObj.perPage + '&access_token=' + searchObj.token;

    return requestJsonGetFromCanvas(searchString);
}

function usersFromGroups(item) {
    const searchObj = {
        area: "groups",
        areaId: item.id,
        what: "users",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    }

    let searchString = '/' + searchObj.area + '/' + searchObj.areaId + '/' + searchObj.what + '?per_page=' + searchObj.perPage + '&access_token=' + searchObj.token;

    return requestJsonGetFromCanvas(searchString);
}



//DATA
var data = {};


//INDEXEDDB
const DB_NAME = 'canvasdb';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = 'courses';

var db;



function openDb(db_name, db_version) {
    console.log("openDb ...");


    var openRequest = indexedDB.open(db_name,db_version);
    
    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result; 
        console.log("running onupgradeneeded");
    
        if(!thisDB.objectStoreNames.contains("courses")) {
            var coursesOS = thisDB.createObjectStore("courses", {keyPath: "id"});
            coursesOS.createIndex("course_code", "course_code", {unique:false});
        }
    
        if(!thisDB.objectStoreNames.contains("group_categories")) {
            var group_categoriesOS = thisDB.createObjectStore("group_categories", {keyPath: "id"});
            group_categoriesOS.createIndex("course_id", "course_id", {unique:false});
        }
    }

    openRequest.onsuccess = function(e) {
        console.log("running onsuccess");
        db = e.target.result;
        helper.events.publish('reloadedPage', '5091');
    }
    
    openRequest.onerror = function(e) {
        console.log("onerror!");
        console.dir(e);
    }
}


function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}


function addObjectToStore(store_name, obj) {
    console.log("addPublication arguments:", obj);

    var store = getObjectStore(store_name, 'readwrite');
    var req;
    try {
      req = store.add(obj);
    } catch (e) {
      if (e.name == 'DataCloneError') {
        console.log(e.name);
      }
        
      throw e;
    }
    req.onsuccess = function (event) {
      console.log("Insertion in DB successful");
    };
    req.onerror = function() {
      console.error("addPublication error", this.error);
    };
}

function addObjectToCoursesStore(obj) {
    let store_name;
    store_name = 'courses';
    return addObjectToStore(store_name, obj);
}

function addObjectToGroupCategoriesStore(obj) {
    let store_name;
    store_name = 'group_categories';
    return addObjectToStore(store_name, obj);
}


function getOneFromKeyInStore(store_name, key) {


    let store = getObjectStore(store_name, 'readonly');

    let request = store.get(key);
    
    request.onsuccess = function(e) {
        log('get one');
        var result = e.target.result;
        console.dir(result);
    }

    request.onerror = function(e) {
        console.log("Error");
        console.dir(e);
    }
}

function deleteOneFromKeyInStore(store_name, key) {
    
    
    let store = getObjectStore(store_name, 'readwrite');

    let request = store.delete(key);
    
    request.onsuccess = function(e) {
        log('deleted one');
        console.dir(e);
    }

    request.onerror = function(e) {
        console.log("Error");
        console.dir(e);
    }
}



function getAllFromIndexInStore(store_name, index_name, index_value) {
    log('hopp');

    let singleKeyRange = IDBKeyRange.only(index_value);

    let store = getObjectStore(store_name, 'readonly');

    let index = store.index(index_name);

    let request;

    request = index.openCursor(singleKeyRange);
    //log('request');
    log(request);
    request.onsuccess = function(event) {
        log('hipp');
        let cursor = event.target.result;

        // If the cursor is pointing at something, ask for the data
        if (cursor) {
            log('hej');
            log(cursor.value);
            cursor.continue();

            // Move on to the next object in store
        } else {
            console.log("No more entries");
        }
    };
}

function getOneFromIndexInStore(store_name, index_name, index_value) {
    log('hopp');

    //let singleKeyRange = IDBKeyRange.only(675);

    let store = getObjectStore(store_name, 'readonly');

    let index = store.index(index_name);

    let request;

    request = index.get(index_value);
    //log('request');
    log(request);
    request.onsuccess = function(event) {
        log('hipp');
        log(event.target.result);
    };
}



function getAllInStore(store_name) {
    //log('hopp');

    let store = getObjectStore(store_name, 'readonly');

    let request;

    request = store.openCursor();
    request.onsuccess = function(event) {
        //log('hipp');
        let cursor = event.target.result;

        // If the cursor is pointing at something, ask for the data
        if (cursor) {
            //log('hej');
            log(cursor.value);
            cursor.continue();

            // Move on to the next object in store
        } else {
            console.log("No more entries");
        }
    };
}


//DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // var DBDeleteRequest = window.indexedDB.deleteDatabase("ora_idb5");
    
    // DBDeleteRequest.onerror = function(event) {
    //   console.log("Error deleting database.");
    // };
     
    // DBDeleteRequest.onsuccess = function(event) {
    //   console.log("Database deleted successfully");
        
    //   console.log(event.result); // should be undefined
    // };
    openDb('canvasdb', 1);


});






//FLYTTA INDEXEDDB TILL HELPER.JS

