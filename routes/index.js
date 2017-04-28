var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next){
  db.Question.find().sort({
    P_date:-1
  }).limit(10).exec(function(err, data) {
    res.render('index',{data:data})
  })

});

router.get('/zuihuo',function(req,res,next){
  db.Question.find().sort({
    "reading_num":-1
  }).limit(10).exec(function(err, data) {
    res.render('index',{data:data})
  })
})

router.get('/dengdai',function(req,res,next){
  db.Question.find({adopted:false}).sort({
    P_date:1
  }).limit(10).exec(function(err, data) {
    res.render('index',{data:data})
  })
})

router.get('/tag',function(req,res,next){
  res.render('tag')
})

router.get('/Classification',function(req,res,next){
  res.render('Classification')
})

router.get('/personal',function(req,res,next){
  res.render('personal')
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

  res.render('answer')
})

router.get('/problem',function(req,res,next){
  res.render('problem')
})

router.get('/register',function(req,res,next){
  res.render('register')
})

router.get('/login',function(req,res,next){
  res.render('login')
})

router.get('/error',function(req,res,next){
  res.render('error');
})

router.get('/aboutwe',function(req,res,next){
  res.render('aboutwe');
})

module.exports = router;
