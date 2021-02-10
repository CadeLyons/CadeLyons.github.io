/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // var KEY holds data for all the keys so that I don't have to type 13, 37, 38, 39, 40, etc every single time i need to mess with movement, its easier to remember KEY_ENTER instead of 13
  var KEY = {
      "ENTER": 13,
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
  var positionX = 390;  //how far right the box is
  var positionY = 390;  // how far down the box is
  var speedX = 0;     // how fast the box is moving towards the right, or if it's a negative number to the left
  var speedY = 0;     // how fast the box is moving down, or if it's a negative number how fast it moves up
  var speedX2 = 0;    // all values with 2 at the end is for box 2, they do the same as box 1 but for the 2nd box
  var speedY2 = 0;
  var positionX2 = 0;  //the values of the 1st and 2nd box are different so that they spawn in different corners, I made the first box spawn on the side with arrow keys and 2nd box spawn on the side with WASD
  var positionY2 = 0;

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);                               // calls the handleKeyUp function to handle 'keyup' events
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionGameItem();            
    redrawGameItem();
    border();
// these two functions are put in newFrame() so that the box's position gets constantly updated and redrawn.
  }

  /* 
  Called in response to events.
  */
 //handles arrow keys and the enter key being pushed down, if a key is clicked it changes the speed the box is moving, thus moving the box. for enter it logs to the console
  function handleKeyDown(event) {
    if (event.which === KEY.ENTER) {
        console.log("enter pressed");
    }
    else if (event.which === KEY.LEFT) {
        speedX = -5;
    }
    else if (event.which === KEY.RIGHT) {
        speedX = 5;
    }
    else if (event.which === KEY.DOWN) {
        speedY = 5;
    }
    else if (event.which === KEY.UP) {
        speedY = -5;
    }
    // below are the key down events for box 2
    if (event.which === KEY.A) {
        speedX2 = -5;
    }
    else if (event.which === KEY.D) {
        speedX2 = 5;
    }
    else if (event.which === KEY.S) {
        speedY2 = 5;
    }
    else if (event.which === KEY.W) {
        speedY2 = -5;
    }
  }
  //handles arrow keys and the enter key being released, if a key is released the speed is set to 0 so that the box doesn't move out of control. for enter it logs to the console
  function handleKeyUp(event) {
    if (event.which === KEY.ENTER) {
        console.log("enter released");
    }
    else if (event.which === KEY.LEFT) {
        speedX = 0;
    }
    else if (event.which === KEY.RIGHT) {
        speedX = 0;
    }
    else if (event.which === KEY.DOWN) {
        speedY = 0;
    }
    else if (event.which === KEY.UP) {
        speedY = 0;
    }
    //below are the key up events for box 2
    if (event.which === KEY.A) {
        speedX2 = 0;
    }
    else if (event.which === KEY.D) {
        speedX2 = 0;
    }
    else if (event.which === KEY.S) {
        speedY2 = 0;
    }
    else if (event.which === KEY.W) {
        speedY2 = 0;
    }
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
    // updates the position of the boxes on either the x or y axis positionX + speedX over and over causes it to move speedX (5 pixels) every tick in that direction
  function repositionGameItem() {
      positionX += speedX;
      positionY += speedY;
      positionX2 += speedX2;
      positionY2 += speedY2;
  } 
    // redraws the box so it can move on the screen based off the positionX and positionY values, the box is "positionY pixels away from the top" or "positionX pixels away from the left"
  function redrawGameItem() {
      $('#gameItem').css("left", positionX);
      $('#gameItem').css("top", positionY);
      $('#gameItem2').css("left", positionX2);
      $('#gameItem2').css("top", positionY2);
  }
  // prevents boxes from leaving the border, detects if it's position is over or under a number close to the board's width and height and if it is then the box is teleported to the edge of the board
  //reason the number is only close to the board's width and height is because when it is exact the box is easily seen going out of bounds, with these numbers only an inch of the box goes out of bounds
  function border() {
      if(positionX > 390) {
            positionX = 390;
        }
      if(positionX < 0) {
            positionX = 0;
        }
      if(positionY < 0) {
            positionY = 0;
        }
      if(positionY > 390) {
          positionY = 390;
      }
      // below is the half of the function that affects box 2
      if(positionX2 > 390) {
            positionX2 = 390;
        }
      if(positionX2 < 0) {
            positionX2 = 0;
        }
      if(positionY2 < 0) {
            positionY2 = 0;
        }
      if(positionY2 > 390) {
          positionY2 = 390;
      }
  }
}
