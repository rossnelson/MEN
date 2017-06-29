const Q = require('q');
const path = require('path');
const mongoose = require('mongoose');

let Context;

module.exports = class Mongo {

  static init(App) {
    Context = App;

    const deferred = Q.defer();
    const url = process.env.MONGO_URL;
    const debugVal = process.env.MONGO_DEBUG;

    mongoose.connect(url);
    mongoose.set('debug', debugVal);
    mongoose.Promise = Q.promise;

    App.DB = this;

    var db = mongoose.connection;
    db.once('open', function () {
        deferred.resolve();
    });

    db.on('error', function (err) {
      deferred.reject(err);
    });
  }

  static get(name) {
    try {
        return mongoose.model(name);
    } catch (e) {
        Context.Logger.error('Failed to get model "' + name + '":', e);
        process.exit(1);
        return null;
    }
  }

}

