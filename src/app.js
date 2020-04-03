const http = require('http');
const conf = require('./config/defaultConfig');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('http-server~');
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http:${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${addr}`);
});