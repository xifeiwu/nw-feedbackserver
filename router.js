var config = require("./config");
var path = require('path');
var fs = require('fs');

function route(handle, pathName, data, response) {
  switch(pathName){
  	case "/callapi":
  		callApi(handle, data, response);
  	 break;
    case '/xhr':
      responseXHR(response, 'works ok.');
      break;
  	default:  	
      // response.writeHead(404, {'Content-Type': 'text/plain'});
      // response.write("Invalid Call");
      // response.end();
      if (mimeTypesReg.test(pathName) || pathName === '/') {
        loadFile(pathName, response);
      } else {
        responseError(response, pathName + ' is not found.');
      }
      break;
  }
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

function responseXHR(response, content, code) {
  if (!code) {
    code = 200;
  }
  content = content ? content : '';
  var result = {};
  result.title = 'Success';
  result.content = content;
  response.writeHead(code, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify(result));
  response.end();
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

var mimeTypesReg = /.(html|js|css|png|mp3|ogg|jpg|jpeg|svg|ico|txt)$/;
var mimeTypes = {
     "html": "text/html",
     "js": "application/javascript",
     "css": "text/css",
     "png": "image/png",
     "mp3": "audio/mpeg3",
     "ogg": "audio/mpeg",
     "jpg": "image/jpeg",
     "jpeg": "image/jpeg",
     "svg": "image/svg+xml",
     "ico": "image/x-icon",
     "txt": "text/plain",
};

function loadFile(pathName, response){
  if(pathName == "/"){
    pathName = "/index.html"
  }
  var parser = /(.*)\.([a-zA-z]+)/;
  var result = parser.exec(pathName);
  var suffix = result[2];
  var filePath = '';
  if (suffix === 'html') {
    filePath = './static/' + suffix + pathName;
  } else {
    filePath = './static' + pathName;
  }
  fs.exists(filePath, function (exists) {
    if (!exists) {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.write("This request URL " + filePath + " was not found on this server.");
      response.end();
    }else {
      fs.readFile(filePath, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, {
              'Content-Type': 'text/plain'
          });
          response.end(err.message);
        } else {
          var content_type;
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
}
