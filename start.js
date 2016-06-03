var config = require("./config");
var server = require("./server");
var router = require("./router");

var handle = {};
handle["db"] = require("./module/db");

function startServer(){
  server.start(router.route, handle);
};
exports.startServer = startServer;

startServer();
