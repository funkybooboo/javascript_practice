const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    const context = {
        title: "Courses",
        message: "Landing Page"
    };
    response.render("index", context); // html template
});

module.exports = router;