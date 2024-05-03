const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const logger = require("./logger");
const authenticater = require("./authenticater");

const app = express();

// configuration
console.log(`application name: ${config.get("name")}`);
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

// data base work
databaseDebugger("connected to the database...");

// dummy data
const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"},
];

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.valid(course, schema);
}

// get endpoints
app.get("/", (requestuest, responseponse) => {
    responseponse.send("Landing Page");
});

app.get("/api/courses", (request, response) => {
    response.send(courses);
});

app.get("/api/courses/:id", (request, response) => {
    const course = courses.find(course => course.id === parseInt(request.params.id));
    if (!course) {
        response.status(404).send("The course with the given ID was not found");
        return;
    }
    response.send(course);
});

// post end points
app.post("/api/courses", (request, response) => {
    const {error} = validateCourse(request.body);
    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: request.body.name
    };
    courses.push(course);
    response.send(course);
});

// put endpoints
app.put("/api/courses/:id", (request, response) => {
    const course = courses.find(course => course.id === parseInt(request.params.id));
    if (!course) {
        response.status(404).send("The course with the given ID was not found");
        return;
    }
    const {error} = validateCourse(request.body);
    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    course.name = request.body.name;
    response.send(course);
});

// delete endpoints
app.delete("/api/courses/:id", (request, response) => {
    const course = courses.find(course => course.id === parseInt(request.params.id));
    if (!course) {
        response.status(404).send("The course with the given ID was not found");
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    response.send(course);
});

// start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
