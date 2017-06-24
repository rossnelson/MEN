import * as Q from 'q';
import * as winston from 'winston';
import * as path from 'path';

export default class Logger  {
  public static log;

  static init(App) {
    const deferred = Q.defer();

    const { NODE_ENV } = process.env;
    let result;

    if (NODE_ENV !== 'production') {
      result = setupDevLogger.call(this);
    }

    if (NODE_ENV === 'production') {
      result = setupProdLogger.call(this);
    }

    Q.resolve(result)
    .then(() => App.Logger = this.log)
    .then(() => deferred.resolve());

    return deferred.promise;
  }

}

function setupDevLogger() {
  const env = process.env.NODE_ENV || 'development';
  const filePath = path.join(process.env.APP_ROOT, 'logs', env+'.log')

  return this.log = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: true,
        colorize: true,
        prettyPrint: true,
      }),
      new (winston.transports.File)({
        filename: filePath
      })
    ]
  });
}

function setupProdLogger() {
  const env = process.env.NODE_ENV || 'development';
  const filePath = path.join(process.env.APP_ROOT, 'logs', env+'.log')

  return this.log = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: filePath })
    ]
  });
}
