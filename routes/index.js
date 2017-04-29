var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.pro == 'pro' && req.query.title !== undefined) {
    var time = new Date().getTime();
    var Q_data = new db.Question({
      title: req.query.title, //问题题目
      content: req.query.content, //问题内容
      author: req.session.user, //需要登录之后 修改
      P_date: time, //提问题的时间
      tag: req.query.tag, //问题时填写的标签
      reading_num: 0, //浏览数量
      adopted: false, //是否解决
      respondent: [], //回答人列表列表
      A_list: [], //回答列表
      be_liked_num: 0, //被点赞数
    })
    Q_data.save(function(err, data) {
      req.session.pro = 'no';
      db.Question.find().sort({
        P_date: -1
      }).limit(11).exec(function(err, data) {
        res.render('index', {
          data: data,
          user: req.session.user
        })
      })
    });
  } else {
    db.Question.find().sort({
      P_date: -1
    }).limit(11).exec(function(err, data) {
      res.render('index', {
        data: data,
        user: req.session.user
      })
    })
  }
});

router.get('/zuihuo', function(req, res, next) {
  db.Question.find().sort({
    "reading_num": -1
  }).limit(11).exec(function(err, data) {
    res.render('index', {
      data: data,
      user: req.session.user
    })
  })
})

router.get('/dengdai', function(req, res, next) {
  db.Question.find({
    adopted: false
  }).sort({
    P_date: 1
  }).limit(11).exec(function(err, data) {
    res.render('index', {
      data: data,
      user: req.session.user
    })
  })
})

router.get('/tag', function(req, res, next) {
  res.render('tag', {
    user: req.session.user
  })
})

router.get('/Classification', function(req, res, next) {
  res.render('Classification', {
    user: req.session.user
  })
})

router.get('/personal', function(req, res, next) {
  res.render('personal', {
    user: req.session.user
  })
})

router.get('/answer', function(req, res, next) {
  req.session.Q_id = req.query.value
  req.session.Q_time = req.query.time
  db.Question.update({
    _id: req.query.value //req.query.value是问题id
  }, {
    $set: {
      "reading_num": parseInt(req.query.reading_num) + 1
    }
  }, function(err, data) {
    if (err) console.log(err);
  })

  db.Question.findOne({
    '_id': req.query.value
  }, function(err, data) {
    db.Answer.find({
      que_id: req.query.value
    }, function(err, data1) {
      res.render('answer', {
        user: req.session.user,
        data: data,
        time: req.query.time,
        data1: data1
      });
    });
  });
});

router.post('/answer', function(req, res, next) {
  if(req.session.user){
    // console.log("+++++++",req.body.content);
    // console.log('______',Date.now());
    // console.log('------',req.session.user);
    // console.log(req.session.Q_id);
    var A_data = db.Answer({
      content:req.body.content,
      date:Date.now(),
      respondent:req.session.user,
      adopted:false,
      be_liked_num:0,
      que_id:req.session.Q_id
    })

    A_data.save(function(err,data){
      db.Question.findOne({'_id': req.session.Q_id}, function(err, data) {
        db.Answer.find({que_id: req.session.Q_id}, function(err, data1) {
          console.log('++++++',data1);
          res.render('answer', {
            user: req.session.user,
            data: data,
            time: req.session.Q_time,
            data1:data1
          });
        });
      });
    })

  }else{
    res.render('login', {
      message: req.session.messages
    })
  }
});

router.get('/problem', function(req, res, next) {
  req.session.pro = 'pro';
  if (req.session.user) {
    res.render('problem', {
      user: req.session.user
    })
  } else {
    res.render('login', {
      message: req.session.messages
    })
  }
})

router.get('/register', function(req, res, next) {
  res.render('register', {
    user: req.session.user
  })
})


router.post('/register', function(req, res, next) {

  var user = new db.User(req.body);
  console.log(req.body);
  // console.log(user); //可能是数据库中的字段名

  bcrypt.hash(req.body.password, salt, function(err, hash) {
    console.log(hash);
    user.password = hash;
    user.save(function(err) {
      res.redirect('/login');
    });
  });
})

//登录验证页面
router.post('/login', function(req, res, next) {
  var account = req.body.account; //前端传过来的用户名
  var password = req.body.password; //前端传过来的密码

  db.User.findOne({
    account: account
  }, function(err, data) {
    console.log(account);
    console.log(password);
    if (data) {
      bcrypt.compare(password, data.password, function(err, hash) {
        console.log('hash:', hash);

        if (hash) {
          console.log('req.session:', req.session);
          // req.session.user = account;
          req.session.user = account;
          res.redirect('/');
        } else {
          req.session.messages = '密码错误,请重新输入';
          res.redirect('/login');
        }
      });

    } else {
      req.session.messages = '账号不存在';
      res.redirect('login');
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    message: req.session.messages
  })
})
router.get('/error', function(req, res, next) {
  res.render('error');
})

router.get('/aboutwe', function(req, res, next) {
  res.render('aboutwe', {
    user: req.session.user
  });
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.messages = null;
  res.render('login', {
    message: req.session.messages
  })
})

module.exports = router;
