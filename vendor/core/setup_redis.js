const Q = require('q');
const _ = require('lodash');
const redis = require('redis');

module.exports = class Redis {
  static init(App) {
    if (!process.env.REDIS_URL) {
      return;
    }

    const defer = Q.defer();

    App.Redis = this;

    this.url = process.env.REDIS_URL;
    console.log(this.url);
    this.pub = redis.createClient(this.url);

    this.pub.on('ready', () => {
        this.sub = redis.createClient(this.url, {return_buffers: true});
        this.sub.on('ready', () => {
            defer.resolve();
        });
        this.sub.on('error', (err) => {
          App.Logger.log.error(err);
        });
    });

    this.pub.on('error', (err) => {
      App.Logger.error(err);
    });

    return defer.promise;
  }

  static getClient() {
      if (!this.pub) {
          throw new Error('Redis publish client has not yet been initialized.');
      }
      return this.pub;
  };

  static getPub() {
      if (!this.pub) {
          throw new Error('Redis publish client has not yet been initialized.');
      }
      return this.pub;
  };

  static getSub() {
      if (!this.sub) {
          throw new Error('Redis subscribe client has not yet been initialized.');
      }
      return this.sub;
  };
}

