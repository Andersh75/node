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
        helper.dom.setAttribute('class', 'schedule-tesla__left', helper.dom.getElement('id', 'courses'));
        helper.dom.appendInnerHTMLIO((my.compose(makeHeaderboxDivString, helper.reduce(helper.str.adder, ''), helper.map(makeHeaderboxChildDivStrings))(headerboxItemsCourses)), helper.dom.getElement('id', 'courses'));
        //log(objs);

        data.courses = objs;

        data.courses.forEach(buildCoursesInSideboxLeft);

        data.courses.forEach(function(course) {
            course.done = false;
            helper.events.publish('prepareClickedOnCourse', course);
        });
    });
        
});

helper.events.subscribe('clickedOnCourse', function(course) {

    if (typeof course.group_categories !== "undefined" && course.group_categories.length && course.done) {
        
        helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
        buildGroupCategoriesAndPrepareGroups(course);
        

    } else {
        helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);

        let groupCategoryRequestPromise = helper.map(groupCateroriesFromCourse, [course])[0];
        groupCategoryRequestPromise.then((objs) => {

            if (objs.length) {
                addGroupCategoriesToCourse(data, objs);
                buildGroupCategoriesAndPrepareGroups(course);
                course.done = true;
            } 
            
        }).catch(function() {
            console.log('fail');
            helper.dom.removeChildrenUntil(helper.dom.getElement('id', 'courses'), 1);
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
        helper.events.publish('clickedOnCourse', course);
    });
}


function buildGroupCategoryInMain(group_category) {
    
    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel4;
    let innerEl;

    elLevel2 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__row'), helper.dom.createElement)('div');

    innerEl = '';
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.setAttribute('type', 'checkbox'), helper.dom.createElement)('input');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = group_category.name;
    elLevel1 = my.compose(helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
    elLevel2 = helper.dom.appendChildNodeOI(elLevel2, elLevel1);

    innerEl = '<button type="button">Download</button>';
    elLevel1 = my.compose(helper.dom.setAttribute('id', group_category.id), helper.dom.setAttribute('class', 'table-tesla__cell__text--bold'), helper.dom.createElement)('div');
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
        helper.events.publish('clickedOnGroupCategory', group_category);

    });
}


function buildGroupInMain(group) {
    
    let elLevel1;
    let elLevel2;
    let elLevel3;
    let elLevel4;
    let innerEl;

    elLevel2 = my.compose(helper.dom.setAttribute('class', 'table-tesla__table__row'), helper.dom.createElement)('div');

    innerEl = group.id;
    elLevel1 = my.compose(helper.dom.setAttribute('id', group.id), helper.dom.setAttribute('class', 'table-tesla__cell__text'), helper.dom.createElement)('div');
    elLevel1 = helper.dom.appendInnerHTMLOI(elLevel1, innerEl);
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
    });
}



const headerboxItemsCourses = 
    [
        {
            lable: 'GROUP CATEGORY',
            class: 'table-tesla__header__lablebox--course'
        },
        {
            lable: '',
            class: 'table-tesla__header__lablebox-period'
        },
        {
            lable: '',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: '',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: '',
            class: 'table-tesla__table__header__lablebox-programandyear'
        },
        {
            lable: '',
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




//DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    helper.events.publish('reloadedPage', '5091');
});


