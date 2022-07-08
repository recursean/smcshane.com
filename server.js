const http = require("http");

// host and port to listen for incoming requests
const port = 80;

const requestListener = function(req, res) {
    res.writeHead(200);
    console.log('Request received');
    res.end("Hello world!");
};

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`smcshane.com is running on ${port}`);
});