'use strict';


const logOn = true;

const log = my.curry(function(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
});



helper.events.subscribe('clickedOnCourse', function(course) {
    log(data.courses);
    log(course);

    if (typeof course.group_categories !== "undefined") {
        if (course.group_categories.length) {
            log('LOADED');
            helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
            course.group_categories.forEach(buildGroupCategoryInMain);
            course.group_categories.forEach(function(group_category) {
                log('preprep');
                helper.events.publish('prepareClickedOnGroupCategory', group_category);
            });
        }

    } else {
        log('NOT LOADED');
        helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
        let groupCategoryRequestPromise = helper.map(fn, [course])[0];
        groupCategoryRequestPromise.then((objs) => {
            
    
            if (objs.length) {
                data.courses = data.courses.map(function(course) {
    
                    course.group_categories = [];
                    
                    if (objs[0].course_id === course.id) {
                        course.group_categories = objs;
                    }
                    
                    return course;
                });
                
                objs.forEach(buildGroupCategoryInMain);
                objs.forEach(function(group_category) {
                    helper.events.publish('prepareClickedOnGroupCategory', group_category);
                });
            } else {
                
            }
            
            
            
        }).catch(function() {
            console.log('fail');
            helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
        });
    }
    

});


helper.events.subscribe('prepareClickedOnCourse', function(course) {
    
    let groupCategoryRequestPromise = helper.map(fn, [course])[0];
    groupCategoryRequestPromise.then((objs) => {
        log(objs);

        if (objs.length) {
            data.courses = data.courses.map(function(course) {
                if (typeof course.group_categories === "undefined") {
                    
                    if (objs[0].course_id === course.id) {
                        log('objs');
                        log(objs);
                        course.group_categories = objs;
                        console.log('added ', course.id);
                    }
                }
                log(course);

                return course;
            });

            log(data.courses);
        }
        
        //helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
        //objs.forEach(buildGroupCategoryInMain);
    }).catch('fail');
});


helper.events.subscribe('clickedOnGroupCategory', function(group_category) {

    if (typeof group_category.groups !== "undefined") {
        if (group_category.groups.length) {
            RequestNode(group_category.groups).then((message) => {
                log(message);
            });
        }
            // let userRequestPromiseAll = Promise.all(helper.map(fn3, group_category.groups));
            // userRequestPromiseAll.then((groupobjs) => {
    
            //     group_category.groups.forEach(function(groupItem) {
            //         groupItem.users = groupobjs.shift();
            //     });
                
            //     RequestNode(group_category.groups).then((message) => {
            //         log(message);
            //     });
            // });
    // }
   

    } else {
        let groupRequestPromise = helper.map(fn2, [group_category])[0];
        groupRequestPromise.then((objs) => {
            
            if (objs.length) {
                data.courses.forEach(function(courseItem) {
                    courseItem.group_categories = courseItem.group_categories.map(function(groupCategory) {
                        if (objs[0].group_category_id === groupCategory.id) {
                            groupCategory.groups = objs;
    
                            let userRequestPromiseAll = Promise.all(helper.map(fn3, objs));
                            userRequestPromiseAll.then((groupobjs) => {
    
                                groupCategory.groups.forEach(function(groupItem) {
                                    groupItem.users = groupobjs.shift();
                                });
                                
                                RequestNode(groupCategory.groups).then((message) => {
                                    log(message);
                                })
                            });
    
    
                        }
                        
                        return groupCategory;
                    });
    
    
    
                });
                
            }
           
        }).catch('fail');

    }
    

});


helper.events.subscribe('prepareClickedOnGroupCategory', function(group_category) {
    log('PrepGC');
    
    let groupRequestPromise = helper.map(fn2, [group_category])[0];
    groupRequestPromise.then((objs) => {
        log('Im in')
        
        if (objs.length) {
            data.courses.forEach(function(courseItem) {
                if (typeof courseItem.group_categories !== "undefined") {
                    courseItem.group_categories = courseItem.group_categories.map(function(groupCategory) {
                        if (objs[0].group_category_id === groupCategory.id) {
                            groupCategory.groups = objs;
    
                            let userRequestPromiseAll = Promise.all(helper.map(fn3, objs));
                            userRequestPromiseAll.then((groupobjs) => {
    
                                groupCategory.groups.forEach(function(groupItem) {
                                    groupItem.users = groupobjs.shift();
                                });

                                log('Im here')
                                
                                // RequestNode(groupCategory.groups).then((message) => {
                                //     log(message);
                                // })
                            });
    
    
                        }
                        
                        return groupCategory;
                    });

                }
            });
            
        }
       
    }).catch(console.log('fail'));
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
        //helper.events.publish('click', this.children[0].children[0].id);
        helper.events.publish('clickedOnCourse', course);
    });
}


function buildGroupCategoryInMain(group_category) {

    log(group_category);
    
    
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
        //helper.events.publish('clack', this.children[0].children[0].id);
        helper.events.publish('clickedOnGroupCategory', group_category);

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
        // helper.events.publish('clock', this.children[0].children[0].id);
    });
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

            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(JSON.parse(request.response));
                }
            };
        })
    };
};

function prepareRequestNode(baseUrl) {
    return(data) => {
        return new Promise((resolve, reject) => {
            var jsonData = JSON.stringify(data);
            var request = new XMLHttpRequest();
            request.open('POST', baseUrl, true);
            request.setRequestHeader('Content-type', 'application/json');
            request.send(jsonData);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.responseText);
                }
            };

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

    const searchObj = {
        area: "users",
        areaId: "5091",
        what: "courses",
        perPage: "100",
        token: "8779~3LmsZZse4dRnHvdnYBRt69Yc5dTFDApw1FlZCP49T4o6xIDsVXrKZ122VQFiopCh"
    };

    let courseRequestPromise = RequestCanvas(searchObj);

    courseRequestPromise.then((objs) => {
        helper.dom.setAttribute('class', 'schedule-tesla__left', helper.dom.getElement('id', 'courses'));
        helper.dom.appendInnerHTMLIO((my.compose(makeHeaderboxDivString, helper.reduce(helper.str.adder, ''), helper.map(makeHeaderboxChildDivStrings))(headerboxItemsCourses)), helper.dom.getElement('id', 'courses'));
        log(objs);

        data.courses = objs;

        data.courses.forEach(buildCoursesInSideboxLeft);

        data.courses.forEach(function(course) {
            helper.events.publish('prepareClickedOnCourse', course);
        });
    });
});