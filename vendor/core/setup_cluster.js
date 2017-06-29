const Q = require('q');
const cluster = require('cluster');
const EventEmitter = require('events').EventEmitter;

module.exports = class Cluster {

  static init(App) {
    if (!cluster.isMaster) {
      return
    }

    try {
      this.workerHandler = new EventEmitter();

      cluster.on('message', function (worker, data) {
        this.workerHandler.emit(data.type, data.id, data.data);
      });

      cluster.on('exit', function (worker, code) {
        console.warn('WORKER DIED W-' + worker.id + ':', code);
        App.Logger.error('WORKER DIED W-' + worker.id + ':', code);
        if (this.hasInitialized) {
          cluster.fork();
        } else {
          process.exit(1);
        }
      });

      var workerSize = require('os').cpus().length;
      console.log(workerSize);
      console.log('Forking and initializing ' + workerSize + ' workers.');
      cluster.fork();

      this.workerHandler.on('init', function (id, data) {
        if (!this.hasInitialized) {
          if (Object.keys(cluster.workers).length < workerSize) {
            cluster.fork();
          } else {
            initDefer.resolve();
            this.hasInitialized = true;
            console.log('Cluster Forked!!.');
          }
        }
      });
    } catch(err) { console.log('Cluster Failed :( ', err.message); }
  }

}


