import * as Q from 'q';
import * as _ from 'lodash';

import Config from './setup_config';
import Logger from './setup_logger';
import LoadPaths from './setup_load_paths';
import DB from './setup_db';
import Redis from './setup_redis';
import Server from './setup_express';

process.env.CORE_ROOT = __dirname;

export default class App {
  public static Logger;
  public static Server;
  public static LoadPaths;
  private static DB;
  private static Redis;
  private static Modules;

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
