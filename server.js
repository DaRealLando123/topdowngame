var express = require('express'); //server creation
var app = express();//server creation
var server = app.listen(3000); //port to listen for
app.use(express.static('client')); //what folder to send to client

var players = [];
var buildings = [["Core", 0, 0, 1, 500, 100, 100],["Farm", 3, 3, 1, 150, 10, 10]];
//                 name  x  y level cost hp  hpmax

var money = 200;

console.log("Server started"); //when server successfully runs

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

setInterval(msUpdate, 1); //dont change
setInterval(sendPlayerlist, 10); //how often should server send playerdata to clients (anything lower then 10 is ddos)
setInterval(moneyUpdate, 1000);

var pingTillTimeout = 1000; //how long until server decides they have exited the game or have bad enough wifi

function newConnection(socket) {

  console.log("New connection from: " + socket.id);
  socket.on('playerData', recievedPlayerData);
  socket.on('placedBuilding', placedBuilding);

  socket.on('chat', recievedChat);

  var gameinfo = {
    money: money,
    buildings: buildings
  }
  socket.emit('gameData', gameinfo);
  socket.emit('connected');
  console.log("Server data successfully synced to " + socket.id);

  function placedBuilding(buildingPlaced) {

    console.log(buildingPlaced);
    
    var buildingReturn = "";
    
    for (i = 0; i < buildings.length; i++) {
      if(buildings[i][1] === buildingPlaced[1] && buildings[i][2] === buildingPlaced[2]){
        buildingReturn = "A "+buildings[i][0]+" is already there";
      }
    }
    
    if (money >= buildingPlaced[4] && buildingReturn === "") {
      buildings.push(buildingPlaced);
      buildingReturn = "Successfully placed " + buildingPlaced[0];
      money -= buildingPlaced[4];
    } else if (money < buildingPlaced[4]){
      buildingReturn = "You don't have enough money to place " + buildingPlaced[0];
    }
    socket.emit('buildingReturn', buildingReturn);
    var gameinfo = {
      money: money,
      buildings: buildings
    }
    io.emit('gameData', gameinfo);
    socket.emit('chat', buildingReturn);
  }
}

function recievedPlayerData(playerData) {

  let inArray = false;
  if (playerData.id != undefined) {

    for (i = 0; i < players.length; i++) {
      if (players[i].id === playerData.id) {
        inArray = true;
        players[i].t = pingTillTimeout;
        Object.assign(players[i], players[i], playerData);
      }
    }

    if (inArray === false) {
      players.push(playerData);
      console.log(players[i].id + " has been loaded");
    }
  }
}

function recievedChat(message){
  console.log(message);
  io.emit('chat', message);
}

function moneyUpdate(){
  for (i = 0; i < buildings.length; i++) {
    if(buildings[i][0] === 'Farm'){
      money += 1 * buildings[i][3];
    }
  }
  var uMoney = money;
  io.emit('moneyUpdate', uMoney);
}

function msUpdate() {
  for (i = 0; i < players.length; i++) {
    players[i].pingtick += 1;
    players[i].t -= 1;
    if (players[i].t <= 0 || players[i].t == undefined || players[i].t == NaN) {
      console.log(players[i].id + " has been timedout");
      players.splice(i, 1);
    }
  }
}

function sendPlayerlist() {
  var playerlist = players;
  io.emit('playerData', playerlist);
}
