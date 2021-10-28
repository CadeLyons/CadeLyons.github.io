var onoff = require('onoff');

var Gpio = onoff.Gpio,
  led1 = new Gpio(16, 'out'),
  led2 = new Gpio(21, 'out'),
  interval;

//owen.js makes the lights blink fast, blink slow for a second then repeats, may or may not reference the opening part of music from a video game.
interval = setInterval(function () {
  //part 1, fast blinking (4 blinks) (600 ticks, 150 * 4)
  for (let i = 0; i < 4; i++) {
    if (i % 2 === 0) {
      setTimeout(function () {
	      led1.write(1, function() {
        	console.log("Changed LED 1 state to: 1");
      	})
	      led2.write(0, function() {
        	console.log("Changed LED 2 state to: 0");
      	})
      }, 150 * i);
    }
    else if (i % 2 != 0) {
      setTimeout(function () {
	      led2.write(1, function() {
        	console.log("Changed LED 2 state to: 1");
        });
	      led1.write(0, function() {
		      console.log("Changed LED 1 state to: 0");
	      });
      }, 150 * i);
      
    }
  }
  //part 2, slower blinking (4 blinks (looks like 3)) (1200 ticks, 300 * 4)
  setTimeout(part2, 600)
  function part2 () {
    for (let i = 0; i < 4; i++) {
      if (i % 2 === 0) {
        setTimeout(function () {
	        led1.write(1, function() {
        	  console.log("Changed LED 1 state to: 1");
      	  })
	        led2.write(0, function() {
        	  console.log("Changed LED 2 state to: 0");
      	  })
        }, 300 * i);
      }
      else if (i % 2 != 0) {
        setTimeout(function () {
	        led2.write(1, function() {
        	  console.log("Changed LED 2 state to: 1");
          });
	        led1.write(0, function() {
		        console.log("Changed LED 1 state to: 0");
	        });
        }, 300 * i);
      }
    }
  }
}, 1800);
//1800 ticks for interval comes from combined total ticks (600 + 1200 = 1800).
process.on('SIGINT', function () {
  clearInterval(interval);
  led1.writeSync(0); 
  led1.unexport();
  led2.writeSync(0);
  led2.unexport();
  console.log('Bye, bye!');
  process.exit();
});
