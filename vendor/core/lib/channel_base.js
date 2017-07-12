
const Q = require('q');

module.exports = (App) => {
    socketClient = App.Sockets.getClient();

    App.ChannelBase = class ChannelBase {

        static attach(listener, responder) {
            const obj = new this(listener, responder);
            attach.call(obj, listener, responder);
            return obj;
        }

        receive(data, callback) {
            queue.create({ data, callback })
            .priority('high')
            .removeOnComplete(true)
            .save();
        }

        respond(job, done) {
            Q.fcall(this.perform(job.data))
            .then(done)
            .catch(err => done(err));
        }

    }
}

function attach(listener, responder) {
    socketClient.on('connection', socket => {
        socket.on(listener, this.receive.bind(this))
    });
    queue.process(responder, this.respond.bind(this));
}

