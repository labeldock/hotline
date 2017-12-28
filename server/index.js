var fs      = require('fs');
var path    = require('path');
var express = require('express');
var app     = express();
var http    = require('http');
var https   = require('https').Server({
  key:fs.readFileSync(path.resolve(__dirname,'cert/key.pem')),
  cert:fs.readFileSync(path.resolve(__dirname,'cert/cert.pem'))
},app);

var io      = require('socket.io')(https);

var server = {
  ip4v:void 0,
  protocal:"https",
  port:9991
};

var recently = [];

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  server.ip4v = add;  
  console.log(server.protocal+"://"+server.ip4v+":"+server.port);
});

//http.listen(server.port,function(){
//    console.log('Express server listening');
//});

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

https.listen(server.port, function(){  
  console.log("Https server listening on port " + server.sport);
});