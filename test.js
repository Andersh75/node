var http = require('http');
var fs = require('fs');
var io = require('socket.io').listen(server);
  
// Chargement du fichier html
var connect = function(request, reponse)
{
    if (request.url != "js/main.js"){
        fs.readFile('./index.html', 'utf-8', function(error, content)
        {
            reponse.writeHead(200, {"Content-type": "text/html"});
            reponse.end(content);
        });
    }
}
  
var server = http.createServer(connect);
  
io.sockets.on('connection', function (socket)
{
    console.log('Un client est connecté !');
});
  
server.listen(8080);