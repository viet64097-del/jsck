const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 5500;
const root = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer(function(request, response) {
  const requestPath = request.url === "/" ? "/index.html" : request.url;
  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  fs.readFile(filePath, function(error, content) {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Không tìm thấy file.");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "text/plain; charset=utf-8" });
    response.end(content);
  });
});

server.listen(port, "127.0.0.1", function() {
  console.log("MoneyCare đang chạy tại http://127.0.0.1:" + port);
});
