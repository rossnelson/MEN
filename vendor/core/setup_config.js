const Q = require('q');
const path = require('path');

module.exports = class Config  {

  static init() {
    try {
      const env = process.env.NODE_ENV || 'development';
      const configPath = path.join(
        process.env.APP_ROOT, 'config', 'environments', env
      );
      const vars = require(configPath);

      return Q.resolve(
        Object.assign(process.env, vars)
      );
    } catch(err) { console.log('Config Not Loaded:', err.message); }
  }

}

