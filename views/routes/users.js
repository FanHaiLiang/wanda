var express = require('express');
var router = express.Router();
var mongoose = require('../db');

// var data= new mongoose.Req({
//   pub_date:Date.now(),
// });
//
// data.save(function(err){
//   console.log(err);
// })
router.get('/', function(req, res, next) {


  mongoose.Req.find(function(err,data){
    console.log('heheh',data);
  })

  res.send('Answer');
});

module.exports = router;
