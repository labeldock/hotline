var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var path    = require('path');
var io      = require('socket.io')(http);

var server = {
  ip4v:void 0,
  protocal:"http",
  port:9111
}


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  server.ip4v = add;  
  console.log(server.protocal+"://"+server.ip4v+":"+server.port);
});

http.listen(server.port,function(){
    console.log('Express server listening');
});

app.use("/",express.static(path.resolve(__dirname,'../public')));

app.get("/mount",function(req,res){
  var mountdata = {server:server};
  res.status(200).send("window.hotline="+JSON.stringify(mountdata));
});

var connection = io.on("connection", function(socket){
  socket.on("hot:create",function(data){
    connection.emit("hot:created",data);
  });
});