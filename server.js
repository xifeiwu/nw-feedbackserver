var http = require("http");
var url = require("url");
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var config = require("./config");
var now= new Date();


function start(route, handle) {
  function onRequest(request, response) {
    showRequest(request);

    var pathName = request.url;
    console.log("In Server.js, Request for: " + pathName);
    request.setEncoding("utf8");

    var postData = "";
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("In Server.js, postDataChunk: '"+ postDataChunk + "'.");
    });
    request.addListener("end", function() {
      console.log("In Server.js, postData: '"+ postData + "'.");
      route(handle, pathName, postData, response);
    });
    request.on('error', function(err) {
      console.error(err.stack);
    });
  }
  var server = http.createServer(onRequest);
  server.listen(config.HTTPPORT);
  console.log("Server has started at port: " + config.HTTPPORT);
}

exports.start = start;

function showRequest(request) {
  var forbidden = [];
  var allowed = ['/'];
  var url = request.url;
  // in forbidden, or not in allowed.
  if ((forbidden.indexOf(url) !== -1) || (allowed.indexOf(url) === -1)) {
    return;
  }
  console.log('==========' + url + '==========');
  console.log(request.url);
  console.log(request.method);
  console.log(request.headers);
}
