var express = require('express');
var async = require('async');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
const salt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  //如果你是在问题界面跳转过来的将进行一次保存
  if (req.session.pro == 'pro' && req.query.title !== undefined) {
    var time = new Date().getTime();
    var tag_list = req.query.tag.split(';');
    var Q_data = new db.Question({
      title: req.query.title, //问题题目
      content: req.query.content, //问题内容
      author: req.session.user, //需要登录之后 修改
      P_date: time, //提问题的时间
      tag: tag_list, //问题时填写的标签
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

        //更新用户列表中的Q_list问题列表
        db.User.update({
          account: req.session.user //req.query.value是问题id
        }, {
          $push: {
            Q_list: {
              Qid: data[0]._id,
              author: req.session.user, //问题作者
              title: data[0].title //问题题目
            }
          }
        }, function(err, data) {
          if (err) console.log(err);
        })
        //更新用户集合中的Q_number问题数量字段
        db.User.findOne({account:req.session.user},function(err,data){
          // data.Q_number = data.Q_number + 1;
          data.Q_number++
          data.save();
        })

      });
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
  console.log(req.query.tag_value);
  db.Tag.findOne({'_id':req.query.tag_value},function(err,data){
    db.Tag.find({title:data.title},function(err,data1){
      res.render('tag', {user: req.session.user,data:data,data1:data1})
    })
  })
})

var ios;
var kaifayuyan;
var qianduan;
var JavaScript;
var Android;
var PHP;
var shujuku;
var NET;
var Ruby;
var kaifagongju;
var yunjisuan;
var JAVA;
var kaifangpingtai;
var sousuo;
var fuwuqi;
var Python;
router.get('/Classification', function(req, res, next) {
  console.log('asdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  async.parallel({
    one:function(callback){
      db.Tag.find({title:'ios开发'},function(err,data){
        ios = data;
      })
    },
    two:function(callback){
      db.Tag.find({title:'开发语言'},function(err,data){
        kaifayuyan = data;
      })
    },
    three:function(callback){
      db.Tag.find({title:'前端开发'},function(err,data){
      qianduan = data;
      })
    },
    four:function(callback){
      db.Tag.find({title:'JavaScript开发'},function(err,data){
        JavaScript = data;
      })
    },
    five:function(callback){
      db.Tag.find({title:'Android开发'},function(err,data){
        Android = data;
      })
    },
    six:function(callback){
      db.Tag.find({title:'PHP 开发'},function(err,data){
        PHP = data;
      })
    },
    seven:function(callback){
      db.Tag.find({title:'数据库'},function(err,data){
        shujuku = data;
      })
    },
    eight:function(callback){
      db.Tag.find({title:'.NET开发'},function(err,data){
        NET = data;
      })
    },
    nine:function(callback){
      db.Tag.find({title:'Ruby 开发'},function(err,data){
        Ruby = data;
      })
    },
    ten:function(callback){
      db.Tag.find({title:'开发工具'},function(err,data){
        kaifagongju = data;
      })
    },
    eleven:function(callback){
      db.Tag.find({title:'云计算'},function(err,data){
        yunjisuan = data;
      })
    },
    twelve:function(callback){
      db.Tag.find({title:'JAVA 开发'},function(err,data){
        JAVA = data;
      })
    },
    thirteen:function(callback){
      db.Tag.find({title:'搜索'},function(err,data){
        sousuo = data;
      })
    },
    fourteen:function(callback){
      db.Tag.find({title:'开放平台'},function(err,data){
        kaifangpingtai = data;
      })
    },
    fifteen:function(callback){
      db.Tag.find({title:'服务器'},function(err,data){
        fuwuqi = data;
      })
    },function(){
      res.render('Classification', {user: req.session.user,ios:ios,sousuo:sousuo,
        fuwuqi:fuwuqi,kaifangpingtai:kaifangpingtai,JAVA:JAVA,
        yunjisuan:yunjisuan,kaifagongju:kaifagongju,Ruby:Ruby,NET:NET,
        shujuku:shujuku,PHP:PHP,Android:Android,JavaScript:JavaScript,qianduan:qianduan,kaifayuyan:kaifayuyan});
    }

})
  //
  // db.Tag.find({title:'开发语言'},function(err,data){
  //   kaifayuyan = data;
  // })
  // db.Tag.find({title:'前端开发'},function(err,data){
  //   qianduan = data;
  // })
  // db.Tag.find({title:'JavaScript开发'},function(err,data){
  //   JavaScript = data;
  // })
  // db.Tag.find({title:'Android开发'},function(err,data){
  //   Android = data;
  // })
  // db.Tag.find({title:'PHP 开发'},function(err,data){
  //   PHP = data;
  // })
  // db.Tag.find({title:'数据库'},function(err,data){
  //   shujuku = data;
  // })
  // db.Tag.find({title:'.NET开发'},function(err,data){
  //   NET = data;
  // })
  // db.Tag.find({title:'Ruby 开发'},function(err,data){
  //   Ruby = data;
  // })
  // db.Tag.find({title:'开发工具'},function(err,data){
  //   kaifagongju = data;
  // })
  // db.Tag.find({title:'云计算'},function(err,data){
  //   yunjisuan = data;
  // })
  //
  // // db.Tag.find({title:'Python开发'},function(err,data){//查不到
  // //   Python = data;
  // //   console.log(Python);
  // // })
  //
  // db.Tag.find({title:'JAVA 开发'},function(err,data){
  //   JAVA = data;
  // })
  // db.Tag.find({title:'开放平台'},function(err,data){
  //   kaifangpingtai = data;
  // })
  // db.Tag.find({title:'服务器'},function(err,data){
  //   fuwuqi = data;
  // })
  // db.Tag.find({title:'搜索'},function(err,data){
  //   sousuo = data;
  // })

  // res.render('Classification', {user: req.session.user,ios:ios,sousuo:sousuo,
  //   fuwuqi:fuwuqi,kaifangpingtai:kaifangpingtai,JAVA:JAVA,
  //   yunjisuan:yunjisuan,kaifagongju:kaifagongju,Ruby:Ruby,NET:NET,
  //   shujuku:shujuku,PHP:PHP,Android:Android,JavaScript:JavaScript,qianduan:qianduan,kaifayuyan:kaifayuyan});
})

//自我简介
router.get('/personal', function(req, res, next) {
  db.User.findOne({account:req.query.u_name},function(err,data){
    res.render('personal', {user: req.session.user,data:data})
  })
})

router.post('/personal',function(req,res,next){
  console.log(req.body);
  db.User.update({account:req.session.user},{$set:{information:req.body}},function(err,data){
    if(err)console.log(err);
    // console.log(data);
    db.User.findOne({account:req.session.user},function(err,data1){
      res.render('personal',{user:req.session.user,data:data1})
    })
  })
})

var guanzhu;//定义关注全局变量
var col;//定义收藏全局变量
var A_number1;//定义用户回答数量全局变量
var Q_number;//定义用户提问数量全局变量
var Q_zan;//定义问题是否已经点赞

router.get('/answer', function(req, res, next) {

  //进入一次回答界面就重新刷新一次A_number
  db.User.find({}).sort({
    'A_number': -1
  }).limit(5).exec(function(err, data) {
    // console.log('++++',data);
    A_number1 = data;
  })
  //刷新Q_number
  db.User.find({}).sort({
    'Q_number': -1
  }).limit(5).exec(function(err, data) {
    // console.log('++++++',data.Q_number);
    Q_number = data;
  })

  req.session.Q_id = req.query.value //问题id
  req.session.Q_time = req.query.time //问题时间

  if(req.query.reading_num){
    db.Question.update({
      _id: req.query.value //req.query.value是问题id
    }, {
      $set: {
        "reading_num": parseInt(req.query.reading_num) + 1
      }
    }, function(err, data) {
      if (err) console.log(err);
    });
  }

  db.Question.findOne({
    '_id': req.query.value
  }, function(err, data) {
    db.Answer.find({
      que_id: req.query.value
    }).sort({
      date: 1
    }).exec(function(err, data1) {
      db.User.findOne({
        account: req.session.user
      }, function(err, data2) {

        if (data2) {
          data2.col_list.forEach(function(foin) {
            if (foin.q_id == req.query.value) {
              col = 'yes'
            } else {
              col = 'no'
            }
          })

          if(data2.col_list == 0){
            col = 'no'
          }

          data2.F_list.forEach(function(foin) {
            if (foin.q_author == data.author) {
               guanzhu = 'yes'
            } else {
               guanzhu= 'no'
            }
          })

          if(data2.F_list.length == 0){
            guanzhu = 'no'
          }

          data2.Q_zan.forEach(function(foin){
            if(foin.Qid == data._id){
              Q_zan = 'yes'
            } else{
              Q_zan = 'no'
            }
          })

          if(data2.Q_zan.length == 0){
            Q_zan = 'no'
          }

          res.render('answer', {
            user: req.session.user,
            time: req.query.time,
            data: data,//问题数据
            data1: data1,//答案数据
            data2: data2,//用户数据
            User_col: col, //用户是否收藏了该问题
            User_F: guanzhu, //用户是否关注了该问题
            A_number1:A_number1,
            Q_number1:Q_number,
            Q_zan:Q_zan,
          });
          // 清空下变量
          // col = 'no';
          // guanzhu = 'no';
          // Q_zan = 'no';
        } else {

          res.render('answer', {
            user: req.session.user,
            time: req.query.time,
            data: data,
            data1: data1,
            User_col: 'no',
            User_F: 'no',
            data2:data2,
            A_number1:A_number1,
            Q_number1:Q_number,
            Q_zan:Q_zan,
          })
          // 清空下变量
          // col = 'no';
          // guanzhu = 'no';
          // Q_zan = 'no';
        }
      })
    });
  });

});

router.get('/sort_time',function(req,res,next){

  //进入一次回答界面就重新刷新一次A_number1
  db.User.find({}).sort({
    'A_number': -1
  }).limit(5).exec(function(err, data) {
    console.log(data);
    A_number1 = data;
  })

  //更新Q_number
  db.User.find({}).sort({'Q_number':-1}).limit(5).exec(function(err,data){
    Q_number = data;
  })

  db.Question.findOne({
    '_id': req.session.Q_id
  }, function(err, data) {
    db.Answer.find({
      que_id: req.session.Q_id
    }).sort({
      date: -1
    }).limit(5).exec(function(err, data1) {
      db.User.findOne({
        account: req.session.user
      }, function(err, data2) {
        if (data2) {
          data2.col_list.forEach(function(foin) {
            if (foin.q_id == req.session.Q_id) {
              col = 'yes'
            } else {
              col = 'no'
            }

          })

          if(data2.col_list.length == 0){
            col = 'no'
          }

          data2.F_list.forEach(function(foin) {
            if (foin.q_author == data.author) {
               guanzhu = 'yes'
            } else {
               guanzhu= 'no'
            }
          })

          if(data2.F_list.length == 0){
            guanzhu = 'no'
          }

          data2.Q_zan.forEach(function(foin){
            if(foin.Qid == data._id){
              Q_zan = 'yes'
            } else{
              Q_zan = 'no'
            }
          })

          if(data2.Q_zan.length == 0){
            Q_zan = 'no'
          }

          res.render('answer', {
            user: req.session.user,
            time: req.session.Q_time,
            data: data,
            data1: data1,
            data2: data2,
            User_col: col, //用户是否收藏了该问题
            User_F: guanzhu, //用户是否关注了该问题
            A_number1:A_number1,
            Q_number1:Q_number,
            Q_zan:Q_zan,
          });
        } else {
          res.render('answer', {
            user: req.session.user,
            time: req.session.Q_time,
            data: data,
            data1: data1,
            data2, data2,
            User_col: 'no',
            User_F: 'no',
            Q_zan:Q_zan,
            A_number1:A_number1,
            Q_number1:Q_number
          })
        }
      })
    });
  });
})

//回答问题后走的路由
router.post('/answer', function(req, res, next) {

  //进入一次回答界面就重新刷新一次A_number1
  db.User.find({}).sort({
    'A_number': -1
  }).limit(5).exec(function(err, data) {
    A_number1 = data;
  })

  //更新Q_number
  db.User.find({}).sort({'Q_number':-1}).limit(5).exec(function(err,data){
    Q_number = data;
  })

  if (req.session.user) {
    var A_data = db.Answer({
      content: req.body.content,
      date: Date.now(),
      respondent: req.session.user,
      be_liked_num: 0,
      que_id: req.session.Q_id
    })

    A_data.save(function(err, data0) {
      db.Question.findOne({//问题集合
        '_id': req.session.Q_id
      }, function(err, data) {
        db.Answer.find({//所有回答的集合
          que_id: req.session.Q_id
        }, function(err, data1) {
          db.User.findOne({account:req.session.user},function(err,data2){//在线用户集合
          res.render('answer', {
            user: req.session.user,
            data: data,
            time: req.session.Q_time,
            data1: data1,
            data2: data2,
            User_col:col,
            User_F:guanzhu,
            Q_zan:Q_zan,
            Q_number1:Q_number,
            A_number1:A_number1
          });

          //更新用户列表中回答问题的数量 A_number
          data2.A_number++;
          data2.save();

          //更新问题列表中A_number的 某个问题有几个回答
          data.A_number++;
          data.save();

          //更新用户数据库中的回答列表
          var jiluA_list = 0;//用来判断回答列表中问题是否已经存在
          data2.A_list.forEach(function(foin){
            if(foin.q_id == req.session.Q_id){
              jiluA_list = 1;
            }
          })

          if(jiluA_list == 0){
            data2.A_list.push({
              q_id: req.session.Q_id,
              q_author: data.author, //问题作者
              q_title: data.title //问题题目
            })
            data2.save();
            jiluA_list = 0;
          }

        })
        });

      });
    })
  } else {
    res.render('login', {
      message: req.session.messages
    })
  }
});

router.get('/problem', function(req, res, next) {
  if (req.session.user) {
    req.session.pro = 'pro';
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
  res.render('register', {user: req.session.user,jiance:'yes'})
})


router.post('/register', function(req, res, next) {
  db.User.findOne({account:req.query.account},function(err,data){
    if(data !== null){
      res.render('register',{user: req.session.user,jiance:'no'})
    }else{
      var date = new Date();
      Y = date.getFullYear() + '-';
      M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      var time = Y+M+D+h+m+s
      var tag = req.body.tag.split(';');
      var user = new db.User({
        account: req.body.account,
        password: req.body.password,
        Q_list: [],
        A_list: [],
        F_list: [],
        col_list: [],
        tag_list:tag,
        A_zan:[{Aid:null}],
        be_liked_num: 0,
        be_reported: 0,
        acticity: 0,
        reg_time:time,
        log_time:time,
        information: {
          age: null || req.query.age,
          tel: null || req.body.tel,
          email: null || req.body.email,
          gender: null || req.body.gender,
          qq:null || req.body.qq,
          bod:'',//生日
          address:'',//家庭地址
          inofmy:'很懒，什么都没留下',//自我介绍
        }
      });
      // console.log(user); //可能是数据库中的字段名

      bcrypt.hash(req.body.password, salt, function(err, hash) {
        // console.log(hash);
        user.password = hash;
        user.save(function(err) {
          // console.log(err);
          res.redirect('/login');
        });
      });
    }
  })

})

//登录验证页面
router.post('/login', function(req, res, next) {
  var account = req.body.account; //前端传过来的用户名
  var password = req.body.password; //前端传过来的密码

  db.User.findOne({
    account: account
  }, function(err, data) {
    // console.log(account);
    // console.log(password);
    if (data) {
      bcrypt.compare(password, data.password, function(err, hash) {
        // console.log('hash:', hash);

        var date = new Date();
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        var time1 = Y+M+D+h+m+s

        if (hash) {

          // console.log('req.session:', req.session);
          // req.session.user = account;
          req.session.user = account;
          res.redirect('/');
          data.log_time = time1;
          data.save();
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

router.get('/jiance',function(req,res,next){
    db.User.findOne({account:req.query.account},function(err,data){
      console.log(data);
      if(data !== null){//data不等于null表示 账号存在
        res.json('no')
      }else{
        res.json('ok')
      }
    })
  })

router.get('/panduan', function(req, res, next) {

  if(req.session.user != undefined){

  if (req.query.name == 'caina') {
    db.Question.update({
      _id: req.query.Qid
    }, {
      $set: {
        'adopted': true
      }
    }, function(err, data) {
      if(err)console.log(err);
    });

    db.Answer.update({
      _id: req.query.Aid
    }, {
      $set: {
        'adopted': true
      }
    }, function(err, data) {
      if(err)console.log(err);
    });
  } else if (req.query.name == 'col') {
    // console.log(req.session.user);
      db.User.update({
        account: req.session.user
      }, {
        $push: {
          col_list: {
            q_id: req.query.Qid,
            q_author: req.query.Qauthor, //问题作者
            q_title: req.query.Qtitle //问题题目
          }
        }
      }, function(err, data) {
        if (err) console.log(err);
        res.json('ok')
      });
  } else if (req.query.name == 'guanzhu') {
      db.User.update({
        account: req.session.user
      }, {
        $push: {
          F_list: {
            q_author: req.query.Qauthor
          }
        }
      }, function(err, data) {
        if (err) console.log(err);
        res.json('ok')
      })
  }else if(req.query.name == 'A_zan'){
    //更新用户集合中点过赞的回答id
    db.User.update({account:req.session.user
    },{
        $push:{
        A_zan:{
          Aid:req.query.Aid
        }
      }
    },function(err,data){
        if(err)console.log(err);
        res.json('ok')
    });
    //更新回答集合中被点赞的个数be_liked_num
    db.Answer.findOne({_id:req.query.Aid},function(err,data){
      data.be_liked_num++;
      data.save();
    })
  }else if(req.query.name == 'Q_zan'){

    db.User.findOne({account:req.session.user},function(err,data){
      data.Q_zan.push({Qid:req.query.Qid});
      data.save();
    });

    db.Question.findOne({_id:req.query.Qid},function(err,data){
      data.be_liked_num++;
      data.save();
      if(err)console.log(err);
      res.json('ok');
    })
  }
}else{
  console.log('------------',req.session.user);
  res.json('no')
}
});

module.exports = router;
