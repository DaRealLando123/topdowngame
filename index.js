var express = require('express'); //server creation
var app = express();//server creation
var server = app.listen(3000); //port to listen for
app.use(express.static('client')); //what folder to send to client

var playerlist = [];
console.log("server running"); //when server successfully runs

var socket = require('socket.io');
var io = socket(server);

setInterval(spawning, 500);
setInterval(enemyFunction, 20);
//setInterval(dayCycle, 1000);

var spawnOffsets = [0];
var dayTime = 0;
var enemyArray = [];
var chatLog = ["-Start of Log-"];
//var projectiles = [,["fireball",x,y,z,r,rt,power],["arrow",x,y,z,r,rt,power],]

//Early idea on how save files will be implemented
//var playerSaveData = [,[[lastinn,hp,maxhp,mp,maxmp,maxstamina,combatlv,combatxp,combatxpneeded,playerlevel],"DaRealLando123","testPassword"],[[0,0,0,0,0],"TestAccount2","passwordTest"],];

io.sockets.on('connection', newConnection); //when a player connects

//no ^

function newConnection(socket){

  console.log(socket.handshake.address); //ip lol

  socket.on('packet', gotPacket);

  socket.on('chatMessage', gotChatMessage);

  function gotChatMessage(msg){
    socket.broadcast.emit('chatMessage', msg);
    chatLog.push("<"+msg.u+"> "+msg.m);
    if(chatLog.length > 50){
    chatLog.shift();
    }
    console.log(chatLog);
    console.log(chatLog.length);
  }
  
  function gotPacket(data){
    
    var inArray = false;
    for(i = 0; i < playerlist.length; i++){
      if(playerlist[i].pid === data.pid){
        inArray = true;
        playerlist[i] = data;
      }
    }
    if(inArray === false){
      playerlist.push(data);
      console.log(playerlist);
    }
    socket.broadcast.emit('packet', data);
  }
}

function spawning(){

  if(spawnOffsets[0] === 0){

    //spawn first enemy

    enemyArray.push(new Enemy(0,100,-700,10,25,10000,0,0,0,10,1,0.2,100,100,100,-10000,10000,-10000,10000,-10000,10000));

  }

  for(var i = 0 ; i < spawnOffsets.length ; i++){

    spawnOffsets[i] += 1;

  }

}


class Enemy{ // ENEMY //

  constructor(xPos,yPos,zPos,size,height,detectRadius,meleeRadius,xpDrop,coinDrop,health,damage,speed,r,g,b,minXB,maxXB,minYB,maxYB,minZB,maxZB){
    this.x = xPos;
    this.y = yPos;
    this.z = zPos;
    this.size = size;
    this.height = height;
    this.detectRadius = detectRadius;
    this.meleeRadius = meleeRadius;
    this.xpDrop = xpDrop;
    this.coinDrop = coinDrop;
    this.health = health;
    this.damage = damage;
    this.speed = speed;
    this.r = r;
    this.g = g;
    this.b = b;
    this.minXB = minXB;
    this.maxXB = maxXB;
    this.minYB = minYB;
    this.maxYB = maxYB;
    this.minZB = minZB;
    this.maxZB = maxZB;
  }

  move(){

    let closestPlayer = [null,null,null,null];

    for(i = 0 ; i < playerlist.length; i++){

      if(playerlist[i].x >= this.minXB && playerlist[i].x <= this.maxXB && playerlist[i].y >= this.minYB && playerlist[i].y <= this.maxYB && playerlist[i].z >= this.minZB && playerlist[i].z <= this.maxZB){
        if(dist(this.x, this.y, this.z, playerlist[i].x, playerlist[i].y, playerlist[i].z) < dist(this.x, this.y, this.z, closestPlayer[0], closestPlayer[1], closestPlayer[2]) || closestPlayer[0] === null){
          closestPlayer[0] = playerlist[i].x;
          closestPlayer[1] = playerlist[i].y;
          closestPlayer[2] = playerlist[i].z;
          closestPlayer[3] = playerlist[i].id;
          //console.log(this.z + " 1");
        }
      }

    }

    let distance = dist(this.x, this.y, this.z, closestPlayer[0], closestPlayer[1], closestPlayer[2]);

    if(closestPlayer[3] != null && distance > this.speed){
      if(closestPlayer[0] - this.x != 0){
        this.x += (((closestPlayer[0] - this.x) / distance) * this.speed);
      }
      if(closestPlayer[1] - this.y != 0){
        this.y += (((closestPlayer[1] - this.y) / distance) * this.speed);
      }
      if(closestPlayer[2] - this.z != 0){
        this.z += (((closestPlayer[2] - this.z) / distance) * this.speed);
      }
    }

      var data = {
        id: closestPlayer[3],
        dmg: this.damage,
        x: this.x,
        y: this.y,
        z: this.z
      }
      io.emit('enemyHit', data);

  }
}

function enemyFunction(){
  for(i=0 ; i < enemyArray.length ; i++){
    enemyArray[i].move();
  }

  io.emit('enemies', enemyArray);
}

/*
function dayCycle(){
  dayTime += 1;
  if(dayTime >= 1200){
    dayTime = 0;
  }

  var time = {
    time: dayTime
  }

  io.emit('dayData', time);

}
*/

function dist(x1,y1,z1,x2,y2,z2){

  //console.log(Math.sqrt(((x1-x2)^2) + ((y1-y2)^2) + ((z1-z2)^2)));
  return Math.sqrt(((x2-x1)^2) + ((y2-y1)^2) + ((z2-z1)^2));

}