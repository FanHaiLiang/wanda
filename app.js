var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
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

io.on('connection', function(socket) {
      //提问储存操作
      socket.on('pro_in', function(data) {
        console.log('____', data.content);
        var time = new Date().getTime();
        var Q_data = new db.Question({
          title: data.title, //问题题目
          content: data.content, //问题内容
          author: 'fanhailiang', //需要登录之后 修改
          P_date: time, //提问题的时间
          tag: data.tag, //问题时填写的标签
          reading_num: 0, //浏览数量
          adopted: false, //是否解决
          respondent: [], //回答人列表列表
          A_list: [], //回答列表
          be_liked_num: 0, //被点赞数
        })

        Q_data.save(function(err, data) {
          console.log(err);
        });
      })

      //主页问题显示操作
      socket.on('zuixin', function(data) {
        if (data === 'zuixin') {
          db.Question.find().sort({
            P_date:-1
          }).limit(10).exec(function(err, data) {
            socket.emit('zuixin', data);
          })
        }
      })

      socket.on('zan', function(data) {
        var num = data.obj.be_liked_num + 1;
        var biaoji = 0;
        db.Question.update({
          "_id": data.id
        }, {
          $set: {
            "be_liked_num": num
          }
        }, function(err,data) {
          if(err)console.log(err);
        });

      })

      //点击提交该问题答案
      socket.on('sub-a1', (data) => {
        console.log('qa1', data);
        socket.emit('sub-a2', 'dara');
      });
      //点击获取收藏
      socket.on('sub-collect0', (data) => {
        console.log('存入个人信息数据库collect', data);
      });
      //点击获取关注
      socket.on('sub-focus0', (da) => {
        console.log('存入个人信息数据库focus', da);
      });
      //点击获取赞
      socket.on('sub-niu', (niu) => {
        console.log("存入问题数据库niu", niu);

      })
      })
