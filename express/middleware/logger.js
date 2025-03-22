function log(request, response, next) {
    console.log("logging...");
    next();
}

module.exports = log;