const Q = require('q');
const path = require('path');
const mongoose = require('mongoose');

let Context;

module.exports = class DB {

  static init(App) {
    Context = App;

    const { APP_ROOT, DB_ADAPTOR } = process.env;
    const Adaptor = require(path.join(
      APP_ROOT, 'vendor', 'db_adaptors', DB_ADAPTOR
    ));

    return Adaptor.init(App);
  }

}
