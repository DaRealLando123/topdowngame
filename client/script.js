
function draw() {
  if(chatHistory.length > 10){
    chatHistory.shift();
  }
  if(username === null || username === ""){username = "Default"}

  playerSpeed = abs(player[xvel]) + abs(player[zvel]);

  ambientLight(currentAmbient);
  directionalLight(currentLight[0],currentLight[1],currentLight[2], -1, 1, -1);

  stroke(69/2,105/2,38/2);
  strokeWeight(1);

 //movement + camera
  if(abs(player[xvel]) < 0.00001){
    player[xvel] = 0;
  }
  if(abs(player[zvel]) < 0.00001){
    player[zvel] = 0;
  }

  if (keyIsDown(67) && showChat === false) {
    crouching = 1;
  } else {
    crouching = 0;
  }

  if (crouching === 1) {
    playerHeight = 18;
    hudOffset = 12;
    fovCrouch = 0;
  } else if (crouching === 0) {
    playerHeight = 30;
    hudOffset = 0;
    fovCrouch = 0.05;
  }

  crouchDampening += ((playerHeight - 5) - crouchDampening) / 5
  crouchDampening = round(crouchDampening, 5);

  fovOffset = round(abs(player[xvel]) + abs(player[zvel]), 2) / 50;

  if(fovOffset > 20/50){
    fovOffset = 20/50;
  }

  fovDampening += ((PI / (1.8 - fovCrouch - fovOffset)) - fovDampening) / 20
  fovDampening = round(fovDampening,5);

  resizeCanvas(window.innerWidth - 20, window.innerHeight - 20);
  cam.perspective(fovDampening, width / height, 0.1, 10000);

  clear();

  console.log(speedMult);

  if(keyIsDown(87) || keyIsDown(65) || keyIsDown(83) || keyIsDown(68)){
    if(keyIsDown(16)){
      if(player[stamina] > 0 && crouching === 0){
        player[stamina] -= 1 * (deltaTime / 40);
        speedMult = 2;
        player[staminaRechargeDelay] = player[staminaRechargeDelayBase];
      } else {
        speedMult = 1;
      }
    } else {
      if(player[staminaRechargeDelay] > 0){
        player[staminaRechargeDelay] -= 0.1 * deltaTime; 
        speedMult = 1;
      }
    }
  } else {
      if(player[staminaRechargeDelay] === 0 && player[stamina] < player[maxStamina]){
        player[stamina] += 0.6 * (deltaTime / 40);
      }
    speedMult = 1;
      if(player[staminaRechargeDelay] > 0){
        player[staminaRechargeDelay] -= 1; 
      }
  }

  if(player[staminaRechargeDelay] <= 0 && keyIsDown(16) === false || crouching === 1){
      if(player[stamina] < player[maxStamina]){
        player[stamina] += 0.6 * (deltaTime / 40);
      }
      speedMult = 1;
    }

  if(player[stamina] > player[maxStamina]){
    player[stamina] = player[maxStamina];
  }

  background(currentBackground[0],currentBackground[1],currentBackground[2]);

  cam.tilt(-camTilt);
  cam.pan(-camRotation);

  if (crouching === 0 && inMenu === false || playerSpeed < 0.3 && inMenu === false) {

    if (keyIsDown(87)) { //W
      player[zvel] -= Math.cos(camRotation) * (0.01 * (1.5/(2-onGround))) * deltaTime * speedMult;
      player[xvel] -= Math.sin(camRotation) * (0.01 * (1.5/(2-onGround))) * deltaTime * speedMult;
    }
    if (keyIsDown(65)) { //A
      player[zvel] -= Math.cos(camRotation + (PI / 2)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
      player[xvel] -= Math.sin(camRotation + (PI / 2)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
    }
    if (keyIsDown(83)) { //S
      player[zvel] -= Math.cos(camRotation + ((PI / 2) * 2)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
      player[xvel] -= Math.sin(camRotation + ((PI / 2) * 2)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
    }
    if (keyIsDown(68)) { //D
      player[zvel] -= Math.cos(camRotation + ((PI / 2) * 3)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
      player[xvel] -= Math.sin(camRotation + ((PI / 2) * 3)) * (0.008 * (1.5/(2-onGround))) * deltaTime * speedMult;
    }

  }

  for (var i = 0; i < platforms.length; i++) {
    platforms[i].checkCollision();
  }

  player[x] += player[xvel] * deltaTime / 10;
  player[z] += player[zvel] * deltaTime / 10;

    if (crouching === 0) {
      if (abs(player[xvel] + player[zvel]) > 1) {
        player[xvel] -= (player[xvel] / (50 * (2 - onGround))) * deltaTime;
        player[zvel] -= (player[zvel] / (50 * (2 - onGround))) * deltaTime;
      } else if (abs(player[xvel] + player[zvel]) <= 1) {
        player[xvel] -= (player[xvel] / (100 * (2 - onGround))) * deltaTime;
        player[zvel] -= (player[zvel] / (100 * (2 - onGround))) * deltaTime;
      }
    } else if (crouching === 1) {
      player[xvel] -= (player[xvel] / (500 * (2 - onGround))) * deltaTime;
      player[zvel] -= (player[zvel] / (500 * (2 - onGround))) * deltaTime;
    }

  player[y] += player[yvel];
  player[yvel] += gravity * deltaTime;
    if(inMenu === false){
      camRotation += (round(-movedX, 4) * 0.003);
      camTilt += (round(movedY, 4) * 0.003);
    }

  if (camTilt >= 1.45) {
    camTilt = 1.45;
  } else if (camTilt <= -1.45) {
    camTilt = -1.45;
  }

  cam.pan(camRotation);
  cam.tilt(camTilt);

  onGround = 0;

  pointLight(153, 72, 24,player[x],player[y] - crouchDampening,player[z]);

  for (var i = 0; i < platforms.length; i++) {
    platforms[i].checkCollision();
    platforms[i].draw();
  }

  for (var i = 0; i < draggables.length; i++) {
    draggables[i].over();
    draggables[i].show();
  }

  for (var i = 0; i < enemyArray.length; i++) {
    translate(enemyArray[i].x, enemyArray[i].y, enemyArray[i].z);
    translate(0, -enemyArray[i].height/2, 0);

    box(enemyArray[i].size, enemyArray[i].height, enemyArray[i].size);

    translate(0, enemyArray[i].height/2, 0);
    translate(-enemyArray[i].x, -enemyArray[i].y, -enemyArray[i].z);
  }

  //multiplayer data to be sent
  noStroke();
  var data = {
    x: round(player[x],2),
    y: round(player[y],2),
    z: round(player[z],2),
    t: 100,
    id: socket.id,
    r: round(camRotation,6),
    rt: round(camTilt,6),
    c: crouching,
    hi: heldItem,
    u: username
  }

  

  socket.emit('packet', data);


  for(i = 0; i < players.length; i++){  //MULTIPLAYER DISPLAY

    translate(players[i].x, players[i].y - 10, players[i].z); 
    rotateY(players[i].r);
    if(players[i].c === 1){
      rotateX(-70);
    }
    
  if(dist(player[x], player[y], player[z], players[i].x, players[i].y, players[i].z) <= 3000){
    translate(-8,0,-8);
    rotateZ(PI);
    //helditem display
    texture(textures[2]);
    if(players[i].hi === "sword"){
      scale(20);
      model(models[0]);
      scale(0.05);
    }
    if(players[i].hi === "bow"){
      fill(100,50,0);
      scale(.2);
      model(models[1]);
      scale(5);
    }
    rotateZ(-PI);
    translate(8,0,8);

    fill(50,50,120);
    cylinder(7,20)

    translate(0,-13,0);
    rotateX(players[i].rt);
    translate(0,-5,0);
    if(players[i].c === 1){
     rotateX(-60);
    }
    box(10);
    if(players[i].c === 1){
     rotateX(60);
    }
    translate(0,5,0);
    rotateX(-players[i].rt);
    translate(0,13,0);
  }
    if(players[i].c === 1){
     rotateX(70);
    }
    rotateY(-players[i].r)
    translate(-players[i].x, -(players[i].y - 10), -players[i].z); 

    players[i].t -= 1;

    if(players[i].t <= 0){
      chatHistory.push("<Client> Player " + players[i].id + " unloaded from client");
      players.splice(i,1);
    }
  }
  for(i = 0; i < lastUsername.length; i++){
    if(username.length > 15){
      username = username.substr(0,username.length - 1);
      console.log("Username <"+username+"> is too long!");
    }
  }

  //crap
  if(camRotation < -PI){
    camRotation += PI*2
  }
  if(camRotation > PI){
    camRotation -= PI*2
  }
  cam.setPosition(player[x], player[y] - crouchDampening, player[z]);
  displayHud();
}

function mouseReleased(){
  for (var i = 0; i < draggables.length; i++) {
    draggables[i].released();
  }
}

function mousePressed(){
  for (var i = 0; i < draggables.length; i++) {
    draggables[i].pressed();
  }
  if(inMenu === false){
    requestPointerLock();
  }
  if(mouseButton === LEFT){
    if(crouching === 0){
      //bullets.push(new Bullet(camRotation, camTilt, player[x] - Math.sin(camRotation) * 20, player[y]-25 - Math.sin(camTilt) * -20, player[z] - Math.cos(camRotation) * 20));
    } else if(crouching === 1){
      //bullets.push(new Bullet(camRotation, camTilt, player[x] - Math.sin(camRotation) * 20, player[y]-13 - Math.sin(camTilt) * -20, player[z] - Math.cos(camRotation) * 20));
    }
  }
  console.log(abs(Math.cos(camRotation) * (0.01 * (1.5/(2-onGround)))));
}

function keyPressed() {
  if(keyCode === 81 && inMenu === false && heldItem === "bow"){
    heldItem = "sword";
  } 
  else if (keyCode === 81 && inMenu === false && heldItem === "sword") {        heldItem = "bow";
  }

  if(keyCode === 85 && inMenu === false){
    username = prompt("Username");
    lastUsername = username;
  }

    if(keyCode === 13 && showChat === true){
      lastMessage = chatInput.value();
      var message = chatInput.value();

      for(i = 0; i < message.length; i++){
        if(lastMessage.length > 70){
          lastMessage = lastMessage.substr(0,lastMessage.length-1);
          console.log("Message <"+lastMessage+"> is too long!");
        }
      }

      var msg = {
        m: lastMessage,
        u: username
      }

      if(chatInput.value() != ""){
        chatHistory.push("(You) <"+username+"> "+lastMessage);
        socket.emit('chatMessage', msg);
      }

      chatInput.value("");
    }
    
  if (keyCode === 192) { //showChat
    if (keyIsDown(192) && showChat === false && inMenu === false) {
      exitPointerLock();
      inMenu = true;
      showChat = true;
      chatInput.show();
      chatInput.position(-((window.innerWidth / window.innerHeight) / 1.7) + 220,20);
    }
    else{
      requestPointerLock();
      showChat = false;
      inMenu = false;
      chatInput.hide();
      chatInput.value("");
    }
  }

  if (keyCode === 187) { //showAdvancedHud
    if (keyIsDown(187) && showAdvancedHud === false && inMenu === false) {
      showAdvancedHud = true;
    }
    else{
      requestPointerLock();
      showAdvancedHud = false;
    }
  }
  
  /*if (keyCode === 27) { //escMenu
    if (keyIsDown(27) && showChat === false) {
      exitPointerLock();
      escMenu = true;
      inMenu = true;
    }
    else{
      requestPointerLock();
      escMenu = false;
      inMenu = false;
    }
  }
  */

  if (keyCode === 32) {
    if (keyIsDown(32) && canJump >= 1 && inMenu === false) { //Space
      player[yvel] = (-0.065 * (abs(player[xvel]) + abs(player[zvel]) + 22));
      canJump -= 1;
    }
  }

  gravity = round(gravity,4);

}

function newPacket(data){
  var inArray = false;
  for(i = 0; i < players.length; i++){
    if(players[i].id === data.id){
      inArray = true;
      players[i] = data;
    }
  }
  if(inArray === false){
    players.push(data);
    chatHistory.push("<Client> Player " + data.id + " loaded to client");
  }
}

function raycast(x1,y1,z1,r,t,x2,y2,z2,dx,dy,dz,range,p,area){

  let distMult = Math.cos(t);

  let ptX = x1 - (Math.sin(r) * range) * distMult;
  let ptY = y1 - Math.sin(t) * -range;
  let ptZ = z1 - (Math.cos(r) * range) * distMult;
  
  let diffX = (ptX-x1);
  let diffY = (ptY-y1);
  let diffZ = (ptZ-z1);
  
  for(i=1 ; i<=p ; i++){

    if((x1+((diffX/p)*i)) > x2-(dx/2) && (x1+((diffX/p)*i)) < x2+(dx/2) && (y1+((diffY/p)*i)) > y2-(dy/2) && (y1+((diffY/p)*i)) < y2+(dy/2) && (z1+((diffZ/p)*i)) > z2-(dz/2) && (z1+((diffZ/p)*i)) < z2+(dz/2)){

      return true;

    }

    if(dist(x1+((diffX/p)*i), y1+((diffY/p)*i), z1+((diffZ/p)*i), x2, y2, z2) <= area){

      return true;
    }
    
  }

  return false;
}

function displayHud(){

  noStroke();
  translate(player[x] - (Math.sin(camRotation) * 0.5) * Math.cos(camTilt), (player[y] - crouchDampening - Math.sin(camTilt) * -0.5), player[z] - (Math.cos(camRotation) * 0.5) * Math.cos(camTilt));

      rotateY(camRotation);
      rotateX(camTilt);
      
      fill(0);
      circle(0,0,25 / window.innerWidth);

      rect(-((window.innerWidth / window.innerHeight) / 1.7), 0.38, 0.6, 0.18);

      rect(-((window.innerWidth / window.innerHeight) / 1.7), 0.28, 0.6, 0.08);

      rect(-(((window.innerWidth / window.innerHeight) / 1.7)+0.07), 0.56, 0.06, -0.28);

        translate(0,0,0.0005);

      fill(120,20,20);
      rect(-(((window.innerWidth / window.innerHeight) / 1.7)-0.02), 0.4, (0.56*player[health]) / player[maxHealth], 0.14);

      fill(50,125,250);
      rect(-(((window.innerWidth / window.innerHeight) / 1.7)+0.05), 0.54, 0.02, ((player[combatXp]) / player[combatXpNeeded]) * -0.24);

      if(player[stamina] >= 0.1){
        fill(30,100,30);
        rect(-(((window.innerWidth / window.innerHeight) / 1.7)-0.02), 0.3, (0.56*player[stamina]) / player[maxStamina], 0.04);
      }

        translate(0,0,-0.0005);

        translate(0,0,0.00045);

      fill(20);
      rect(-(((window.innerWidth / window.innerHeight) / 1.7)-0.02), 0.4, 0.56, 0.14);

      fill(20);
      rect(-(((window.innerWidth / window.innerHeight) / 1.7)-0.02), 0.3, 0.56, 0.04);

      fill(20);
      rect(-(((window.innerWidth / window.innerHeight) / 1.7)+0.05), 0.54, 0.02, -0.24);

        translate(0,0,-0.00045);
        
      if(showChat === true || showAdvancedHud === true){
        fill(0)
        //rect(-((window.innerWidth / window.innerHeight) / 1.7),0.1,0.4,-0.40)
        for(var i = 0; i < chatHistory.length; i++){
          fill(255);
          translate(0,0,0.0005);
          textSize(.03);
          textAlign(LEFT,CENTER);
          text(chatHistory[i],-((window.innerWidth / window.innerHeight) / 1.7)+ 0.01, (0.05 * i)-0.54);
          translate(0,0,-0.0005);
        }
      } else {
        translate(0,0,0.0005);
        textSize(.03);
        textAlign(LEFT,CENTER);
        fill(255);
        text("Press ` to expand the chat\n "+chatHistory[chatHistory.length - 1],-((window.innerWidth / window.innerHeight) / 1.7)+ 0.01,-0.54);
        //coordinates
        if(showAdvancedHud === true){
          text("Exact Coordinates: " + round(player[x]) + " " + round(player[y]) + " " + round(player[z]),-((window.innerWidth / window.innerHeight) / 1.7)+ 1.0,-0.54);
        translate(0,0,-0.0005);
        } else {
          text("Coordinates: " + round(player[x] / 10) + " " + round(player[y] / 10) + " " + round(player[z] / 10),-((window.innerWidth / window.innerHeight) / 1.7)+ 1.0,-0.54);
        }
        translate(0,0,-0.0005);
        }
      
      translate(1.9, 2.2, -1);
      rotateZ(PI);
      scale(2);
      texture(textures[2]);
      if(heldItem === "sword"){
        model(models[0]);
      }
      if(heldItem === "bow"){
        translate(0,0.5,0);
        scale(0.015);
        model(models[1]);
        scale(105);
        translate(0,-0.5,0);
      }
      scale(0.5);
      rotateZ(-PI);
      translate(-1.9, -2.2, 1);
      


      rotateX(-camTilt);
      rotateY(-camRotation);

    translate(-(player[x] - (Math.sin(camRotation) * 0.5) * Math.cos(camTilt)), -((player[y] - crouchDampening - Math.sin(camTilt) * -0.5) - playerHeight+5), -(player[z] - (Math.cos(camRotation) * 0.5) * Math.cos(camTilt)));
}

function recievedMessage(msg){
  chatHistory.push("<"+msg.u+"> "+msg.m);
}

function enemyFunction(){
  
}

function enemyDataFunction(enemyList){
enemyArray = enemyList;
}

/*
function dayTimeFunction(data){
  gameTime = data.time;

  console.log(gameTime);

  
  if(gameTime < 900 && gameTime > 300){            //day > night

    currentLight[0] = dayLight[0] - (((dayLight[0]-nightLight[0]) / 500) * (gameTime-300));
    currentLight[1] = dayLight[1] - (((dayLight[1]-nightLight[1]) / 500) * (gameTime-300));
    currentLight[2] = dayLight[2] - (((dayLight[2]-nightLight[2]) / 500) * (gameTime-300));
    currentBackground[0] = dayBackground[0] - (((dayBackground[0]-nightBackground[0]) / 500) * (gameTime-300));
    currentBackground[1] = dayBackground[1] - (((dayBackground[1]-nightBackground[1]) / 500) * (gameTime-300));
    currentBackground[2] = dayBackground[2] - (((dayBackground[2]-nightBackground[2]) / 500) * (gameTime-300));
    currentAmbient = dayAmbient - (((dayAmbient-nightAmbient) / 500) * (gameTime-300));

  } else if(gameTime < 1100 && gameTime > 900){    //night > day

    currentLight[0] = nightLight[0] - (((nightLight[0]-dayLight[0]) / 200) * (gameTime-900));
    currentLight[1] = nightLight[1] - (((nightLight[1]-dayLight[1]) / 200) * (gameTime-900));
    currentLight[2] = nightLight[2] - (((nightLight[2]-dayLight[2]) / 200) * (gameTime-900));
    currentBackground[0] = nightBackground[0] - (((nightBackground[0]-dayBackground[0]) / 200) * (gameTime-900));
    currentBackground[1] = nightBackground[1] - (((nightBackground[1]-dayBackground[1]) / 200) * (gameTime-900));
    currentBackground[2] = nightBackground[2] - (((nightBackground[2]-dayBackground[2]) / 200) * (gameTime-900));
    currentAmbient = nightAmbient - (((nightAmbient-dayAmbient) / 200) * (gameTime-900));

  }
  if(gameTime >= 1100 || gameTime <= 300){   //day

    currentAmbient = dayAmbient;
    currentLight = dayLight;
    currentBackground = dayBackground;

  }
  if(gameTime >= 800 && gameTime <= 900){  //night

    currentAmbient = nightAmbient;
    currentLight = nightLight;
    currentBackground = nightBackground;

  }
  
}
*/