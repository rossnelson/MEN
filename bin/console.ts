import * as App from '../vendor/core';
import * as repl from 'repl';

let server;

App.init()
.then(() => server = repl.start({}))
.then(() => server.context.App = App);
