// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads and is where you should call your functions.
$(document).ready(function(){
    const $display = $('#display');

    // TODO: Call your apply function(s) here
    applyFilterNoBackground(reddify);
    applyFilter(increaseGreenByBlue);
    applyFilterNoBackground(decreaseBlue);
    //applyFilterNoBackground(blackAndWhite);



    render($display, image);
});

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO: Create the applyFilter function here
function applyFilter(filterFunction) {
    for (var i = 0; i < image.length; i++) {
        for (var y = 0; y < image[i].length; y++) {
            var rgbString = image[i][y]; //grabs the string from the 2D array.
            var rgbNumbers = rgbStringToArray(rgbString); //"red,green,blue" is what the string is now
            filterFunction(rgbNumbers); //the filter function called changes the value of the string. reddify would be "255, green, blue"
            var rgbString2 = rgbNumbers; //stores the new string
            image[i][y] = rgbArrayToString(rgbString2); //updates the 2D array with the new value
        }
    }
}
function applyFilterNoBackground(filterFunction) {
    var backgroundColor = image[0][0]; //grabs the top left corner of the image and assumes that is the background color.
    for (var i = 0; i < image.length; i++) {
        for (var y = 0; y < image[i].length; y++) {
            var rgbString = image[i][y]; //grabs the string from the 2D array.
            if (rgbString !== backgroundColor) {              //checks if rgbString is not equal to background color, if it is the function does not run
                var rgbNumbers = rgbStringToArray(rgbString); //"red,green,blue" is what the string is now
                filterFunction(rgbNumbers); //the filter function called changes the value of the string. reddify would be "255, green, blue"
                var rgbString2 = rgbNumbers; //stores the new string
                image[i][y] = rgbArrayToString(rgbString2); //updates the 2D array with the new value
            }
        }
    }
}

// TODO: Create the applyFilterNoBackground function


// TODO: Create filter functions

//simply makes the red value 255
function reddify(array) {
    array[RED] = 255;
}
//decreases the blue value by 50
function decreaseBlue(array) {
    var blue = Math.max(0, array[BLUE] - 50); //This variable stores what the value of blue - 50 is, if it is less than 0, then the value is 0
    array[BLUE] = blue; //sets the value of blue to the variable's value.
}
//increases green by the value of blue.
function increaseGreenByBlue(array) {
    array[GREEN] = array[GREEN] + array[BLUE]; //this adds the blue value to green
    array[GREEN] = Math.min(255, array[GREEN]); //this makes sure that value is not over 255
}
//turns the image black and white, was curious if I could do this
function blackAndWhite(array) {
    rgbTotal = array[GREEN] + array[BLUE] + array[RED]; //this combines the 3 rgb values into one total for the if statement to use
    //if the total is over half of 255 x 3, the color is turned to white
    if (rgbTotal >= 382) {
        array[GREEN] = 255
        array[BLUE] = 255
        array[RED] = 255
    }
    //anything lower than 382 and the color is turned to black
    else {
        array[GREEN] = 0
        array[BLUE] = 0
        array[RED] = 0
    }
}

// CHALLENGE code goes below here


//To be deleted, theory for todo 5, grab the top left pixel, very first part of the image array, then store it as a variable maybe use stringtoarray function
//then compare that variable to whatever i am trying to apply a filter to, something like if(topleft === currentsquare) { do not run function} else { run function}