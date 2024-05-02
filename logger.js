const EventEmitter = require("node:events");

class Logger extends EventEmitter {
    log(message, arg) {
        this.emit(message, arg);
    }
}

module.exports = Logger;