var sqlite3 = require('sqlite3');
var config = require('../config')
var mydb;
function getDB(){
  if(!mydb){
    try{
      mydb = new sqlite3.Database(config.DBFILE);
    }catch(e){
      config.log("Error in module/db.js: init mydb fail.", "error");
      return;
    }
  }
  return mydb;
}

function closeDB(callback){
  if(mydb){
    mydb.close(callback);
  }else{
    callback();
  }
}

function runSQL(sql,callback){
  getDB().run(sql,function(err){
    if(err){
      console.log("runSQL '" + sql + "'. Error: " + err);
      callback(false);
    }else{
      callback(true);
    }
  });
}

function insert(cb, info){
  // console.log(infoStr);
  // info = JSON.parse(infoStr);
  title = info.title;
  content = info.content;
  name = info.name;
  email = info.email;
  phone = info.phone;
  var sql = "INSERT INTO feedback VALUES(null, '"
   + title + "', '"
   + content + "','" 
   + name + "','" 
   + email + "', " 
   + phone +")";
  runSQL(sql, function(state){
    //console.log(sql + ". state: " + state);
    cb(state);
  });
}
exports.insert = insert;
