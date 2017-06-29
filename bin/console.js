global.include = function(name) {
  return require(__dirname + '/../' + name);
}

const App = include('vendor/core');
const repl = require('repl');
const path = require('path');

process.env.APP_ROOT = path.resolve(path.join(__dirname, '..'));

let server;

App.init()
.then(() => server = repl.start({}))
.then(() => server.context.App = App);
