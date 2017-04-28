var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next){
  db.Question.find().sort({
    P_date:-1
  }).limit(10).exec(function(err, data) {
    console.log(req.session.user);
    res.render('index',{data:data,user:req.session.user})
  })
});

router.get('/zuihuo',function(req,res,next){
  db.Question.find().sort({
    "reading_num":-1
  }).limit(10).exec(function(err, data) {
    res.render('index',{data:data,user:req.session.user})
  })
})

router.get('/dengdai',function(req,res,next){
  db.Question.find({adopted:false}).sort({
    P_date:1
  }).limit(10).exec(function(err, data) {
    res.render('index',{data:data,user:req.session.user})
  })
})

router.get('/tag',function(req,res,next){
  res.render('tag',{user:req.session.user})
})

router.get('/Classification',function(req,res,next){
  res.render('Classification',{user:req.session.user})
})

router.get('/personal',function(req,res,next){
  res.render('personal',{user:req.session.user})
})

router.get('/answer',function(req,res,next){
  if(req.query.id){
  db.Question.update({
    '_id':req.query.id
  },{
    $set:{
      "reading_num":parseInt(req.query.reading_num) + 1
    }
  },function(err,data){
    if(err)console.log(err);
  })
}

  res.render('answer',{user:req.session.user})
})

router.get('/problem',function(req,res,next){
  if(req.session.user){
    res.render('problem',{user:req.session.user,Q:'请输入'})
  }else{
    res.render('problem',{user:req.session.user,Q:'请先登录'})
  }
})

router.get('/register',function(req,res,next){
  res.render('register',{user:req.session.user})
})


router.post('/register',function(req,res,next){

  var user = new db.User(req.body);
  console.log(req.body);
  // console.log(user); //可能是数据库中的字段名

  bcrypt.hash(req.body.password,salt,function(err,hash){
    console.log(hash);
    user.password = hash;
    user.save(function(err){
      res.redirect('/login');
    });
  });
})

//登录验证页面
router.post('/login',function(req,res,next){
    var account = req.body.account;//前端传过来的用户名
    var password = req.body.password;//前端传过来的密码

    db.User.findOne({account:account},function(err,data){
      console.log(account);
      console.log(password);
      if (data){
        bcrypt.compare(password,data.password,function(err,hash){
                  console.log('hash:',hash);

                  if(hash){
                    console.log('req.session:',req.session);
                    // req.session.user = account;
                    req.session.user = account;
                    res.redirect('/');
                  }else{
                    req.session.messages = '密码错误,请重新输入';
                    res.redirect('/login');
                  }
          });

      }else{
          req.session.messages = '账号不存在';
          res.redirect('login');
      }
});
});

router.get('/login',function(req,res,next){
  res.render('login',{message:req.session.messages})
})
router.get('/error',function(req,res,next){
  res.render('error');
})

router.get('/aboutwe',function(req,res,next){
  res.render('aboutwe',{user:req.session.user});
});

router.get('/logout',function(req,res,next){
  req.session.user= null;
  req.session.messages = null;
  res.render('login',{message:req.session.messages})
})

module.exports = router;
