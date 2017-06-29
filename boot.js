global.include = function(name) {
    return require(__dirname + '/' + name);
}

const App = include('vendor/core');

process.env.APP_ROOT = __dirname;
App.serve();
