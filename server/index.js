var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var path    = require('path');
var io      = require('socket.io')(http);

var server = {
  ip4v:void 0,
  protocal:"http",
  port:9111
};

var recently = [];


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  server.ip4v = add;  
  console.log(server.protocal+"://"+server.ip4v+":"+server.port);
});

http.listen(server.port,function(){
    console.log('Express server listening');
});

app.use("/",express.static(path.resolve(__dirname,'../public')));

app.get("/mount",function(req,res){
  var mountdata = {server:server,recently:recently};
  res.status(200).send("window.hotline="+JSON.stringify(mountdata));
});

var connection = io.on("connection", function(socket){
  socket.on("hot:create",function(data){
    console.log("== hot:created == \n",data);
    recently.splice(0,0,data);
    
    if(recently.length > 10) {
      recently.splice(11,1);
    }
    
    connection.emit("hot:created",data);
  });
});