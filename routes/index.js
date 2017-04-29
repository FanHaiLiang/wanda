var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  //如果你是在问题界面跳转过来的将进行一次保存
  if (req.session.pro == 'pro' && req.query.title !== undefined) {
    var time = new Date().getTime();
    var Q_data = new db.Question({
      title: req.query.title, //问题题目
      content: req.query.content, //问题内容
      author: req.session.user, //需要登录之后 修改
      P_date: time, //提问题的时间
      tag: req.query.tag, //问题时填写的标签
      respondent: [], //回答人列表列表
      A_list: [], //回答列表
      be_liked_num: 0, //被点赞数
    })

    //将问题存入数据库
    Q_data.save(function(err, data) {
      req.session.pro = 'no';
      db.Question.find().sort({
        P_date: -1
      }).limit(11).exec(function(err, data) {
        res.render('index', {
          data: data,
          user: req.session.user
        });
      });
    });

    //更新用户列表中的Q_list问题列表
    // console.log('+++++',req.session.user);
    db.User.update({
      account: req.session.user //req.query.value是问题id
    }, {
      $push: { Q_list:{
        author: req.session.user,//问题作者
        title:req.query.title//问题题目
      }
    }
  }, function(err, data) {
    if (err) console.log(err);
  })

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

//查找处浏览量最多的11个问题
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

//查找处11个浏览量最多而且没有解决的问题
router.get('/dengdai', function(req, res, next) {
  db.Question.find({
    adopted: false
  }).sort({
    'reading_num': -1
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
  req.session.Q_id = req.query.value//问题id
  req.session.Q_time = req.query.time//问题时间
  db.Question.update({
    _id: req.query.value //req.query.value是问题id
  }, {
    $set: {
      "reading_num": parseInt(req.query.reading_num) + 1
    }
  }, function(err, data) {
    if (err) console.log(err);
  });

  db.Question.findOne({'_id': req.query.value}, function(err, data) {
    db.Answer.find({que_id: req.query.value}).sort({date:-1}).limit(5).exec(function(err, data1) {
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
    var A_data = db.Answer({
      content:req.body.content,
      date:Date.now(),
      respondent:req.session.user,
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
        //更新用户数据库中的回答列表
        db.User.update({
          account: req.session.user //req.query.value是问题id
        }, {
          $push: { A_list:{
            q_author:data.author,//问题作者
            q_title:data.title//问题题目
          }
        }
      }, function(err, data) {
        if (err) console.log(err);
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

  var user = new db.User({
    account:req.body.account,
    nickname:req.body.nickname,
    password:req.body.password,
    Q_list:[],
    A_list:[],
    F_list:[],
    col_list:[],
    be_liked_num:0,
    be_reported:0,
    acticity:0,
    information:{
      age:req.body.age,
      tel:req.body.tel,
      email:req.body.email,
      gender:req.body.gender
    }
  });
  console.log(req.body);
  // console.log(user); //可能是数据库中的字段名

  bcrypt.hash(req.body.password, salt, function(err, hash) {
    console.log(hash);
    user.password = hash;
    user.save(function(err) {
      console.log(err);
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

router.get('/panduan',function(req,res,next){
  console.log('+++',req.query.Aid);
  console.log('+++',req.query.Qid);
  console.log('+++',req.query.name);
  if(req.query.name == 'caina'){
    db.Question.update({_id:req.query.Qid},{$set:{'adopted':true}},function(err,data){
      console.log(err);
      console.log(data);
  });

    db.Answer.update({_id:req.query.Aid},{$set:{'adopted':true}},function(err,data){
      console.log(err);
      console.log(data);
  });
}


})

module.exports = router;
