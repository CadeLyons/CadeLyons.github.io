const json2html = require('node-json2html');

module.exports = function() {
	return function (req, res, next) {
		// TODO 2: Create the converter function
		let transform = {'<>': 'div', 'html': [
    			{'<>': 'p', 'html': [
        			{'<>': 'b', 'html': 'name: '},
        			{'<>': 'p', 'html': '${name}'}
    			]},
    			{'<>': 'p', 'html': [
        			{'<>': 'b', 'html': 'description: '},
        			{'<>': 'p', 'html': '${description}'}
    			]},
    			{'<>': 'p', 'html': [
        			{'<>': 'b', 'html': 'value: '},
        			{'<>': 'p', 'html': '${value}'}
    			]}
		]};
		if (req.accepts('html')){ 
		        console.log("sending html");
                        let response = json2html.transform(req.result, transform);
                        let links = generateLinks(req.links);

                        res.send(response + links);
		        //res.send(json2html.transform(req.result, transform));
		        return;
		}
		else if (req.result) {
		        res.send(req.result);
		}
		else {
		        next();
		}
		function generateLinks(linkList) { 
		        var html = "<h4>Links</h4>"
		        for (var link in linkList) {
		                var html = html + "<a href="+linkList[link]+">"+link+"</a><br>";
		        }
		        return html;
		}
	};	
};
