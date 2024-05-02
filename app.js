const http = require("node:http");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("Hello World");
    } else if (req.url === "/numbers") {
        res.write(JSON.stringify([1, 2, 3]));
    } else {
        res.write("404");
    }
    res.end();
});

server.on("connection", (socket) => {
    console.log("new connection...");
});

server.listen(3000);
console.log("listening on port 3000...");
