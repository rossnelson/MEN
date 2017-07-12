const Q = require("q");
const kue = require('kue');
let queue;

module.exports.Base = class JobBase {

  constructor(job, data, params={}) {
    this.params = params;
    this.job = job;
    this.data = data;
  }

  static perform_later(data) {
    const obj = make_job.call(this, data);
    obj.perform_later();
  }

  static set(params, data) {
    const obj = make_job.call(this, data, params);
    return obj;
  }

  perform_later() {
    if (this.params.delay) {
      this.job.delay(this.params.delay)
    }
    if (this.params.priority) {
      this.job.priority(this.params.priority)
    }
    if (this.params.attempts) {
      this.job.attempts(this.params.attempts)
    }

    this.job.save();
  }

};

function make_job(data, params) {
  const job = queue.create(this.name, data);
  const obj = new this(job, data, params);
  queue.process(this.name, obj.perform.bind(obj));
  return obj;
}

module.exports.init = (App) => {
  const redisUrl = process.env.REDIS_URL

  queue = kue.createQueue({
    redis: redisUrl,
    disableSearch: false
  });

}
