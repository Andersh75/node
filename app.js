// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

var http = require('http');
var fs = require('fs');

const PORT=8080;

fs.readFile('./index.html', function (err, html) {
  if (err) throw err;

  http.createServer(function(request, response) {
    response.writeHeader(200, {
      "Content-Type": "text/html"
    });
      response.write(html);
      console.log('YO!');
      response.end();
  }).listen(PORT);
});

