const http = require('http')

const routes = require('./routes')

const server = http.createServer(routes.handler)
console.log(routes.sampleText);

server.listen(3001)