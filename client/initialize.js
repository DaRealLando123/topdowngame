const x = 0;
const y = 1;
const z = 2;
const xvel = 3;
const yvel = 4;
const zvel = 5;
const health = 6;
const maxHealth = 7;
const stamina = 8;
const maxStamina = 9;
const staminaRechargeDelay = 10;
const staminaRechargeDelayBase = 11; //Added stamina recharging which could be a skill you could upgrade
const gold = 12;
const combatLv = 13;
const combatXp = 14;
const combatXpNeeded = 15;
const playerLevel = 16;

var players = [];
var playersLastMessage = [];
var playersJoined = [];
var player = [0, 0, 0, 0, 0, 0,75,100,100,100,0,100,0,1,12,25,1];
var level = 1;
var cam;
var draggables = [];
var platforms = [];
var bullets = [];
var models = [];
var enemyArray = [];
var gravity = 0.005;
var camRotation = 0;
var camTilt = 0;
var canJump = 1;

var speedMult = 1;

var jumps = 1;

var dayBackground = [96, 161, 204];
var dayLight = [255, 254, 240];
var dayAmbient = 100;
var nightBackground = [3,6,12];
var nightLight = [11, 16, 38];
var nightAmbient = 0;

var currentBackground = dayBackground;
var currentLight = dayLight;
var currentAmbient = dayAmbient;

var onGround = 0;
var gameTime = 0;
var fovCrouch = 0;
var playerHeight = 30;
var fovOffset = 10;
var playerSize = 16;
var crouching = 0;
var crouchDampening = 12;
var textures = [];
var heldItem = "sword";
var hudOffset = 0;
var playerSpeed = 0;
var chatHistory = ["The latest chat messages will appear here."];
var showChat = false;
var showAdvancedHud = false;
var lastMessage = "";
var lastUsername = "";
var fovDampening = (3.14159 / (1.8 - fovCrouch - fovOffset));
var mouseHasMoved = false;
var inMenu = false;
var escMenu = false;
var username = null;

var toLoad = 6;
var loaded = 0;

var socket;
var color;

var canvastest;

var currentCanvas = "3d";

function preload() {
  textures.push(loadImage("images/SwampSq.png",loading));
  textures.push(loadImage("images/MountainsSq.png",loading));
  textures.push(loadImage("images/VolcanoSq.png",loading));
  models.push(loadModel("models/sword.obj",loading));
  models.push(loadModel("models/bow.obj",loading));
  inconsolata = loadFont('fonts/Inconsolata-Regular.otf',loading);
}

function loading(){
  //literally useless unless your in console so idk why i added it
  toLoad -= 1;
  loaded += 1;
  console.log("Loaded Asset "+loaded+"/"+ (toLoad + loaded));
}

function setup() {
  canvastest = createCanvas(window.innerWidth - 20, window.innerHeight - 20,WEBGL);
  cam = createCamera();

    platforms.push(new Rect(0, 350, 0, 500, 500, 500, 1, 0));
    platforms.push(new Rect(-275, -100, 0, 50, 500, 500, 1, 1));
    platforms.push(new Rect(275, -100, 0, 50, 500, 500, 1, 1));
    platforms.push(new Rect(350, -100, -275, 500, 500, 50, 1, 1));
    platforms.push(new Rect(-350, -100, -275, 500, 500, 50, 1, 1));
    platforms.push(new Rect(0, -100, 275, 500, 500, 50, 1, 1));

    platforms.push(new Rect(250, 350, -750, 1500, 500, 1000, 1, 0));

  textFont(inconsolata);
  textAlign(CENTER,CENTER);

  stroke(69/2,105/2,38/2);
  strokeWeight(1);

  frameRate(999);

  socket = io.connect('https://3dMultiplayer.badteam.repl.co');
  socket.on('packet', newPacket);
  socket.on('enemyHit', enemyFunction);
  socket.on('enemies', enemyDataFunction);
  //socket.on('dayData', dayTimeFunction);
  socket.on('chatMessage', recievedMessage);

  chatInput = createInput();
  chatInput.hide();

}

function swapCanvas(){
  canvastest.remove();
  if(currentCanvas === "2d"){
    canvastest = createCanvas(window.innerWidth - 20, window.innerHeight - 20,WEBGL);
    canvas = "3d";
  } else {
    canvastest = createCanvas(window.innerWidth - 20, window.innerHeight - 20,P2D);
    background(100);
    currentCanvas = "2d";
  }
  console.log("swapped canvas");
}