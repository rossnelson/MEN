const Q = require('q');
const _ = require('lodash');

const Config = require('./setup_config');
const Logger = require('./setup_logger');
const LoadPaths = require('./setup_load_paths');
const DB = require('./setup_db');
const Redis = require('./setup_redis');
const Server = require('./setup_express');
const Cluster = require('./setup_cluster');
const Initializers = require('./initializers');
const Job = require('./lib/job_base');

process.env.CORE_ROOT = __dirname;

module.exports = class App {

  static init() {
    return this.preInit()
    .then(() => this.postInit())
  }

  static preInit(app_root) {
    global.include = function(name) {
      return require(app_root + '/' + name);
    }

    return Config.init()
    .then(Logger.init.bind(Logger, this))
    .then(LoadPaths.init.bind(LoadPaths, this))
    .then(DB.init.bind(DB, this))
    .then(Redis.init.bind(Redis, this))
    .then(Job.init.bind(Job, this))
    .then(Server.init.bind(Server, this))
    .then(() => this.Logger.info('INITIALIZED'))
    .catch(err => console.log(err));
  }

  static postInit() {
    return Initializers.init(this);
  }

  static serve(app_root) {
    return this.preInit(app_root)
    .then(() => this.postInit())
    .then(Server.listen.bind(Server, this))
    .then(() => this.Logger.info('SERVING'))
    .catch(err => console.log(err));
  }

  static get(path) {
    return _.get(App.Modules, path);
  }

}

module.exports.JobBase = Job.Base;
