var sensorLib = require('node-dht-sensor');
var onoff = require('onoff');

var Gpio = onoff.Gpio,
  led1 = new Gpio(16, 'out'),
  led2 = new Gpio(21, 'out'),
  interval2;

sensorLib.initialize(22, 17); 
var interval = setInterval(read, 2000);

//shows temperature in console
function read() {
  var readout = sensorLib.read();
  console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ');
};
//uses temperature to detect when LEDs turn on, LED 2 turns on at a higher temperature than LED 1
interval2 = setInterval(function () {
  var value1 = led1.readSync();
  var value2 = led2.readSync();
  var temp = sensorLib.read();
// if temp is higher than 21C and LED 1 is off, LED 1 gets turned on, if LED 1 is turned on and temperature goes below 21, LED 1 is turned off.
  if (temp.temperature.toFixed(2) > 21 && value1 === 0) {
    led1.write(1, function() {
        console.log("Changed LED 1 state to: 1");
    });
  }
  else if (temp.temperature.toFixed(2) < 21 && value1 === 1) {
    led1.write(0, function() {
        console.log("Changed LED 1 state to: 0")
      });
  }
// if temp is higher than 23C and LED 2 is off, LED 2 gets turned on, if LED 2 is turned on and temperature goes below 23, LED 2 is turned off.
  if (temp.temperature.toFixed(2) > 23 && value2 === 0) {
    led2.write(1, function() {
        console.log("Changed LED 2 state to: 1");
    });
  }
  else if (temp.temperature.toFixed(2) < 23 && value2 === 1) {
    led2.write(0, function() {
        console.log("Changed LED 2 state to: 0")
    });
  }
}, 1000);

process.on('SIGINT', function () {
  clearInterval(interval2);
  clearInterval(interval);
  led1.writeSync(0); 
  led1.unexport();
  led2.writeSync(0);
  led2.unexport();
  console.log('Bye, bye!');
  process.exit();
});