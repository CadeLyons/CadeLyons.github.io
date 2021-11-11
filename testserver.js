const http = require("http");
let port = process.argv[2];

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.write("<h1> A </h1>")
    res.write("<h2> neet</h2>")
    res.end("<p> server! </p>")
}).listen(port);