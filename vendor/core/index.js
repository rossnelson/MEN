const Q = require('q');
const _ = require('lodash');

const Config = require('./setup_config');
const Logger = require('./setup_logger');
const LoadPaths = require('./setup_load_paths');
const DB = require('./setup_db');
const Redis = require('./setup_redis');
const Server = require('./setup_express');

process.env.CORE_ROOT = __dirname;

module.exports = class App {

  static init() {
    return Config.init()
    .then(Logger.init.bind(Logger, this))
    .then(LoadPaths.init.bind(LoadPaths, this))
    .then(DB.init.bind(DB, this))
    .then(Redis.init.bind(Redis, this))
    .then(() => this.Logger.info('INITIALIZED'))
    .catch(err => console.log(err));
  }

  static serve() {
    this.init()
    .then(Server.init.bind(Server, this))
    .then(() => this.Logger.info('SERVING'))
  }

  get(path) {
    return _.get(App.Modules, path);
  }
}

//export const JobBase = new App.JobBase;
