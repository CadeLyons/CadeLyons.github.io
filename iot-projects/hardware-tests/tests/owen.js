var onoff = require('onoff');

var Gpio = onoff.Gpio,
  led1 = new Gpio(16, 'out'),
  led2 = new Gpio(21, 'out'),
  interval;

interval = setInterval(function () {
  for (i = 0, i < 4; i++;) {
    if (i % 2 === 0) {
      setTimeout(function () {led1.write(1, function() {
        console.log("Changed LED 1 state to: " + 1);
      })}, 250 * i);
    }
    else {
      setTimeout(function () {led1.write(1, function() {
        console.log("Changed LED 1 state to: " + 1);
      })}, 250 * i);
    }
  }
}, 1001);

process.on('SIGINT', function () {
  clearInterval(interval);
  led1.writeSync(0); 
  led1.unexport();
  led2.writeSync(0);
  led2.unexport();
  console.log('Bye, bye!');
  process.exit();
});

