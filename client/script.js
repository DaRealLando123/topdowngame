const grassDetail = [0.2, 80]; //change per box, color change amount

var xOffset = -12;
var yOffset = -10;

var x = 100;
var y = 100;
var holdingMouse = [false, false];

var heldx;
var heldy;

var screenWidth;
var screenHeight;
var ssm;

var farmImages = [];
var barrackImages = [];
var coreImages = [];
var wallImages = [];

var chat = ["Beginning of Chat"];
var showChat = 500;

var showCursors = true;

var buildings = []; //doesnt change anything
var money = 0; //doesnt change anything

var hudMenu = [false, 0] //inmenu, what menu
//the menu number is the same as the number pressed to open it (farms=1, defense=2, ect)

var buildingSelected;//used to store what item will be placed when click (what item u chose in menu)

var tilesSelected = [1, 1];

var clr;



function preload() {
  farmImages.push(loadImage("assets/farm.png"));
  wallImages.push(loadImage("assets/woodwall.png"));
  wallImages.push(loadImage("assets/stonewall.png"));
  wallImages.push(loadImage("assets/ironwall.png"));
  barrackImages.push(loadImage("assets/barrack.png"));
  coreImages.push(loadImage("assets/core.png"));
}

var menuOptions;

function setup() {
  createCanvas(500, 500);
  menuOptions = [

    [["Farm", 150, farmImages[0]]],
    [["Wall", 20, wallImages[0]]],
    [["Barrack", 450, barrackImages[0]]]

  ];
}

function draw() {

  if (hudMenu[0] === false) {
    buildingSelected = null;
  }

  if (window.innerWidth - 20 > window.innerHeight - 20) {
    screenWidth = window.innerHeight - 20;
    screenHeight = window.innerHeight - 20;
  } else if (window.innerWidth - 20 < window.innerHeight - 20) {
    screenWidth = window.innerWidth - 20;
    screenHeight = window.innerWidth - 20;
  } else {
    screenWidth = window.innerWidth - 20;
    screenHeight = window.innerHeight - 20;
  }

  ssm = (screenWidth / 500);
  x += movedX;
  y += movedY;

  if (x >= 500) {
    x = 499;
  }
  if (x <= 0) {
    x = 1;
  }

  if (y <= 0) {
    y = 1;
  }
  if (y >= 500) {
    y = 499;
  }

  resizeCanvas(screenWidth, screenHeight);

  clear();
  for (i = 0; i < 21; i++) {
    for (j = 0; j < 25; j++) {
      strokeWeight(1);
      stroke(0, 60, 0);
      let thisX = xOffset + j;
      let thisY = yOffset + i;
      fill(0, (100 - (grassDetail[1] / 2)) + (noise((j + xOffset - 10000) * grassDetail[0], (i + yOffset - 10000) * grassDetail[0]) * grassDetail[1]), 0);

      rect((j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);

      for (k = 0; k < buildings.length; k++) {
        if (buildings[k][1] === thisX && buildings[k][2] === thisY) {
          fill(0);
          rect((j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);
          if (buildings[k][0] === "Core") {
            image(coreImages[buildings[k][3] - 1], (j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);
          }
          if (buildings[k][0] === "Farm") {
            image(farmImages[buildings[k][3] - 1], (j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);
          }
          if (buildings[k][0] === "Wall") {
            image(wallImages[buildings[k][3] - 1], (j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);
          }
          if (buildings[k][0] === "Barrack") {
            image(barrackImages[buildings[k][3] - 1], (j * 20) * ssm, (i * 20) * ssm, 20 * ssm, 20 * ssm);
          }
        }
      }
    }
  }

  switch (buildingSelected) {

    case "Farm":
      image(farmImages[0], x * ssm, y * ssm, 10 * ssm, 10 * ssm);
      break;

    case "Wall":
      image(wallImages[0], x * ssm, y * ssm, 10 * ssm, 10 * ssm);
      break;

    case "Barrack":
      image(barrackImages[0], x * ssm, y * ssm, 10 * ssm, 10 * ssm);
      break;

  }


  for (var i = 0; i < players.length; i++) {
    if (showCursors === true) {

      clr = color(0, 255, 0);
      clr.setAlpha(120);
      noStroke();
      fill(clr);
      circle(players[i].x * ssm, players[i].y * ssm, 5 * ssm);
      clr = color(0, 255, 0);
      clr.setAlpha(50);
      fill(clr);

      switch (players[i].bs) {

        case "Farm":
          image(farmImages[0], players[i].x * ssm, players[i].y * ssm, 10 * ssm, 10 * ssm);
          break;

        case "Wall":
          image(wallImages[0], players[i].x * ssm, players[i].y * ssm, 10 * ssm, 10 * ssm);
          break;

        case "Barrack":
          image(barrackImages[0], players[i].x * ssm, players[i].y * ssm, 10 * ssm, 10 * ssm);
          break;
      }

      if (players[i].hm === true) {
        rect(players[i].hx * ssm, players[i].hy * ssm, ((players[i].x) - players[i].hx) * ssm, ((players[i].y) - players[i].hy) * ssm);
      }

    }
  }

  displayHud();

  clr = color(255);
  clr.setAlpha(150);
  fill(clr);
  noStroke();
  rect((x - 1) * ssm, (y - 3.5) * ssm, 2 * ssm, 7 * ssm);
  rect((x - 3.5) * ssm, (y - 1) * ssm, 7 * ssm, 2 * ssm);
  fill(50);
  circle(x * ssm, y * ssm, 2 * ssm);

  if (holdingMouse[0] === true) {
    clr = color(100, 100, 200);
    clr.setAlpha(100);
    stroke(255);
    strokeWeight(.5);
    fill(clr);
    rect(heldx, heldy, (x * ssm) - heldx, (y * ssm) - heldy);
  }
}

function mousePressed() {
  if (hudMenu[1] === 1) {
    for (var i = 0; i < menuOptions[0].length; i++) {
      if (round(((i + 1) * 40) / 40) === round(x / 40) && gridClicked()[1] < 10 && gridClicked()[1] > 7) {
        buildingSelected = menuOptions[0][i][0];
        console.log(menuOptions[0][i][1]);
        console.log(buildingSelected);
      }
    }
  }
  if (hudMenu[1] === 2) {
    for (var i = 0; i < menuOptions[1].length; i++) {
      if (round(((i + 1) * 40) / 40) === round(x / 40) && gridClicked()[1] < 10 && gridClicked()[1] > 7) {
        buildingSelected = menuOptions[1][i][0];
        console.log(buildingSelected);
      }
    }
  }
  if (hudMenu[1] === 3) {
    for (var i = 0; i < menuOptions[2].length; i++) {
      if (round(((i + 1) * 40) / 40) === round(x / 40) && gridClicked()[1] < 10 && gridClicked()[1] > 7) {
        buildingSelected = menuOptions[2][i][0];
        console.log(buildingSelected);
      }
    }
  }

  if (y < 420) {
    if (hudMenu[0] === false) {
      placeBuilding(buildingSelected, gridClicked()[0], gridClicked()[1], 1); //temp
    }
    if (hudMenu[0]) {
      if (y >= 340 && x <= 280) {
      } else {
        placeBuilding(buildingSelected, gridClicked()[0], gridClicked()[1], 1); //temp
      }
    }
  }

  requestPointerLock();

  if (mouseButton === LEFT) {
    holdingMouse[0] = true;
  }
  if (mouseButton === RIGHT) {
  }

  if (holdingMouse[0] === true) {
    heldx = x * ssm;
    heldy = y * ssm;
  }

  console.log(gridClicked());
}

function mouseReleased() {

  if (mouseButton === LEFT) {
    holdingMouse[0] = false;
    holdingMouse[1] = false;
  }
  if (mouseButton === RIGHT) {
    holdingMouse[1] = false;
    holdingMouse[0] = false;
  }
}

function gridClicked() { //gridClicked[0] is X clicked, and [1] is for Y
  let clickedon = [Math.floor(((x * ssm) / (20 * ssm)) + xOffset), Math.floor(((y * ssm) / (20 * ssm)) + yOffset)];
  return (clickedon)
}

function displayHud() {
  noStroke();
  fill(50);
  rect(0, 420 * ssm, 420 * ssm, 80 * ssm);
  fill(80);
  rect(420 * ssm, 420 * ssm, 100 * ssm, 55 * ssm);
  fill(100);
  rect(420 * ssm, 475 * ssm, 100 * ssm, 25 * ssm);

  //farms
  strokeWeight(2 * ssm);
  stroke(120, 65, 0);
  fill(250, 150, 50);
  rect(20 * ssm, 440 * ssm, 40 * ssm, 40 * ssm);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12 * ssm);
  text("Farms", 40 * ssm, 458 * ssm);
  textSize(9 * ssm);
  text("Press 1", 40 * ssm, 468 * ssm);

  //defense
  strokeWeight(2 * ssm);
  stroke(65, 120, 0);
  fill(150, 250, 50);
  rect(80 * ssm, 440 * ssm, 40 * ssm, 40 * ssm);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(10 * ssm);
  text("Defense", 100 * ssm, 458 * ssm);
  textSize(9 * ssm);
  text("Press 2", 100 * ssm, 468 * ssm);

  //defense
  strokeWeight(2 * ssm);
  stroke(0, 65, 120);
  fill(50, 150, 250);
  rect(140 * ssm, 440 * ssm, 40 * ssm, 40 * ssm);
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(12 * ssm);
  text("Units", 160 * ssm, 458 * ssm);
  textSize(9 * ssm);
  text("Press 3", 160 * ssm, 468 * ssm);

  fill(50, 255, 50);
  text("Money: $" + money, 460 * ssm, 490 * ssm);
  fill(255);
  if (buildingSelected != undefined) {
    text("Placing:", 460 * ssm, 460 * ssm);
    text(buildingSelected, 460 * ssm, 470 * ssm);
  }

  for (var i = 0; i < buildings.length; i++) {
    if (buildings[i][1] === gridClicked()[0] && buildings[i][2] === gridClicked()[1]) {
      fill(255);
      text("Level " + buildings[i][3] + " " + buildings[i][0], 460 * ssm, 435 * ssm);
      fill(0);
      rect(430 * ssm, 440 * ssm, 60 * ssm, 5 * ssm);
      fill(255, 0, 0);
      rect(430 * ssm, 440 * ssm, ((buildings[i][5] / buildings[i][6]) * 60) * ssm, 5 * ssm);
    }
  }

  if (chat.length > 3) {
    chat.splice(0, 1);
  }

  for (var i = 0; i < chat.length; i++) {
    textAlign(LEFT);
    textSize(10 * ssm);
    noStroke();
    clr = color(255);
    if (showChat > 255) {
      clr.setAlpha(255);
    } else {
      clr.setAlpha(showChat);
    }

    if (showChat === 0) {
      chat.splice(0, chat.length);
    }

    fill(clr);
    text(chat[i], 20 * ssm, (20 * i + 20) * ssm);
  }
  if (showChat > 0) { showChat -= 1; }

  //--------------------------------------------------------------

  if (hudMenu[0]) {
    if (hudMenu[1] === 1) {

      clr = color(250, 150, 50);
      clr.setAlpha(150);
      fill(clr);
      rect(0, 340 * ssm, 320 * ssm, 80 * ssm);
      fill(250, 150, 50);
      stroke(100, 65, 15);
      strokeWeight(3);

      for (var i = 0; i < menuOptions[0].length; i++) {

        fill(250, 150, 50);
        stroke(100, 65, 15);
        strokeWeight(3);
        rect(((i * 60) + 20) * ssm, 360 * ssm, 40 * ssm, 40 * ssm);
        if (menuOptions[0][i][2] != null) {
          image(menuOptions[0][i][2], ((i * 60) + 30) * ssm, 364 * ssm, 20 * ssm, 20 * ssm);
        }
        textAlign(CENTER);
        textSize(12 * ssm);
        noStroke();
        fill(0);
        text(menuOptions[0][i][0], ((i * 60) + 40) * ssm, 414 * ssm);
        textSize(10 * ssm);
        fill(0);
        text(`$${menuOptions[0][i][1]}`, ((i * 60) + 40) * ssm, 396 * ssm);
      }

    }
    if (hudMenu[1] === 2) {

      clr = color(150, 250, 50);
      clr.setAlpha(150);
      fill(clr);
      rect(0, 340 * ssm, 320 * ssm, 80 * ssm);

      for (var i = 0; i < menuOptions[1].length; i++) {

        fill(250, 150, 50);
        stroke(100, 65, 15);
        strokeWeight(3);
        rect(((i * 60) + 20) * ssm, 360 * ssm, 40 * ssm, 40 * ssm);
        if (menuOptions[1][i][2] != null) {
          image(menuOptions[1][i][2], ((i * 60) + 30) * ssm, 364 * ssm, 20 * ssm, 20 * ssm);
        }
        textAlign(CENTER);
        textSize(12 * ssm);
        noStroke();
        fill(0);
        text(menuOptions[1][i][0], ((i * 60) + 40) * ssm, 414 * ssm);
        textSize(10 * ssm);
        fill(0);
        text(`$${menuOptions[1][i][1]}`, ((i * 60) + 40) * ssm, 396 * ssm);

      }

    }
    if (hudMenu[1] === 3) {

      clr = color(50, 150, 250);
      clr.setAlpha(150);
      fill(clr);
      rect(0, 340 * ssm, 320 * ssm, 80 * ssm);

      for (var i = 0; i < menuOptions[2].length; i++) {

        fill(250, 150, 50);
        stroke(100, 65, 15);
        strokeWeight(3);
        rect(((i * 60) + 20) * ssm, 360 * ssm, 40 * ssm, 40 * ssm);
        if (menuOptions[0][i][2] != null) {
          image(menuOptions[2][i][2], ((i * 60) + 30) * ssm, 364 * ssm, 20 * ssm, 20 * ssm);
        }
        textAlign(CENTER);
        textSize(12 * ssm);
        noStroke();
        fill(0);
        text(menuOptions[2][i][0], ((i * 60) + 40) * ssm, 414 * ssm);
        textSize(10 * ssm);
        fill(0);
        text(`$${menuOptions[2][i][1]}`, ((i * 60) + 40) * ssm, 396 * ssm);
      }
    }
  }
}


function keyPressed() {
  if (keyCode === 49) {//1
    if (hudMenu[0] && hudMenu[1] === 1) {
      hudMenu[0] = false;
    } else {
      hudMenu[0] = true;
      hudMenu[1] = 1;
    }
  }
  if (keyCode === 50) {//2
    if (hudMenu[0] && hudMenu[1] === 2) {
      hudMenu[0] = false;
    } else {
      hudMenu[0] = true;
      hudMenu[1] = 2;
    }
  }
  if (keyCode === 51) {//3
    if (hudMenu[0] && hudMenu[1] === 3) {
      hudMenu[0] = false;
    } else {
      hudMenu[0] = true;
      hudMenu[1] = 3;
    }
  }
}