const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Project = require("../models/project");
const Lecturer = require("../models/lecturer");
// const Team = require("../models/team");
const jwt = require("jsonwebtoken");

const sendMail = require("../config/email");

//  Sending email
router.get("/email", (req, res) => {
  res.send("Route: /test/email");
});
router.post("/email", async (req, res) => {
  console.log(req.body);

  await Project.findOne({ _id: req.body.projectId }).then(async (project) => {
    console.log(project);
    await Lecturer.findOne({ fullName: project.projectAuthor }).then(
      (lecturer) => {
        sendMail(
          lecturer.email,
          "Revisions to your project were made by our department",
          `Note: ${req.body.textBox}`
        );
      }
    );
  });
});

// const { isAuth } = require("./middleware");
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (err) {}
});

router.get("/:id", getStudent, (req, res) => {
  res.send(res.student.fullName);
});

router.post("/", async (req, res) => {
  const student = new Student({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newStudent = await student.save();

    console.log("new student added succesfully");
    res.status(201).json(newStudent);
  } catch (err) {
    console.log(`we have error in save new student ${err} `);
    res.status(400).json(`err: ${err}`);
  }
});

router.patch("/:id", getStudent, async (req, res) => {
  if (req.body === null) {
    return res.json({ message: "please inter data..." });
  }
  console.log(req.body);
  // try {
  //   const newData = await Student.findByIdAndUpdate(req.params.id, req.body);
  //   res.send(newData);
  // } catch (err) {
  //   res.status(400).json({ message: err.message });
  // }
});

router.delete("/:id", async (req, res) => {
  try {
    await res.student.remove();
    res.json({ message: "deleted subscriber" });
  } catch (err) {
    res.status(500).json({ message: erro.message });
  }
});

router.get("/team", async (req, res) => {
  try {
    const teams = await Team.find();

    res.json(students);
  } catch (err) {}
});

// router.post("/team", async (req, res) => {
//   console.log(req.body);

//   const student = new Student({
//     fullName: req.body.fullName,
//     email: req.body.email,
//     password: req.body.password,
//   });

//   try {
//     const newStudent = await student.save();

//     console.log("new student added succesfully");
//     res.status(201).json(newStudent);
//   } catch (err) {
//     console.log(`we have error in save new student ${err} `);
//     res.status(400).json(`err: ${err}`);
//   }
// });

async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findById(req.params.id);
    if (student == null) {
      return res.status(404).json({ message: "Cannot find student" });
    }
  } catch (err) {
    return res.status(500).json({ message: `we have an error ${err.message}` });
  }

  res.student = student;
  next();
}
const posts = [
  {
    userName: "yahia",
    title: "post1",
  },
  {
    userName: "hawbash",
    title: "post 2",
  },
];
router.get("/jwt", (req, res) => {
  console.log("req.user");
});

router.post("/jwtTest", (req, res) => {
  const userName = req.body.userName;
  const user = { name: userName };

  const accessToken = jwt.sign(user, "secret");
  res.json({ accessToken });
});

function authenticateToken(req, res, next) {
  //  verify to have a correct user,, authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(token);
  if (token == null) return res.json("unAuth");
  jwt.verify(token, "secret", (err, user) => {
    if (err)
      return res.json({ message: "we have error, please fix it", err: err });
    req.user = user;
    console.log(req.user);
    next();
  });
}

module.exports = router;
