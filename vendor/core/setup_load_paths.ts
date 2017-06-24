import * as Q from 'q';
import { each, map, remove, includes } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as requirePath from 'require-path';
import { camelize } from 'inflected';

export default class LoadPaths {
  private static Modules;

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
      include: ['*.ts', '*.json'],
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
