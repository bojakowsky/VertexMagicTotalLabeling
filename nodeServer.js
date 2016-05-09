/* var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var sys = require('sys');
var exec = require('child_process').exec;

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  exec("echo lol > text.txt");	
}); */


var http = require('http'),
    fs = require('fs');
	
var sys = require('sys');
var exec = require('child_process').exec;

var lineReader = require('line-reader');

http.createServer(function (req, res) {

    if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'

      fs.readFile('./index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile('./code.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile('./style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });

    }

}).listen(8000); //, '127.0.0.1'
console.log('Server running at localhost:8000/');

var io = require('socket.io').listen(81); // initiate socket.io server

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' }); // Send data to client

  // wait for the event raised by the client
  socket.on('execute', function (data) {  
    console.log(data+ "\n");
	console.log(data.data + "\n");
	exec(data.data);
	// exec("( echo test & echo.test) > asserts.txt");

	exec('"D:\\Program Files\\swipl\\bin\\swipl" -f \"vmtl.pl\" < \"vmtl.pl\" > result.txt  2> error.txt', function(error, stdout, stderr) {
    if (error === null){
		console.log('stdout: ', 'VMTL successfully solved!');
		//console.log('stderr: ', stderr);
		
		var countLines = 0;
		var dataReply = "";
		var msgSent = false;
		lineReader.eachLine('result.txt', function(line, last) {
		  if (countLines == 0 && line == 'true.'){
			  socket.emit('reply', JSON.parse('{"data": "False." }'));
			  msgSent = true;
			  countLines++;
		  }
		  else if (!msgSent) {			  
			  if (countLines < 2){
				  dataReply += " " + line;
				  countLines++;
				  console.log("loop dataReply: " + dataReply);
			  }
			  
			  else if (countLines == 2){
				  dataReply += " [" + line + "]";
				  countLines++;
				  console.log("break loop: " + dataReply );
			  }
			  
			  else if (last){
				console.log("DataReply: "  + dataReply);
				var replyJSON = JSON.parse('{"data": "'+ dataReply +'"}');
				console.log("DataReplyJSON: " +replyJSON);
				socket.emit('reply', replyJSON);
			  }
		  }
		});
		
		
	}
    else if (error !== null) {
        console.log('exec error: ', 'Proces was running, killing it!');
		exec("taskkill /f /im swipl.exe");
    }
	});
  });
});
