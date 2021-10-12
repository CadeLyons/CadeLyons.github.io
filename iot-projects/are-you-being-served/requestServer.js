// requestServer.js file

const http = require("http");
const request = require("request");
const port = 9155;

var args = process.argv.slice(2);

http.createServer(function(req, res) {
    var url = args[0] ? args[0] : "<a default url>";
    request(url, function(error, response, body) {
        if (!body || !response || (error === null && response.statusCode !== 200)){
            res.end("bad URL\n");
            return;
        }
        if (response.statusCode === 200 && !error === true) {
            res.writeHead(200, {"Content-Type" : "text/html"})
            res.write(body);
            res.end();
        }
        else {
            res.writeHead(response.statusCode, {"Content-Type" : "text/plain"})
            const errorString = error.toString()
            res.write(errorString);
            res.end();
        }
    })
}).listen(9155);
