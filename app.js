var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db');

var index = require('./routes/index');
var users = require('./routes/users');


var session = require('express-session');

app.use(
  session({
    resave:true,
    saveUninitialized:false,
    secret:'secret',
    cookie:{
      maxAge:1000*60*30
    }
  })
)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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

http.listen(3000, function() {
  console.log('3000');
})

// io.on('connection', function(socket) {
//       //点击提交该问题答案
//       socket.on('sub-a1', (data) => {
//         console.log('qa1', data);
//         socket.emit('sub-a2', 'dara');
//       });
//       //点击获取收藏
//       socket.on('sub-collect0', (data) => {
//         console.log('存入个人信息数据库collect', data);
//       });
//       //点击获取关注
//       socket.on('sub-focus0', (da) => {
//         console.log('存入个人信息数据库focus', da);
//       });
//       //点击获取赞
//       socket.on('sub-niu', (niu) => {
//         console.log("存入问题数据库niu", niu);
//
//       })
//       })
