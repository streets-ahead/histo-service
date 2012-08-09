var Canvas = require('canvas'),
	http = require('http'),
	util = require('util'),
	url = require('url');

var HEIGHT = 25;
var WIDTH = 20;
var DEFAULT_COLOR = "rgba(50, 50, 50, 1.000)";

function render(canvas, numbers, color) { 
	ctx = canvas.getContext('2d');
	
	var biggestNumber = Math.max.apply(null, numbers);
	var currentX = 10 + WIDTH/2;
	var lineHeight = 0;
	
	ctx.lineWidth = WIDTH;
	ctx.strokeStyle = color;
	
	ctx.beginPath();
	ctx.moveTo(currentX, HEIGHT + 10);

 	numbers.forEach(function(it, ind) {
		lineHeight = (HEIGHT+10) - (HEIGHT * (it / biggestNumber));
		ctx.lineTo(currentX, lineHeight);
		currentX += WIDTH;
		ctx.moveTo(currentX, HEIGHT + 10);
	});
	ctx.closePath();
	ctx.stroke();
}

http.createServer(function (req, res) {
	var q = url.parse(req.url, true).query;
	try {
		var numbers = JSON.parse(q.numbers);
		var canvas = canvas = new Canvas(numbers.length*WIDTH,60);
		console.log(q.color);
		q.color = q.color ? '#' + q.color : DEFAULT_COLOR;
		render( canvas, numbers, q.color );
	  	res.writeHead(200, { 'Content-Type': 'image/png' });
		canvas.toBuffer(function(err, buf) {
			if(!err) {
				res.write(buf);
				res.end();
			} else {
				throw 'buffer error';
			}
		});
	} catch (e) {
		console.log(e);
		res.writeHead(500);
		res.end('Internal Server Error');
	}
}).listen(8888);
console.log('Server started on port 8888');


