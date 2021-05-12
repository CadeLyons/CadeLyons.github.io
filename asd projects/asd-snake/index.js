/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 10;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  // the object KEY is so I don't have to use magic numbers, don't wanna have to remember these numbers. arrow keys may not be used
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
  var snakeHead = factoryFunction("#snakeHead");
  var apple = factoryFunction("#apple");
  var snakeArray = [];
  snakeArray.push(snakeHead);

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $("#easy").on('click', titleScreen);                                //When a button is clicked it calls the titlescreen function which starts the game in either normal or 'lunatic' mode
  $("#lunatic").on('click', titleScreen2);
  $('#badapplebutton').on('click', badAppleHandler);
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
    return tempObj
  }
  var pauser = 1;               //Pauser works with the newFrame function, when it's set to 1, the game pauses, when its set to 0, the game resumes. Its not in the Constant Variables section because its not a constant variable, just a regular variable.
  var stopcriminalscum = 0;     //stopcriminalscum stops criminals from reversing the snake by exploiting 2 keyboard buttons. The variable only gets set to 0 on the next frame, and the function sets it to 1 every time it runs, so the function can only run once per frame, this does not allow 2 key presses in 1 frame.
  var lunatic = 0;              //If lunatic is set to 1, then hard mode is activated, causing the bullet functions to exist and be used. in case you were wondering, yes, "Snake Project" is a reference to a bulletheck game. 
  var badapple = 0;             //For bad apple mode, at first its set to 1, then it changes when the snake collects the apple.
  var bulletpattern1            //Have to set these variables up here otherwise the function to clear the bulletpattern intervals would not work
  var bulletpattern2
  var bulletpattern3
  var bullets = []              //need an array to store the bullets
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    if (pauser === 0) {
        handleCollisions();
        updateSnakeBody();
        updateGameItems();
        border();
        stopcriminalscum = 0
    }
    //for lunatic/snake project mode, calls bullet-related functions that need to be constantly updated, doesn't get called if snake project difficulty isn't selected.
    if (lunatic === 1) {
        for (var i = 0; i < bullets.length; i++) {
            updateBullets(bullets[i])
        }
        removeStrayBullets();
        handleSnakeBulletCollide();
    }
    //below is for bad apple mode, it changes the bullets colors because i can't assign them a different class without messing up the bullet shapes themselves.
    if (badapple === 1) {
        $(".bullet2").css("background-color","white");
        $(".bullet1").css("background-color","white");
    }
    else if (badapple === 2) {
        $(".bullet2").css("background-color","black");
        $(".bullet1").css("background-color","black");
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
    $('#board').text("Game over! Refresh the page to restart");
    clearInterval(interval);
    if (lunatic === 1) {
        clearInterval(randomPatternInterval);
    }
    // turn off event handlers
    $(document).off();
  }
  //the function below draws the snake head and snake body/tail, so that way when they move the player can see where they are. without it the position could change, but it would not be visible.
  function updateGameItems() {
    snakeHead.x += snakeHead.speedX
    snakeHead.y += snakeHead.speedY
    $('#snakeHead').css("left", snakeHead.x);
    $('#snakeHead').css("top", snakeHead.y);
    $('#score').text("score: " + snakeHead.score);
  }
  //the function below handles key down events. When you press W it checks to see if the snake is moving along the y axis and if it isn't the snake stops moving on the x axis and starts moving upward.
  function handleKeyDown(event) {
    if (stopcriminalscum === 0) {
        if (event.which === KEY.W) {
            if (snakeHead.speedY === 0) {
                stopcriminalscum = 1
                snakeHead.speedX = 0
                snakeHead.speedY = -20
            }
        }
        if (event.which === KEY.S) {
            if (snakeHead.speedY === 0) {
                stopcriminalscum = 1
                snakeHead.speedX = 0
                snakeHead.speedY = 20
            }
        }
        if (event.which === KEY.A) {
            if (snakeHead.speedX === 0) {
            stopcriminalscum = 1
            snakeHead.speedY = 0
            snakeHead.speedX = -20
            }
        }
        if (event.which === KEY.D) {
            if (snakeHead.speedX === 0) {
            stopcriminalscum = 1
            snakeHead.speedY = 0
            snakeHead.speedX = 20
            }
        }
    }   
  }
  //This function handles snake-wall collisions, keeps those pesky snakes from getting past the fence.  
  function border() {
    if (snakeHead.x >= 440) {
        endGame()
    }
    if (snakeHead.x < 0) {
        endGame()
    }
    if (snakeHead.y < 0) {
        endGame()
    }
    if (snakeHead.y >= 440) {
        endGame()
    }
  }
  //This function handles the title screen, it works with pauser to turn it off and on.
  function titleScreen() {
    $(".remove").hide()
    pauser = 0;
    moveApple();
  }
  //This function below handles the title screen but sets the game to lunatic difficulty. Is triggered upon clicking the "Snake Project" button.
  function titleScreen2() {
    $(".remove").hide();
    pauser = 0;
    lunatic = 1;
    moveApple();
    randomPatternInterval = setInterval(randomPattern, 20000);   //This would be in one time setup, but i didn't want bullets flying at you if you just sat on the title screen.
  }
  //This function handles collisions for apple-snake and snakehead-snakebody. I had to set I to 2 for the snake collisions otherwise you would die upon touching the first apple.
    function handleCollisions() {
      if ((snakeHead.x === apple.x) && (snakeHead.y === apple.y)) {
        snakeHead.score += 1;
        createNewSnake();
        moveApple();
        //the code below in the if statements is for bad apple mode, whenever the snake grabs the apple everything black turns white, and everything white turns black. (this is a reference to something called "bad apple" with a similar status to the "can it run doom?" meme)
        if (badapple === 1) {
            $('.badapple1').css("background-color", "black");
            $('.badapple2').css("background-color", "white");
            $('#apple').attr('src', 'Images/BlackApple.png');
            $('#score').css('color', 'black');
            $('#board').css('border', "1px solid black");
            badapple = 2
        }
        else if (badapple === 2) {
            $('.badapple1').css("background-color", "white");
            $('.badapple2').css("background-color", "black");
            $('#apple').attr('src', 'Images/WhiteApple.png');
            $('#score').css('color', 'white');
            $('#board').css('border', "1px solid white");
            badapple = 1
        }
      }
      //the code below checks if the snake head touches the snake body. 
      for (var i = 2; i < snakeArray.length; i++) {
        if (snakeHead.x === snakeArray[i].x && snakeHead.y === snakeArray[i].y) {
            endGame();
        }
      }
    }
    //The three functions below are for creating the snake body 
    function createNewSnake() {
        var nextId = "snakePiece" + snakeArray.length;
        var $snake = $('<div>').attr("id", nextId).addClass("snakeBody").appendTo("#board");
        var newSnake = snakeBodyFactory('#' + nextId);
        snakeArray.push(newSnake);
    }
    function snakeBodyFactory($id) {
        tempObj = {
        id : $id,
        x : snakeArray[snakeArray.length - 1].x,
        y : snakeArray[snakeArray.length - 1].y,
        }
    return tempObj
  }
    function updateSnakeBody() {
        for (var n = snakeArray.length - 1; n > 0; n--) {
            snakeArray[n].x = snakeArray[n - 1].x
            snakeArray[n].y = snakeArray[n - 1].y
            $(snakeArray[n].id).css("left", snakeArray[n].x);
            $(snakeArray[n].id).css("top", snakeArray[n].y);
        }
    }   
    //code below is for moving the apple, it ensures the apple doesn't land on the snake.
    function moveApple() {
        var gridX = randomInteger(22);
        var gridY = randomInteger(22);
        
        var locationX = gridX * 20;
        var locationY = gridY * 20;
  
        apple.x = locationX;
        apple.y = locationY;
  
        for (var i = 0; i < snakeArray.length; i++) {
            if (doCollide(apple, snakeArray[i])) {
                moveApple();
                return;
            }
        }
        $("#apple").css("top", apple.y);
        $("#apple").css("left", apple.x);
    }

    function randomInteger(max) {
        var randomInt = Math.floor(Math.random() * max);
        return randomInt;
    }
    //the doCollide function is for checking if the apple will end up on the snake, it is not for checking collision between the snake and apple or the snake and bullets.
    function doCollide(obj1, obj2) {
        if (obj1.x === obj2.x && obj1.y === obj2.y) {
            return true;
        }
        else {
            return false;
        }
    }
    //below is code for "lunatic" difficulty and a little extra at the bottom.
    //Gets pretty messy I wasn't sure if creating one factory function type thing would work for 4 different bullet patterns so instead I made seperate ones for each bullet type.
    //Below are the 2 functions for bullet type 1, Long blue lines that go straight down
    function createNewBullet1(xPos) {
        var nextId = "bullet1" + bullets.length;
        var $newBullet1 = $('<div>').attr("id", nextId).addClass("bullet1").appendTo("#board");
        var newBullet1 = bullet1Factory('#' + nextId, xPos);
        bullets.push(newBullet1);
    }
    function bullet1Factory($id, xPos) {
        tempObj = {
        id : $id,
        x : xPos,
        y : -80,
        width : $($id).width(),
        height : $($id).height(),
        speedX : 0,
        speedY : 10,
        }
    return tempObj
  }
    //Below are the 2 functions for bullet type 2, Yellow squares that can go in any direction.
    function createNewBullet2(xPos, yPos, xSpeed, ySpeed) {
        var nextId = "bullet2" + bullets.length;
        var $newBullet2 = $('<div>').attr("id", nextId).addClass("bullet2").appendTo("#board");
        var newBullet2 = bullet2Factory('#' + nextId, xPos, yPos, xSpeed, ySpeed);
        bullets.push(newBullet2);
    }
    function bullet2Factory($id, xPos, yPos, xSpeed, ySpeed) {
        tempObj = {
        id : $id,
        x : xPos,
        y : yPos,
        width : $($id).width(),
        height : $($id).height(),
        speedX : xSpeed,
        speedY : ySpeed,
        }
    return tempObj
  }
    //this function updates the bullets, I didn't make it part of the original update function because this function requires iteration.
    function updateBullets(bullet) {
          bullet.y += bullet.speedY;
          bullet.x += bullet.speedX;
          $(bullet.id).css("left", bullet.x);
          $(bullet.id).css("top", bullet.y);
    }
    //bulletwave1 function, it used the createNewBullet1 function to create 4 lines of projectiles going down on the board, combined with setInterval it creates several of these with gaps between them.
    function bulletwave1() {
        createNewBullet1(50);
        createNewBullet1(150);
        createNewBullet1(270);
        createNewBullet1(370); 
    }
    //bulletwave2 function, it uses the createNewBullet2 function to create a circle of squares, then bulletwave2helper creates a 2nd circle to fill in the gaps 3 seconds after, both circles close in to the middle.
    //This one took way too long, it is hard to create a good cirle, then I realized I could of just put the squares in the center with the same speed just in different directions, then open the debugger and pause when they are a good distance from the board. if only i realized this before i had already created the function
    function bulletwave2() {
        createNewBullet2(-50, -50, 5, 5); //top left (5, 5) these numbers are here because I had to set the speed to 0 a few times while making the function
        createNewBullet2(-100, 210, 6, 0); //middle left (6, 0)
        createNewBullet2(-50, 470, 5, -5); //bottom left (5, -5)
        createNewBullet2(210, 520, 0, -6); //bottom middle (0, -6)
        createNewBullet2(470, 470, -5, -5); //bottom right (-5, -5)
        createNewBullet2(520, 210, -6, 0); //middle right  (-6, 0)
        createNewBullet2(470, -50, -5, 5); //top right (-5, 5)
        createNewBullet2(210, -100, 0, 6); //top middle (0, 6)
        setTimeout(bulletwave2helper, 2000);
    }
    function bulletwave2helper() {
        createNewBullet2(-75, 80, 5, 2.5); //between top left and middle left
        createNewBullet2(-75, 340, 5, -2.5); //between middle left and bottom left
        createNewBullet2(80, 495, 2.5, -5); //between bottom left and bottom middle
        createNewBullet2(340, 495, -2.5, -5); //between bottom middle and bottom right
        createNewBullet2(495, 340, -5, -2.5); //between bottom right and middle right
        createNewBullet2(495, 80, -5, 2.5); //between middle right and top right
        createNewBullet2(340, -75, -2.5, 5); //between top right and top middle
        createNewBullet2(80, -75, 2.5, 5); //between top middle and top left
    }
    //bulletwave3 function, it also uses the createNewBullet2 function this time it creates 4 waves of bullets. 1 wave comes from the top left, at the same time one comes from bottom right, and after those launch 2 more launch from the sides instead, top left side and bottom right side.
    //There are snake-sized holes between the bullets in each wave.
    function bulletwave3() {
        for (var i = 0; i <= 440; i += 40) {
            if (i < 220) {
                setTimeout(createNewBullet2, i * 10, i, -30, 0, 10);
            }
            else if (i > 220) {
                setTimeout(createNewBullet2, i * 10, 470, i, -10, 0);
            }
        }
        for (var i = 440; i >= 0; i -= 40) {
            if (i > 220) {
                setTimeout(createNewBullet2, 4400 - i * 10, i, 470, 0, -10);
            }
            if (i < 220) {
                setTimeout(createNewBullet2, 4400 - i * 10, -30, i, 10, 0);
            }
        }
    }
    //bulletwave4 function, the final one i made, it uses the createNewBullet2 function again (rip createNewBullet1 only existed for the 1st bulletwave) to create 9 bullets condensed into one, which then spreads out into a square-ish pattern, It doesn't need to be set into an interval to last 15 seconds.
    function bulletwave4() {
        bulletwave4helper2(220);
        setTimeout(bulletwave4helper, 3000, 0);
        setTimeout(bulletwave4helper2, 3001, 110);
        setTimeout(bulletwave4helper, 6000, 0);
        setTimeout(bulletwave4helper2, 6001, 330);
        setTimeout(bulletwave4helper, 9000, 0);
        setTimeout(bulletwave4helper2, 9001, 110); //it would appear the timer is over 9000
        setTimeout(bulletwave4helper2, 9001, 330);
        setTimeout(bulletwave4helper, 12000, 0);
        setTimeout(bulletwave4helper, 12000, 8);
    }
    //couldn't think of a way to iterate this function, but still works how i originally wanted it to (almost gave up on 2 exploding squares at the end but then i thought of the amount parameter)
    function bulletwave4helper(amount) {
        bullets[bullets.length - 1 - amount].speedX = 5
        bullets[bullets.length - 1 - amount].speedY = 5
        bullets[bullets.length - 2 - amount].speedX = -5
        bullets[bullets.length - 2 - amount].speedY = 5
        bullets[bullets.length - 3 - amount].speedX = 5
        bullets[bullets.length - 3 - amount].speedY = -5
        bullets[bullets.length - 4 - amount].speedX = -5
        bullets[bullets.length - 4 - amount].speedY = -5
        bullets[bullets.length - 5 - amount].speedX = 0
        bullets[bullets.length - 5 - amount].speedY = -5
        bullets[bullets.length - 6 - amount].speedX = 5
        bullets[bullets.length - 6 - amount].speedY = 0
        bullets[bullets.length - 7 - amount].speedX = -5
        bullets[bullets.length - 7 - amount].speedY = 0
        bullets[bullets.length - 8 - amount].speedX = 0
        bullets[bullets.length - 8 - amount].speedY = 5
    }
    //creates the condensed bullets and makes it easy for me to choose where they spawn.
    function bulletwave4helper2(xPos) {
        for (i = 0; i < 8; i++) {
        createNewBullet2(xPos, -50, 0, 10)
        }
    }
    //This function removes any bullets that stray to far from the board, I am pretty sure if the bullets existed infintely, eventually the game would crash or become to laggy to play.
    function removeStrayBullets() {
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].y > 600 || bullets[i].y < -600 || bullets[i].x > 600 || bullets[i].x < -600) {
                $(bullets[i].id).remove();
            }
        }
    }
    //this function chooses a random bullet pattern out of the 4 patterns created.
    function randomPattern() {
        var randomNum = Math.random();
        if (randomNum < 0.25) {
            console.log(1);
            bulletpattern1 = setInterval(bulletwave1, 1500);
            setTimeout(clearBulletIntervals, 15000);
        }
        else if (randomNum < 0.50) {
            console.log(2);
            bulletpattern2 = setInterval(bulletwave2, 4000);
            setTimeout(clearBulletIntervals, 15000);
        }
        else if (randomNum < 0.75) {
            console.log(3);
            bulletpattern3 = setInterval(bulletwave3, 5000);
            setTimeout(clearBulletIntervals, 15000);
        }
        else {
            console.log(4);
            bulletwave4();
        }
    }
    //this function stops a bullet pattern from continuing, it is called in the randomPattern function 15 seconds after a bullet pattern is called.
    function clearBulletIntervals() {
        clearInterval(bulletpattern1);
        clearInterval(bulletpattern2);
        clearInterval(bulletpattern3);
    }
    //The doCollide function from pong, detects if the snake and the bullet are touching.
    function doCollide(square1, square2) {
    //below sets up the variables that help the function detect a snake-bullet collision.
        square1.leftX = square1.x;
        square1.topY = square1.y;
        square1.bottomY = square1.y + square1.height;
        square1.rightX = square1.x + square1.width;
    //split square1 and square2 vars for organization purposes.
        square2.leftX = square2.x;
        square2.topY = square2.y;
        square2.bottomY = square2.y + square2.height;
        square2.rightX = square2.x + square2.width;
    //turns out snakes are not very resistant to projectiles, so if the snake touches one, the game ends.
    if ((square1.leftX < square2.rightX) && (square1.rightX > square2.leftX) && (square1.topY < square2.bottomY) && (square1.bottomY > square2.topY)) {
      endGame();
    }
  }
  //This function just iterates the doCollide function that way i can check if the snake head and bullets are colliding.
  function handleSnakeBulletCollide() {
      for (var i = 0; i < bullets.length; i++) {
          doCollide(snakeHead, bullets[i]);
      }
  }
  //function below handles the player clicking the bad apple mode button.
  function badAppleHandler() {
      if (badapple === 0) {
          $('#badappletext').text('Bad Apple Mode: ON') //can it play bad apple? yes but actually no, but it can change colors
          badapple = 1
      }
      else if (badapple === 1) {
          $('#badappletext').text('Bad Apple Mode: OFF') //can it run doom? no
          badapple = 0
      }
  }
}
