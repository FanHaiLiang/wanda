var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/req_ondb';
mongoose.Promise = global.Promise;

mongoose.connect(url);
var db = mongoose.connection;
  db.once('open',function(){
    console.log('db connect ok.');
  });
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    name:String,
    nice:String,
    passwd:String,
    gender:String,
    bod:{type:Date,defaule:1990-01-01},
    job:String,
    by_thumbUp:String,
    reqList:Object,
    onList:Object,
    focusList:Object,
    collList:Object,
    byReport:String,
  });
  module.exports.User = mongoose.model('User',userSchema);

  var req = new Schema({
    title:String,
    content:String,
    author:String,
    pub_date:{type:Date,defaule:Date.now()},
    label:String,
    bro_num:Number,
    on_nul:Number,
    get_num:Number,
    solve_state:Boolean,
    last_respeple:Object,
    res_pople:String,
  });
  module.exports.Req = mongoose.model('Req',req);

  var ans = new Schema({
    content:String,
    date:{type:Date,defaule:Date.now()},
    reqpeople:String,
    adopt:{type:Boolean,defaule:'flase'},
    thumbUpNum:Number,
    req_id:String,
  });
  module.exports.Ans = mongoose.model('Ans',ans);
