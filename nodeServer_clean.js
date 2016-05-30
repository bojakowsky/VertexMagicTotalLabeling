var http = require('http'),
    fs = require('fs');
	
var sys = require('sys');
var exec = require('child_process').exec;

var lineReader = require('line-reader');

http.createServer(function (req, res) {

    if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'

      fs.readFile('./index.html', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile('./code.js', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile('./style.css', function (err, data) {
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

  function vmtl(error, stdout, stderr) {
		if (error === null){		
			var countLines = 0;
			var dataReply = "";
			var msgSent = false;
			lineReader.eachLine('result.txt', function(line, last) {
			  if (dataReply == "" && countLines == 0 && line == 'true.'){
				  socket.emit('reply', JSON.parse('{"data": "False." }'));
				  msgSent = true;
				  countLines++;
			  }
			  else if (!msgSent) {		
				  if (line == 'true.'){
					var replyJSON = JSON.parse('{"data": "'+ dataReply +'"}');
					socket.emit('reply', replyJSON);
					msgSent = true;
				  }		  
				  else if (countLines < 2){
					  dataReply += " " + line;
					  countLines++;
				  }
				  
				  else if (countLines == 2){
					  dataReply += " [" + line + "]!";
					  countLines = 0;
				  }
			  }
			});		
		}
		else if (error !== null) {
			exec("taskkill /f /im swipl.exe");
		}
	}
  
  // wait for the event raised by the client
  socket.on('execute', function (data) {  
	exec(data.data);
	// exec("( echo test & echo.test) > asserts.txt");
	exec('"C:\\Program Files\\swipl\\bin\\swipl" -f \"vmtlAll.pl\" < \"vmtlAll.pl\" > result.txt  2> error.txt', vmtl);
  });
  
  socket.on('executeFast', function (data) {  
	exec(data.data);
	// exec("( echo test & echo.test) > asserts.txt");
	exec('"C:\\Program Files\\swipl\\bin\\swipl" -f \"vmtlFirst.pl\" < \"vmtlFirst.pl\" > result.txt  2> error.txt', vmtl);
  });
});
