const express = require('express');
const bodyParser = require('body-parser');
const Q = require('q');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const requirePath = require('require-path');

let Context;

module.exports = class Server  {
  static init(App) {
    Context = App;

    const deferred = Q.defer();

    if (process.env.EXPRESS_DEBUG) {
      process.env.DEBUG = 'express:*';
    }

    const expressApp = express();
    Context.Server = expressApp;

    setupBodyParser.call(this)
    .then(setupCORS.bind(this))
    .then(setupStatusEndpoint.bind(this))
    .then(deferred.resolve);

    return deferred.promise;
  }

  static listen() {
    return loadRoutes.call(this)
    .then(listen.bind(this))
  }
}

function setupBodyParser() {
  return Q.resolve(
    Context.Server.use(bodyParser.json())
  );
}

function setupCORS() {
  return Context.Server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE, OPTIONS'
    );
    return next();
  });
}

function setupStatusEndpoint() {
  return Context.Server.get('/api/status', function (req, res) {
    res.send({success: true});
  });
}

function loadRoutes() {
  const routesPath = path.join(process.env.APP_ROOT, 'app', 'routes');
  const files = fs.readdirSync(routesPath);

  try {
    return requirePath({
      path: routesPath,
      include: ['*.js', '*.json'],
    })
    .then(modules => _.each(modules, module => module(Context)))
  } catch (e) {
    if (e.code !== 'ENOENT') {
      Context.Logger.error('Failed to load routes:', e);
      process.exit(1);
    }
  }
}

function listen() {
  const deferred = Q.defer();

  const port = process.env.EXPRESS_PORT || 3000
  Context.Server.listen(port, function () {
    Context.Logger.info('Express server started on port: ' + port);
    deferred.resolve();
  });

  return deferred.promise;
}
