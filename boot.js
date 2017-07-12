const App = require('./vendor/core');

process.env.APP_ROOT = __dirname;
App.serve(__dirname)
