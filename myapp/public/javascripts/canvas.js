'use strict';

var logOn = true;

const log = my.curry(function(someVariable) {
    if (logOn) {
        console.log(someVariable);
    }
    return someVariable;
});


function initalAddToDOM(courses) {

    courses.forEach(function(course) {

        let elLevel1;
        let elLevel2;
        let elLevel3;
        let elLevel4;
        let innerEl;

        elLevel1 = my.compose(helper.dom.uncheck, helper.dom.setAttribute('data-name', 'checkbox-E'), helper.dom.setAttribute('name', 'checkbox-E'), helper.dom.setAttribute('type', 'radio'), helper.dom.setAttribute('class', 'w-checkbox-input'), helper.dom.createElement)('input');
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
    //console.log(item);
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
    //console.log(item);
    let searchObj = {
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

    var searchObj = {
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
                                
                                //REQUESTING USERS
                                // [obj].map(fn3).forEach(function(item) {
                                //     item.then(objs => {
                                //         //log(objs);
                                //         objs.forEach(function(user) {
                                //             obj.users.push(user);
                                //         })
                                //     })
                                // })
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
                        
                //         if (Array.isArray(objs)) {
                //             objs.forEach(
                //                 function (obj) {
                //                     if (Array.isArray(obj)) {
                //                         obj.forEach(
                //                             function(item) {
                //                                 (function (childEl,inner) {
                //                                     //console.log(inner);

                //                                     childEl.innerHTML = '<div class="table-tesla__table__rowbox">\
                //                                     <div class="table-tesla__table__row">\
                //                                       <div class="table-tesla__cell__text">' + inner.id + '</div>\
                //                                       <div class="table-tesla__cell__text">' + inner.name + '</div>\
                //                                       <div class="table-tesla__cell__text">' + inner.sortable_name + '</div>\
                //                                       <div class="table-tesla__cell__text--bold">' + inner.short_name + '</div>\
                //                                       <div class="table-tesla__cell__text">' + inner.login_id + '</div>\
                //                                       <div class="table-tesla__cell__text">' + inner.sis_user_id + '</div>\
                //                                     </div>\
                //                                   </div>'
                //                                     //parentEl.appendChild(childEl);
                //                                     helper.dom.getElement('id', 'courses').appendChild(childEl);
                                                    
                //                                 })(helper.dom.createElement('div'), item)
                //                             }

                //                         );
                                        
                //                     }
                                    
                //                 });

                //         }
                                
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
            
        
        //     helper.dom.setAttribute('class', 'schedule-tesla__left', helper.dom.getElement('id', 'courses'));
        //     helper.dom.appendInnerHTMLIO((my.compose(makeHeaderboxDivString, helper.reduce(helper.str.adder, ''), helper.map(makeHeaderboxChildDivStrings))(headerboxItemsCourses)), helper.dom.getElement('id', 'courses'));
        
            
        
        
        
        
        
        
        
        
        

