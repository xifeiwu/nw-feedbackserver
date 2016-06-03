var config = require("./config");
var path = require('path');
var fs = require('fs');

function route(handle, urlpath, data, response) {
  switch(urlpath){
  	case "/callapi":
  		callApi(handle, data, response);
  	break;
  	default:  	
      // response.writeHead(404, {'Content-Type': 'text/plain'});
      // response.write("Invalid Call");
      // response.end();
      localfile(urlpath, response);
  	break;
  }
  // if (typeof handle[urlpath] === 'function') {
  //   return handle[urlpath]();
  // } else {
  //   console.log("No request handler found for " + urlpath);
  //   return "404 Not found";
  // }
}
exports.route = route;

function callApi(handle, data, response){
  // console.log("data in callApi: " + data);
  // console.log("data length: " + data.length);
  if(data === null || data.length === 0 ){
    responseError(response, "post data not found.");
  }else{
    var dataObj = JSON.parse(data);
    var arr = dataObj.api.split(".");
    var api = handle[arr[0]][arr[1]];
    var args=dataObj.args;
    if(typeof api === 'function'){
      var sendresponse = function(){
        response.writeHead(200, {"Content-Type": mimeTypes["js"]});
        response.write(JSON.stringify(Array.prototype.slice.call(arguments)));
        response.end();
      }
      args.unshift(sendresponse);
      api.apply(null, args);
    }else{
      responseError(response, dataObj.api + " is not a function.");
    }
  }
}

function responseError(response, content, code){
  if(!code){
    code = 404;
  }
  var error = new Object();
  error.title = "Error";
  error.content = content;
  response.writeHead(code, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify(error));
  response.end();
}

var mimeTypes = {
     "html": "text/html",
     "jpeg": "image/jpeg",
     "jpg": "image/jpeg",
     "png": "image/png",
     "js": "application/javascript",
     "css": "text/css",
     "txt": "text/plain",
     "mp3": "audio/mpeg3",
     "ogg": "audio/mpeg",
     "svg": "image/svg+xml",
     "ico": "image/x-icon"
};
function localfile(urlpath, response){
  // console.log("localfile: " + process.cwd());
  path.exists("." + urlpath, function (exists) {
    var realPath;
    if (!exists) {
      realPath = urlpath;
    }else {
      realPath = "." + urlpath;
    }
    path.exists(realPath, function (exists) {
      if (!exists) {
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        response.write("This request URL " + realPath + " was not found on this server.");
        response.end();
      }else {
        fs.readFile(realPath, "binary", function (err, file) {
          if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.end(err.message);
          } else {
            var content_type;
            var suffix = urlpath.substring(urlpath.lastIndexOf('.') + 1).toLowerCase();
            switch(suffix){
            case 'css':
            case 'mp3':
            case 'ogg':
            case 'js':
            case 'svg':
            case 'ico':
              content_type = mimeTypes[suffix];
              break;
            default:
              content_type = 'text/html';
              break;
            }
            response.writeHead(200, {
              'Content-Type': content_type
            });
            response.write(file, "binary");
            response.end();
          }
        });
      }
    });
  });
}