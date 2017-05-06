var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/req_ondb';
mongoose.connect(url);
var db = mongoose.connection;
db.once('open',function(){
  console.log('数据库连接成功');
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
  account:String,//账号
  nickname:String,//昵称
  password:String,//密码
  Q_list:Array,//问题列表
  Q_zan:Array,//赞的问题列表只存问题_id就行
  Q_number:{type:Number,default:0},//问题数量
  A_zan:Array,//赞的回答列表只存回答_id就行
  A_list:Array,//回答列表
  A_number:{type:Number,default:0},//回答数量
  F_list:Array,//关注列表
  be_liked_num:{type:Number,default:0},//被点赞数
  col_list:Array,//收藏列表
  be_reported:{type:Number,default:0},//被举报次数
  acticity:{type:Number,default:0},//活跃度
  reg_time: String,
  log_time: String,
  tag_list:Array,
  information:{type:Object,default:{
    age: String,
    tel: String,
    email: String,
    gender: String,
    qq: String,
    bod: String,//生日
    address: String,//家庭地址
    inofmy: String,//自我介绍
  }},
});

module.exports.User = mongoose.model('User',userSchema);

var Q_Schema = new Schema({
  title:String,//标题
  content:String,//内容
  author:String,//作者
  P_date:Number,//发表时间
  tag:Array,//标签
  reading_num:{type:Number,default:0},//浏览数量
  adopted:{type:Boolean,default:false},//是否解决
  A_number:{type:Number,default:0},
  be_liked_num:{type:Number,default:0}//被点赞数量
});

module.exports.Question = mongoose.model('Question',Q_Schema);

var A_Schema = new Schema({
  content:String,//回答内容
  date:Date,//回答日期
  respondent:String,//回答人
  adopted:{type:Boolean,default:false},//是否被采纳
  be_liked_num:Number,//被点赞数
  que_id:String,//问题id
});

module.exports.Answer = mongoose.model('Answer',A_Schema);

var Tag_Schema = new Schema({
  title:String,//标签所在分类
  tag:String,//标签名
  information:String,//标签简介
  introduction:String,
});

module.exports.Tag = mongoose.model('Tag',Tag_Schema);
