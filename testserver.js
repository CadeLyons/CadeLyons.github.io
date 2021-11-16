const http = require("http");
let port = process.argv[2];

http.createServer(function(req, res) {
    var json2html = require("node-json2html");

    let data = {
        "name": "daniel",
        "age": 34,
    };
    let transform = {
        '<>': 'h1', 'html': [
            {'<>': 'li', 'html': '${name}'}
        ]
    };
    let html = json2html.transform(data, transform);
/*    res.writeHead(200, {"Content-Type": "text/html"})
    res.write("<h1> A </h1>")
    res.write("<h2> neet</h2>") */
    res.end(html.split('><').join('>\n<'));
}).listen(port);