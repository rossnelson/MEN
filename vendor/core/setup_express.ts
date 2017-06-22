import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Q from 'q';
import * as fs from 'fs';
import * as _ from 'lodash';

export default class Server  {
  private static handler;

  static init() {
    const deferred = Q.defer();

    const expressApp = express();
    this.handler = expressApp;

    setupBodyParser.call(this)
    .then(setupCORS.bind(this))
    .then(setupStatusEndpoint.bind(this))
    .then(listen.bind(this))
    .then(deferred.resolve);

    return deferred.promise;
  }

  static use(func) {
    this.handler.use(func)
  }
}

function setupBodyParser() {
  return Q.resolve(
    this.handler.use(bodyParser.json())
  );
}

function setupCORS() {
  return this.handler.use(function (req, res, next) {
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
  return this.handler.get('/api/status', function (req, res) {
    res.send({success: true});
  });
}

function listen() {
  const deferred = Q.defer();

  const port = process.env.PORT || 3000
  this.handler.listen(port, function () {
    console.log('Express server started on port: ' + port);
    deferred.resolve();
  });

  return deferred.promise;
}
