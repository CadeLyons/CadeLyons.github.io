/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
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
var paddleL = {
    x : 50,
    y : 170,
    speedY : 0,
    speedX : 0
}
var paddleR = {
    x : 380,
    y : 170, 
    speedY : 0,
    speedX : 0
}
var box = {
    x : 195,
    y : 195,
    speedY : 0,
    speedX : 0
}

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp); 
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionGameItems();
    drawGameItems();
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
  }
  //the function below draws the paddles and box, so that way when they move the player can see where they are. without it the position could change, but it would not be visible.
  function drawGameItems() {
    $('#paddleL').css("top", paddleL.y);
    $('#paddleR').css("top", paddleR.y);
  }
 // the function below handles key down events, so when a key is pushed down the paddles' speed is set to either -5 or 5 depending on whether its going up or down.
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
  function border() {
      if (paddleL.y === )
  }
}
