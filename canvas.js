var http = require('http');
var Canvas = require('canvas');
var url = require('url');

var WIDTH = 30;
var HEIGHT = 60;
var DEFAULT_COLOR = '#58C6C2';

function render(canvas, numbers, color) { 
	ctx = canvas.getContext('2d');
	
	var biggestNumber = Math.max.apply(null, numbers);

	var currentX = 10 + WIDTH/2;
	var lineHeight = 0;
	
	ctx.beginPath();
	ctx.moveTo(currentX, HEIGHT + 10);
	ctx.lineWidth = WIDTH;
	ctx.strokeStyle = color;
	
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
		var canvas = new Canvas(numbers.length*WIDTH + 20, HEIGHT+10);
		var color = q.color ? '#' + q.color : DEFAULT_COLOR;
		render( canvas, numbers, color );
	  	
	  res.writeHead(200, { 'Content-Type': 'image/png' });
		canvas.toBuffer(function(err, buf){
			res.write(buf);
			res.end();
		});
	} catch (e) {
		console.error(e);
		res.writeHead(500);
		res.end('Internal Server Error');
	}
}).listen(8888);
console.log('Server started on port 8888');
