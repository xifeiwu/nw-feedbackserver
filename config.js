var util = require('util');
var os = require('os');
var path = require("path");

var HOME = process.env["HOME"];

var DBPATH = "db.sqlite3";
exports.DBPATH = DBPATH;

var HTTPPORT = 8088;
exports.HTTPPORT = HTTPPORT;

var log = function(string, type){
  if(!type){
    type="log";
  }
  switch(type){
    case "error":
      console.log(string);
    break;
    case "warn":
      console.log(string);
    break;
    case "log":
      console.log(string);
    break;
  }
}
exports.log = log;

var TOPPATH = __dirname;
//path.resolve();
exports.TOPPATH = TOPPATH;

var DBFILE = path.join(TOPPATH, "module/db.sqlite3");
exports.DBFILE = DBFILE;
// console.log("DBFILE: " + DBFILE);
