import * as Q from 'q';
import * as path from 'path';
import * as mongoose from 'mongoose';

let Context;

export default class DB {

  static init(App) {
    Context = App;

    const { APP_ROOT, DB_ADAPTOR } = process.env;
    const Adaptor = require(path.join(
      APP_ROOT, 'vendor', 'db_adaptors', DB_ADAPTOR
    ));

    return Adaptor.init(App);
  }

}
