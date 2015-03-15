var http = require("http");
var url = require("url");
var sys = require('sys');
var path = require('path');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var config = require("./config");
var now= new Date();


function start(route, handle) {
  function onRequest(request, response) {
    var path = request.url;

    console.log("In Server.js, Request for: " + path);
    request.setEncoding("utf8");

    var postData = "";
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("In Server.js, postDataChunk: '"+ postDataChunk + "'.");
    });
    request.addListener("end", function() {
      console.log("In Server.js, postData: '"+ postData + "'.");
      route(handle, path, postData, response);
    });
  }
  var server = http.createServer(onRequest);
  server.listen(config.HTTPPORT);
  console.log("Server has started at port: " + config.HTTPPORT);
}

exports.start = start;


    // console.log("=========================================");
    // var path = decodeURIComponent(url.parse(request.url).path);
    // console.log(request);
    // console.log(url.parse(request.url));
    // console.log(request.url);
    // console.log(request.headers.host);