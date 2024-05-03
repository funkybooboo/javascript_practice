function authenticater(request, response, next) {
    console.log("authenticating..");
    next();
}

module.exports = authenticater;