var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var Excel = require('exceljs');

var workbook = new Excel.Workbook();
workbook.removeWorksheet('Grupper');




app.post('/', function (req, res) {
  res.send('Got a POST request')
});

// app.post('/api/users', function(req, res) {
//   console.log(req.body);

//   req.body.forEach(function(item) {
//     console.log(item.name);
    
//     worksheet.addRow(
//     {
//       name: ' '
//     });
//     worksheet.addRow({
//       name: item.name
//     });
//     worksheet.lastRow.font = { size: 16, underline: 'double', bold: true };

//     item.users.forEach(function (user) {
//       console.log(user.name, ' ', user.login_id);
//       worksheet.addRow({
//         name: user.name,
//         mail: user.login_id
//       });

//     })
//   })

//   setTimeout(function() {
//     workbook.xlsx.writeFile('./streamed-workbook.xlsx');
//   }, 2000);
  
//   var ressage = "Writen Excel Workbook";

//   res.send(message;
// });

app.post('/api/users', function(req, res) {

  var promise = populateExcel(req, res);


  promise.then(function(res) {
    var message = "Writen Excel Workbook";

    workbook.xlsx.writeFile('./streamed-workbook.xlsx');
  
    res.send(message);
  });
});




function populateExcel(req, res) {
  workbook.removeWorksheet('Grupper');
  var worksheet = workbook.addWorksheet('Grupper');
  
  worksheet.getColumn(1).key = 'name';
  worksheet.getColumn(2).key = 'mail';

      return new Promise((resolve, reject) => {
          //console.log(req.body);

          for (var key in req.body) {
            console.log(key);
          }
        
          req.body.forEach(function(item) {
            console.log(item[key]);
            
            worksheet.addRow(
            {
              name: ' '
            });
            worksheet.addRow({
              name: item.name
            });
            worksheet.lastRow.font = { size: 16, underline: 'double', bold: true };
        
            item.users.forEach(function (user) {
              //console.log(user.name, ' ', user.login_id);
              worksheet.addRow({
                name: user.name,
                mail: user.login_id
              });
        
            })
          })
          resolve(res);
      });
}



app.use(express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

module.exports = app;


