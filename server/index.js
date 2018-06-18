//package
const fs       = require('fs');
const path     = require('path');
const express  = require('express');
const socketIO = require('socket.io');
//env
const PROTOCOL    = process.env.PROTOCOL;
const PORT        = process.env.PORT;
const INSTANCE_ID = process.env.INSTANCE_ID;
//model
const { Message } = require("./models");
//connection
let serverSocket;
let serverProtocol;
//application
const app = express();
//state
const server = {
  ip4v:undefined,
  protocol:undefined,
  port:undefined,
  pmid:INSTANCE_ID
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
  Message.findAll({})
  .then((recently)=>{
    //TODO : reverse not.. use onder by
    res.status(200).send("window.hotline="+JSON.stringify({server,recently:recently.map(o=>o.content).reverse()}));
  })
  .catch((e)=>{
    res.status(500).send({ error: e.message });
  });
});

var connection = serverSocket.on("connection", function(socket){
  socket.on("hot:create",function(data){
    console.log("== hotline == \n",data);
    Message.create({ content: data })
    //recently.splice(0,0,data);
    
    //if(recently.length > 10) {
    //  recently.splice(11,1);
    //}
    
    connection.emit("hot:created",data);
  });
});

