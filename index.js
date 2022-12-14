const debug = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const Joi = require("joi");
const express = require("express");
const helmet = require("helmet");

const app = express();
app.set("view engine", "pug");
// app.set("views", "./views"); //default

app.use(express.json());
app.use(helmet());

// ********* ENV
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get("env")}`);
debug("App name: " + config.get("name"));
// console.log("App name:", config.get("name"));
debug("Mail: " + config.get("mail.host"));
debug("Mail pw: " + config.get("mail.password"));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(function (req, res, next) {
// console.log('logging...')
//     next();
// });

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

// ***** ***** *****
app.get("/", (req, res) => {
    // res.send("hello there..");
    res.render("index", { title: "iExpress", message: "Main Course" });
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

// app.get("/api/courses/:id/:year/:month", (req, res) => {
app.get("/api/courses/:id", (req, res) => {
    // res.send(req.params);
    // res.send(req.query);
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("The course with given ID was not found");
    res.send(course);
});

// ***** POST *****
app.post("/api/courses", (req, res) => {
    const { error } = validateCourse(req.body.name);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

// ***** PUT *****
app.put("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("The course with given ID was not found");

    const { error } = validateCourse(req.body.name);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

// ***** DELETE *****
app.delete("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("The course with given ID was not found");

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // courses = courses.filter((c) => c.id !== parseInt(req.params.id));
    // console.log(courses);

    res.send(course);
});

// ***** PORT listening *****
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}..`));

// ***** HELPER *****
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
    });

    return schema.validate({ name: course });
}
