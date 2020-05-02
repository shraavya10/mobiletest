var PLAY = 1;
var END = 0;
var gameState = PLAY;
var Oxylevel=10;
var trex;var trexImg;
//trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var asteroidGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg;var backgroundImg1;
var score=0;
var jumpSound, collidedSound,powerUpSong,gameoversong;
var angle=0;
var gameOver, restart;

function preload(){

powerUpSong = loadSound("sound/powerup.mp3");
 gameoversong = loadSound("sound/gameover.mp3");
 collidedSound=loadSound("sound/collided.wav");
 //trexImg=loadImage("images/astro_nobg.png"); 
 groundImage  = loadImage("images/ground.jpg");
  backgroundImg = loadImage("images/space.jpg");
  
  sequenceAnimation = loadAnimation('images/walking1.png', 'images/walking2.png', 
  'images/walking3.png', 'images/walking4.png', 
  'images/walking5.png', 'images/walking6.png');
  
      
  cloudImage = loadImage("images/oxygen.png");
  
  obstacle1=loadImage("images/asteroid1.jpg");
  obstacle2=loadImage("images/fireasteroid.png");
  obstacle3=loadImage("images/asteroid2.jpg");
  
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  
   
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  
    trex = createSprite(50,height-40,20,50);
  //trex.addImage("running", trexImg);
  trex.scale =  .5;
  trex.mirrorX(-1);
    trex.addAnimation('walker', sequenceAnimation);
      trex.visible=true;
  trex.setCollider('circle',0,0,22)
   trex.debug=true
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "black";
  //invisibleGround.addImage("invisible",groundImage);
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage("gameover",gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage("restart",restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  Oxylevel=10;
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("distance run in kms: "+ score,30,50);
  text("oxygen: "+ Oxylevel,30,70);
 
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      //jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(cloudsGroup.isTouching(trex)){

        powerUpSong.play();
        cloudsGroup.destroyEach();
        Oxylevel=Oxylevel+1; 
        
          
        }
        if(obstaclesGroup.isTouching(trex)){
            collidedSound.play()
            
                obstaclesGroup.destroyEach();
                Oxylevel=Oxylevel-1;

                if(Oxylevel==0){
              
                    gameState = END;
                    gameOver.visible = true;
                    restart.visible = true;
                  }

  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
   // trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
} 
  drawSprites();
}

function spawnClouds() {
    //write code here to spawn the clouds
      
     if (frameCount % 600 === 0) {
     var cloud = createSprite(600,height-40,40,10);
     cloud.y = random(height-160,height-100);
     cloud.velocityX = -6;
    cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.lifetime = 300;
      //cloud.velocityX = -3;
      
       //assign lifetime to the variable
      cloud.lifetime = 300;
      
      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth+1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
    
  }
  
  
  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,height-95,20,30);
      obstacle.setCollider('circle',0,0,45)
      // obstacle.debug = true
    
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        default: break;
      }
      
      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.6;
      obstacle.lifetime = 300;
      obstacle.depth = trex.depth;
      trex.depth +=1;
      //add each obstacle to the group
      obstaclesGroup.add(obstacle);
    }
  }
  

  function reset(){
  
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.visible=true;
    //trex.loadImage("running",trexImg);
    trex.addAnimation('walker', sequenceAnimation);
    score = 0;
    Oxylevel=10;
  }
  