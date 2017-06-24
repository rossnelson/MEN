import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Q from 'q';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

let Context;

export default class Server  {
  static init(App) {
    Context = App;

    const deferred = Q.defer();

    const expressApp = express();
    Context.Server = expressApp;

    setupBodyParser.call(this)
    .then(setupCORS.bind(this))
    .then(setupStatusEndpoint.bind(this))
    .then(loadRoutes.bind(this))
    .then(listen.bind(this))
    .then(deferred.resolve);

    return deferred.promise;
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
    _.forEach(files, function (file) {
      if (file.match(/\.ts$/)) {
        Context.Logger.debug('Loading route "' + file + '".');
        try {
          const routes = require(path.join(routesPath, file));
          routes(Context);
        } catch (e) {
          Context.Logger.error('Failed to load route "' + file + '":', e);
          process.exit(1);
        }
      }
    });
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
