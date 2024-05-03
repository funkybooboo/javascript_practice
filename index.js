const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const courses = require("./routes/courses");
const home = require("./routes/home");
const logger = require("./middleware/logger");
const authenticater = require("./middleware/authenticater");

const app = express();

// settings
app.set("view engine", "pug");
app.set("views", "./views"); // default

// configuration
const app_name = config.get("name");
console.log(`application name: ${app_name}`);
const mail_host_name = config.get("mail.host");
console.log(`mail server: ${mail_host_name}`);
//const mail_server_password = config.get("mail.password");

// express middleware
app.use(express.json()); // reqest.body
app.use(express.urlencoded({extended: true})); // key=value&key=value
app.use(express.static("public")); // lets people go to localhost:port/docs.txt
// third party middleware
app.use(helmet()); // exta security
if (app.get("env") === "development") { // export NODE_ENV=production or testing or whatever but by default is development
    app.use(morgan("tiny")); // logs http requests
    startupDebugger("morgan enabled...");
}
// custom middleware
app.use(logger);
app.use(authenticater);

// custom routers
app.use("/", home);
app.use("/api/courses", courses);

// data base work
databaseDebugger("connected to the database...");

// start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
