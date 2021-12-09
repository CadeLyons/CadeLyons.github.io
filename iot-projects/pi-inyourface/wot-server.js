const httpServer = require('./servers/http'),
	resources = require('./resources/model');
const pirPlugin = require('./plugins/internal/pirPlugin');
const dhtPlugin = require('./plugins/internal/dhtPlugin');
const ledsPlugin = require('././plugins/internal/ledsPlugin');
const wsServer = require("./servers/websockets");

pirPlugin.start({});
dhtPlugin.start({'frequency': 2000});
ledsPlugin.start();

const server = httpServer.listen(resources.pi.port, function () {
	console.log("Running the Pi on port " + resources.pi.port);
	wsServer.listen(server);
});

process.on('SIGINT', function() {
	pirPlugin.stop();
	dhtPlugin.stop();
	ledsPlugin.stop();
	process.exit();
});

