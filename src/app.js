require('dotenv').config();

const http = require('http');
const { routes } = require('./routes');

const handler = (request, response) => {
  const { url, method } = request
  let routeKey = `${method.toLowerCase()}:${url}`;
  const [,, id] = routeKey.split('/');
  
  const logRequest = `-> New request ${routeKey}`;
  console.log('\x1b[33m', logRequest);

  routeKey = id ? routeKey.replace(`/${id}`, '') : routeKey;
  const chosen = routes[routeKey] || routes.default;
  
  request.itemId = id;
  response.writeHead(200, { 'Content-Type': 'application/json' });

  return chosen(request, response);
}

const app = http.createServer(handler);

module.exports = app;
