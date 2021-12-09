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
		res.send(json2html.transform(req.result, transform));
		return;
		}
		else if (req.result) {
		res.send(req.result);
		}
		else {
		 next();
		}
	};
};
