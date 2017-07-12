const Q = require('q');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const requirePath = require('require-path');

let Context;

module.exports = class Initializers  {
  static init(App) {
    Context = App;
    return loadModules.call(this)
  }
}

function loadModules() {
  const routesPath = path.join(process.env.APP_ROOT, 'config', 'initializers');
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

