import * as Q from 'q';
import Server from './setup_express';

export function init() {
  return Q.resolve(console.log('BOOTED'));
};

export function serve() {
  this.init()
  .then(Server.init.bind(Server))
};

export function getModel(name) {
  return name;
}

