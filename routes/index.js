var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index')
});

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
  console.log('safs');
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

module.exports = router;
