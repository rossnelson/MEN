import App from 'vendor/core';
import * as repl from 'repl';
import * as path from 'path';

process.env.APP_ROOT = path.resolve(path.join(__dirname, '..'));

let server;

App.init()
.then(() => server = repl.start({}))
.then(() => server.context.app = new App());
