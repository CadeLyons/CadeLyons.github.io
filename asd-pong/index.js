/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
//wasn't sure if putting the variable that affects whether the game is paused or not inside the function was a good idea or not so it's just kind of here for now.

function runProgram() {

  
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // the object KEY is so I don't have to use magic numbers, don't wanna have to remember these numbers. RIGHT, LEFT, A, and D will probably not be used paddles don't move sideways.
  var KEY = {
      "ESC": 27,
      "LEFT": 37,
      "UP": 38,
      "RIGHT": 39,
      "DOWN": 40,
      "W": 87,
      "A": 65,
      "S": 83,
      "D": 68
  }
  
  // Game Item Objects
//all of the variables below are for the game items, it makes it easier to edit and keep track of the paddles or box.
var paddleL = factoryFunction("#paddleL");
var paddleR = factoryFunction("#paddleR");
var box = factoryFunction("#box");

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           //calls handleKeyDown anytime a key is being pushed down
  $(document).on('keyup', handleKeyUp);                               //calls handleKeyUp anytime a key is no longer being pushed down
  $("button").on("click", startGame);                                 //Allows the start button to start the game
  ballStart();                                                        //gets the ball moving at the start of the game
  //below is the factory function used for setting up the game objects.
  function factoryFunction($id) {
  tempObj = {
    id : $id,
    x : Number($($id).css('left').replace(/[^-\d\.]/g, '')),
    y : Number($($id).css('top').replace(/[^-\d\.]/g, '')),
    width : $($id).width(),
    height : $($id).height(),
    speedX : 0,
    speedY : 0,
    score : 0
  }
  return tempObj;
  }
  var pauser = 1;  //Pauser works with the newFrame function, when it's set to 1, the game pauses, when its set to 0, the game resumes. Its not in the Constant Variables section because its not a constant variable, just a regular variable.
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
   if (pauser === 0) { 
    repositionGameItems();
    drawGameItems();
    border();
    updateScore();
    handleGameEnd();
    doCollide(box,paddleL);
    doCollide(box,paddleR);
   }
  }
  
  /* 
  Called in response to events.
  */
  function handleEvent(event) {

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  //the function below sets the positions of the paddles so that when the speed is 5, it adds 5 to position y on a paddle.
  function repositionGameItems() {
    paddleL.y += paddleL.speedY
    paddleR.y += paddleR.speedY
    box.y += box.speedY
    box.x += box.speedX
  }
  //the function below draws the paddles and box, so that way when they move the player can see where they are. without it the position could change, but it would not be visible.
  function drawGameItems() {
    $('#paddleL').css("top", paddleL.y);
    $('#paddleR').css("top", paddleR.y);
    $('#box').css("top", box.y);
    $('#box').css("left", box.x);
  }
 // the function below handles key down events, so when a key is pushed down the paddles' speed is set to either -5 or 5 depending on whether its going up or down.
 // this function also handles the escape key, which when pressed either sets pauser to 1 or 0, when it is set to 1 the newFrame function stops updating other functions.
  function handleKeyDown(event) {
    if (event.which === KEY.W) {
        paddleL.speedY = -5
        console.log("W Clicked");
    }
    else if (event.which === KEY.S) {
        paddleL.speedY = 5
    }
    if (event.which === KEY.UP) {
        paddleR.speedY = -5
    }
    else if (event.which === KEY.DOWN) {
        paddleR.speedY = 5
    }
    if (event.which === KEY.ESC) {
        if (pauser === 1) {
            pauser = 0;
        }
        else if (pauser === 0) {
            pauser = 1;
        }
    }
  }
  // the function below handles key up events, so when a key is released the paddles' speed is set to 0.
  function handleKeyUp(event) {
    if (event.which === KEY.W) {
         paddleL.speedY = 0
    }
    else if (event.which === KEY.S) {
        paddleL.speedY = 0
    }
    if (event.which === KEY.UP) {
        paddleR.speedY = 0
    }
    else if (event.which === KEY.DOWN) {
        paddleR.speedY = 0
    }
  }
  //this function detects collisions and as of right now detects if a paddle touches a wall.
  function border() {
      //the first part of this function detects if the left or right paddle touches the wall.
      if (paddleL.y >= 340) {
          paddleL.y = 339
      }
      if (paddleL.y <= 1) {
          paddleL.y = 0
      }
      if (paddleR.y >= 340) {
          paddleR.y = 339
      }
      if (paddleR.y <= 1) {
          paddleR.y = 0
      }
      if (box.y <= 1) {
          box.speedY = box.speedY * -1
      }
      if (box.y >= 390) {
          box.speedY = box.speedY * -1
      }
      //these two if statements detect if the ball hits a scoring part of the walls, in which case it gives the proper player 1 point and calls the ballTimer function.
      if (box.x >= 390) {
          ballTimer();
          givePoints(1);
      }
      if (box.x <= 0) {
          ballTimer();
          givePoints(2);
      }
  }
  //Used for getting the ball to move whenever someone gets a point or the game starts
  function ballStart() {
    box.score = " "
    var xpositive = Math.random();
    var ypositive = Math.random();
    if (xpositive < 0.5) {
        box.speedX = Math.random() * 3 + 0.1
    }
    else {
        box.speedX = Math.random() * -3 + -0.1
    }
    if (ypositive < 0.5) {
        box.speedY = Math.random() * 3.1 + 0.1
    }
    else {
        box.speedY = Math.random() * -3.1 + -0.1
    }
  }
  //It gives points to the player who scored, either player 1 or player 2.
  function givePoints(player) {
    if (player === 1) {
        paddleL.score += 1
    }
    if (player === 2) {
        paddleR.score += 1
    }
  }
  //this function updates the score on the scoreboards, was tempted to combine it with drawGameItems and repositionGameItems into updateGameItems.
  //side note, spent a good 10 minutes wondering why I couldn't use a variable, figured out you have to use an object, Why on earth does an object work but not a variable
  function updateScore() {
    $('#scoreL').text(paddleL.score)
    $('#scoreR').text(paddleR.score)
    $('#box').text(box.score)
  }
  //startGame is used for the button to start the game, when the button is clicked it dissapears and the pauser variable is set to 0 causing the game to start.
  function startGame() {
      $("button").hide()
      pauser = 0;
  }
  //the function below handles ball-paddle collisions
  function doCollide(square1, square2) {
    //below sets up the variables that help the function detect a ball-paddle collision.
    square1.leftX = square1.x;
    square1.topY = square1.y;
    square1.bottomY = square1.y + square1.height;
    square1.rightX = square1.x + square1.width;
    //split square1 and square2 vars for organization purposes.
    square2.leftX = square2.x;
    square2.topY = square2.y;
    square2.bottomY = square2.y + square2.height;
    square2.rightX = square2.x + square2.width;
    //below causes the ball to "bounce" off the paddle whenever they collide
    if ((square1.leftX < square2.rightX) && (square1.rightX > square2.leftX) && (square1.topY < square2.bottomY) && (square1.bottomY > square2.topY)) {
      box.speedX = box.speedX * -1.1
    }
  }
  //the function below handles the game ending, when a paddle gets a certain score it displays a message and calls the gameEnd function.
  function handleGameEnd() {
      if (paddleL.score === 6) {
        $('#board').text("Blue paddle wins! Refresh to play again!");
        gameEnd();
      }
      if (paddleR.score === 6) {
        $('#board').text("Blue paddle wins! Refresh to play again!");
        gameEnd();
      }
  }
  //The functions below handle the ball respawning, it resets the ball's position and speed.
  //Each function calls each other with a 1 second timer, and the third function calls ballStart to get the ball moving.
  function ballTimer() {
    box.speedX = 0;
    box.speedY = 0;
    box.x = 195
    box.y = 195
    box.score = 3;
    setTimeout(ballTimer2, 1000);
  }
  function ballTimer2() {
    box.score = 2;
    setTimeout(ballTimer3, 1000);
  }
  function ballTimer3() {
    box.score = 1;
    setTimeout(ballStart, 1000);
  }
}
