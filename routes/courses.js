const express = require("express");
const Joi = require("joi");

const router = express.Router();

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

router.get("/", (request, response) => {
    response.send(courses);
});

router.get("/:id", (request, response) => {
    const course = courses.find(course => course.id === parseInt(request.params.id));
    if (!course) {
        response.status(404).send("The course with the given ID was not found");
        return;
    }
    response.send(course);
});

router.post("/", (request, response) => {
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

router.put("/:id", (request, response) => {
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

router.delete("/:id", (request, response) => {
    const course = courses.find(course => course.id === parseInt(request.params.id));
    if (!course) {
        response.status(404).send("The course with the given ID was not found");
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    response.send(course);
});

module.exports = router;