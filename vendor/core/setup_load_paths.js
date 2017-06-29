const Q = require('q');
const { each, map, remove, includes } = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const requirePath = require('require-path');
const { camelize } = require('inflected');

module.exports = class LoadPaths {
  static init(App) {
    return Q.resolve(loadPaths.call(this))
      .then(loadClasses.bind(this))
      .then(() => App.Modules = this.Modules);
  }
}

function loadPaths() {
  const loadPathsRoot = path.join(process.env.APP_ROOT, 'app');
  const rootDirs = fs.readdirSync(loadPathsRoot).filter(
    file => fs.lstatSync(path.join(loadPathsRoot, file)).isDirectory()
  );
  remove(rootDirs, (dir => includes(['routes', 'sockets'], dir)));
  this.loadDirs = rootDirs;
}

function loadClasses() {
  this.Modules = {};
  const loadPathsRoot = path.join(process.env.APP_ROOT, 'app');
  const promises = map(this.loadDirs, dir => {
    return requirePath({
      path: path.join(loadPathsRoot, dir),
      include: ['*.js', '*.json'],
    })
    .then(modules => {
      const kind = camelize(dir);
      this.Modules[kind] = {};

      each(Object.keys(modules), key => {
        let name = key.replace(/\..+$/, '');
        name = camelize(name);
        this.Modules[kind][name] = modules[key];
      });
    });
    // don't forget to handle errors!
    //.catch(handleError);
  });

  return Q.all(promises);
}
