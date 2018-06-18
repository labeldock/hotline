const fs       = require('fs');
const path     = require('path');
const express  = require('express');
//
const PROTOCOL = process.env.PROTOCOL;
const PORT     = process.env.PORT;
//
const socketIO = require('socket.io');
let serverSocket;
let serverProtocol;
//
const app = express();
const server = {
  ip4v:undefined,
  protocol:undefined,
  port:undefined
};

switch(process.env.PROTOCOL){
case "https":
  const [key, cert] = [
    fs.readFileSync(path.resolve(__dirname,'cert/key.pem')),
    fs.readFileSync(path.resolve(__dirname,'cert/cert.pem'))
  ];
    
  serverProtocol = require('https').Server({ key, cert },app);
  serverSocket   = socketIO(serverProtocol);
    
  server.protocol = "https";
  server.port     = 9991
  
  serverProtocol.listen(server.port, function(){
    console.log("HTTPS server listening on port " + server.port);
  });
  break;
case "http":
default:
  serverProtocol = require('http').Server(app);
  serverSocket   = socketIO(serverProtocol);
    
  server.protocol = "http";
  server.port     = 9999;
  
  serverProtocol.listen(server.port,function(){
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      server.ip4v = add;  
      setTimeout(()=>{
        console.log(server.protocol+"://"+server.ip4v+":"+server.port);
      },1000);
    });
  });
  break;
}

if(!serverProtocol){
  console.log("something wrent worng");
  process.exit(1);
}

var recently = [];

app.use("/",express.static(path.resolve(__dirname,'../public')));

app.get("/mount",function(req,res){
  var mountdata = {server:server,recently:recently};
  res.status(200).send("window.hotline="+JSON.stringify(mountdata));
});

var connection = serverSocket.on("connection", function(socket){
  socket.on("hot:create",function(data){
    console.log("== hotline == \n",data);
    
    recently.splice(0,0,data);
    
    if(recently.length > 10) {
      recently.splice(11,1);
    }
    
    connection.emit("hot:created",data);
  });
});

