const express = require("express");
const Joi = require("joi");
const logger = require("./logger");
const authenticater = require("./authenticater");

const app = express();

// middleware
app.use(express.json());
app.use(logger);
app.use(authenticater);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
