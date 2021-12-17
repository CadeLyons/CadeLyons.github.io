const createRouter = require('./../routes/automate');
const resources = require('./../resources/model');
const converter = require('./../middleware/converter')
const bodyParser = require('body-parser')

const actuatorRoutes = require('./../routes/actuators');
const express = require('express'),
	cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/pi/actuators', actuatorRoutes);
app.use('/', createRouter(resources));
app.use(converter());

module.exports = app;





// I have looked through all files
