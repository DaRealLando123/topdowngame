console.log("Waiting to sync data from server");
socket = io.connect("https://topdownworking.badteam.repl.co");
var players = [];

socket.on('playerData', recievedPlayerData);
socket.on('gameData', recievedGameData);
socket.on('connected', connected);
socket.on('buildingReturn', buildingReturn);
socket.on('chat', recievedChat);
socket.on('moneyUpdate', updateMoney);

setInterval(networkingUpdate,10);

function recievedGameData(gameinfo){
  money = gameinfo.money;
  buildings = gameinfo.buildings;
}

function recievedPlayerData(playerlist) {
  for(var i = 0; i < playerlist.length; i++){
    if(playerlist[i].id === socket.id){
      playerlist.splice(i,1);
    }
  }
  players = playerlist;
}

function networkingUpdate() {
  let displayMouse = true;
  if(y === 0 && x === 0){
    displayMouse = false;
  }
  if(x/ssm > 500 || x/ssm < 0 || y/ssm > 500 || y/ssm < 0){
    displayMouse = false;
  }

  var playerData = {
    x: Math.round(x, 3),
    y: Math.round(y, 3),
    hx: Math.round(heldx/ssm,3),
    hy: Math.round(heldy/ssm,3),
    hm: holdingMouse[0],
    id: socket.id,
    bs: buildingSelected
  };

  socket.emit('playerData', playerData);
}

function connected(){
  console.log("Server data successfully synced to client");
}

function placeBuilding(name,x,y,level){
  if(name != undefined){
  var prefab;
  var buildingPlaced = [name,x,y,level];
    
  if(buildingPlaced[0] === "Farm"){
    prefab = [150,10,10];
  }
  if(buildingPlaced[0] === "Wall"){
    prefab = [20,20,20];
  }
  if(buildingPlaced[0] === "Barrack"){
    prefab = [450,35,35];
  }
    
  buildingPlaced = buildingPlaced.concat(prefab);
  console.log(buildingPlaced);
  socket.emit('placedBuilding', buildingPlaced);
  }
}

function buildingReturn(buildingReturn){
  console.log(buildingReturn);
}

function sendChat(message){
  socket.emit('chat', message);
}

function recievedChat(message){
  console.log(message);
  chat.push(message);
  showChat = 500;
}

function updateMoney(uMoney){
  money = uMoney;
}