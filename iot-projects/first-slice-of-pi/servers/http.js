const sensorRoutes = require('./../routes/sensors');
var actuatorRoutes = require('./../routes/actuators');
const express = require('express'),
	cors = require('cors');
const app = express();

app.use(cors());
app.use('/pi/sensors', sensorRoutes);
app.use('/pi/actuators', actuatorRoutes);

module.exports = app;

app.get('/', function(req, res){
    res.send('This is the root not the square root, just the root');
});

app.get('/pi', function(req, res){
    res.send('No, this is patr- I mean pi');
});



// I have looked through all files