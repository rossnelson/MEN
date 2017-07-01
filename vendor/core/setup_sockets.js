const Q = require('q');
const path = require('path');

const _ = require('lodash');
const http = require('http');
const net = require('net');
const ioRedis = require('socket.io-redis');
const cluster = require('cluster');

let server;
let io;
let Context;

module.exports = class Sockets  {

  static init(App) {
    if (!process.env.REDIS_URL) {
      App.Logger.info(
        'Sockets Skipped: Redis not configured. Add REDIS_URL to the env config'
      );
      return;
    }

    Context = App;

    return setupServer()
    .then(setupServerError.bind(this))
    .then(setupIO.bind(this))
    .then(ioConnection.bind(this))
    .then(handleMessage.bind(this))
    .then(serverListen.bind(this))
    .catch(err => App.Logger.info('Sockets Not Loaded:', err.message))
  }

  static addMiddleware(middleware) {
    if (!io) {
      throw new Error('Websocket client has not yet been initialized.');
    }
    io.use(middleware);
  }

  static getClient(middleware) {
    if (!io) {
      throw new Error('Websocket client has not yet been initialized.');
    }
    return io;
  }

}

function setupServer(defer) {
  server = http.createServer(httpRequestHandler);
  return Q.resolve(null);
}

function setupServerError() {
  server.on('error', function (err) {
    self.log.error(err);
  });
}

function serverListen() {
  const defer = Q.defer();

  server.listen(0, 'localhost');
  server.once('listening', function () {
    try {
      defer.resolve();
    } catch (e) {
      defer.reject(e);
    }
  });

  return defer.promise;
}

function setupIO() {
  io = require('socket.io')(server);
  io.adapter(ioRedis({
    pubClient: Context.Redis.getPub(), subClient: Context.Redis.getSub()
  }));
}

function ioConnection() {
  io.on('connection', function (socket) {
    if (socket.userData) {
      socket.join('user:' + socket.userData.id);
    }
  });
}


function handleMessage() {
  process.on('message', function (message, connection) {
    if (message.type !== 'sticky-session:connection') {
      return;
    }

    server.emit('connection', connection);
    connection.push(new Buffer(message.data));
    connection.resume();
  });
}

function httpRequestHandler(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('perfect!');
    res.end();
};
