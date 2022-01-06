var onoff = require('onoff');

var Gpio = onoff.Gpio,
  led1 = new Gpio(16, 'out'),
  led2 = new Gpio(21, 'out'),
  led3 = new Gpio(20, 'out'),
  interval;
led1.write(1);
interval = setInterval(function () {
  if (led3.readSync() === 1) {
        led1.write(1, function() {
                led3.write(0);
        })
  }
  else if (led1.readSync() === 1) {
        led2.write(1, function() {
                led1.write(0);
        })
  }
  else if (led2.readSync() === 1) {
        led3.write(1, function() {
                led2.write(0);
        })
  }
}, 660);

process.on('SIGINT', function () {
  clearInterval(interval);
  led1.writeSync(0); 
  led1.unexport();
  led2.writeSync(0);
  led2.unexport();
  led3.writeSync(0);
  led3.unexport();
  console.log('Bye, bye!');
  process.exit();
});

