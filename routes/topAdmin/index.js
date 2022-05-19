//  !packages
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");

//! functionallity
const sendMail = require("../../config/email");

//  !models
const Team = require("../../models/team");
const Student = require("../../models/student");
const Lecturer = require("../../models/lecturer");
const Scommittee = require("../../models/scientificCommitte");
const Admin = require("../../models/admin");
const Project = require("../../models/project");
const TopAdmin = require("../../models/topAdmin");
const ConStudentProject = require("../../models/conditional-sorting-projects");

router.get("/", (req, res) => {
  let AdminControl = true;

  const currentUserAdmin = req.cookies.topAdmin;
  res.render("admin/topAdmin/topadminentering", {
    currentUserAdmin,
    AdminControl,
  });
});

//  !student form

router.get("/student-form/student-group", async (req, res) => {
  let member = [];
  //* we use eachMember variable, for adding all teams email, then search for those variable value(id) in Student table...
  let eachMember = [];

  let tst;

  Team.find().then((teams) => {
    teams.forEach((fteam) => {
      member.push(fteam.teamMembers);
    });
    member.forEach((mb, indexA) => {
      member[indexA].forEach((eachMb, indexB) => {
        eachMember.push(eachMb);
      });
    });

    Student.find({ email: eachMember }).then((students) => {
      res.render("admin/topAdmin/studentgroup", { teams, member });
    });

    /*
       'kosrat@kUpdate',..
        'rama@r',..
        'amar@a',..
        'ali@a',..
        'ari@a',..
        'test2@gmail.com',..
        'ali@a',
        'mohammed@m',
        'shikar@s',
        'test@gmail.com'
    */
    //
  });
});

router.get("/student-form/student-list", async (req, res) => {
  await Student.find().then((st) => {
    res.render("admin/topAdmin/studentlist", { student: st });
  });
});

router.post("/student-form/add-new-student", async (req, res) => {
  const student = new Student({
    fullName: req.body.fullName,
    email: req.body.email,
    grade: req.body.grade,
    password: req.body.password,
  });

  try {
    const newStudent = await student
      .save()
      .then((newStudent) => {
        console.log("new student added succesfully");
        res.redirect("/admin/top-admin/student-form/student-list");
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    console.log(`we have error in save new Lecturer ${err} `);
    res.status(400).json(`err: ${err}`);
  }
});
//  updating student
router.get("/student-form/update-student/:id", async (req, res) => {
  await Student.findById({ _id: req.params.id })
    .then((user) => {
      // console.log(user);
      // console.log("hiii");
      res.render("admin/topAdmin/updateForm", {
        user,
        updateRoute: "student-form/update-student",
      });
    })
    .catch((err) => {
      res.send("erris " + err);
    });
});

router.post("/student-form/update-student/:id", async (req, res) => {
  await Student.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then((student) => {
      // console.log(student);
      console.log("student is updated succesfully");
      res.redirect("/admin/top-admin/student-form/student-list");
    })
    .catch((err) => {
      res.send("cant update student, err is: " + err);
    });
});

//delete student
router.get("/student-form/delete-student/:id", async (req, res) => {
  await Student.findByIdAndDelete({ _id: req.params.id })
    .then((result) => {
      console.log("student Deleted succesfully");
      res.redirect("/admin/top-admin/student-form/student-list");
    })

    .catch((err) => {
      console.log(err);
    });
});
//  !End student form

// !lecuters from

router.get("/lecturers-form/lecturers-list", async (req, res) => {
  await Lecturer.find()
    .then((lecturer) => {
      res.render("admin/topAdmin/lecturerslist", { lecturer });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/lecturers-form/add-new-lecturer", async (req, res) => {
  const lecturer = new Lecturer({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const newLecturer = await lecturer
      .save()
      .then((rs) => {
        console.log("new student added succesfully");
        res.redirect("/admin/top-admin/lecturers-form/lecturers-list");
      })
      .catch((err) => {
        console.log("we have err: " + err);
      });
  } catch (err) {
    console.log(`we have error in save new student ${err} `);
    res.status(400).json(`err: ${err}`);
  }
});
//delete student
router.get("/lecturers-form/delete-lecturer/:id", async (req, res) => {
  await Lecturer.findByIdAndDelete({ _id: req.params.id })
    .then((result) => {
      console.log("Lecturer Deleted succesfully");
      res.redirect("/admin/top-admin/lecturers-form/lecturers-list");
    })

    .catch((err) => {
      console.log(err);
    });
});
//  UPDATE: teachers

router.get("/lecturers-form/update-lecturer/:id", async (req, res) => {
  await Lecturer.findById({ _id: req.params.id })
    .then((user) => {
      // console.log(user);
      // console.log("hiii");
      res.render("admin/topAdmin/updateForm", {
        user,
        updateRoute: "lecturers-form/update-lecturer",
      });
    })
    .catch((err) => {
      res.send("erris " + err);
    });
});

router.post("/lecturers-form/update-lecturer/:id", async (req, res) => {
  await Lecturer.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then((lecturer) => {
      // console.log(lecturer);
      console.log("lecturer is updated succesfully");
      res.redirect("/admin/top-admin/lecturers-form/lecturers-list");
    })
    .catch((err) => {
      res.send("cant update student, err is: " + err);
    });
});
router.get("/lecturer/lecturer-project", async (req, res) => {
  await Project.find().then((projects) => {
    res.render("admin/topAdmin/project", {
      projects,
    });
  });
});

// !end of lecuters from

// !SCIENTIFIC COMMITTEES

router.get("/scientific-committees", async (req, res) => {
  await Scommittee.find()
    .then((lecturer) => {
      res.render("admin/topAdmin/scommitteeslist", { lecturer });
    })
    .catch((err) => {
      console.log(err);
    });
});

//  * add new lecturer to scientific committe
router.get("/scientific-committees/select-lecturer", async (req, res) => {
  await Scommittee.find().then(async (scom) => {
    await Lecturer.find().then((lecturers) => {
      let result1 = scom;
      let result2 = lecturers;

      let sCommitte = _.differenceWith(lecturers, scom, function (o1, o2) {
        return o1["email"] === o2["email"];
      });

      res.render("admin/topAdmin/selectScommite", { sCommitte });

      // console.log(result);
      //!end
    });
  });
});

router.post("/scientific-committees/add-scommittee", async (req, res) => {
  await Lecturer.find({ _id: req.body.lecturer })
    .then(async (lecturers) => {
      lecturers.forEach(async (lecturer, index) => {
        const newScommittee = new Scommittee({
          fullName: lecturer.fullName,
          email: lecturer.email,
          password: 123,
        });

        try {
          await newScommittee
            .save()
            .then((rs) => {
              console.log("new science commite added");
              res.redirect("/admin/top-admin/scientific-committees");
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
      });
    })

    .catch((err) => {
      console.log(err);
    });
});

//* update lecturer in scientifice commite list

router.get("/scientific-committees/update-lecturer/:id", async (req, res) => {
  await Scommittee.findById({ _id: req.params.id })
    .then((user) => {
      res.render("admin/topAdmin/updateForm", {
        user,
        updateRoute: "scientific-committees/update-lecturer",
      });
    })
    .catch((err) => {
      res.send("we cant find this lecturer in scommitte db, err is: " + err);
    });
});

router.post("/scientific-committees/update-lecturer/:id", async (req, res) => {
  await Scommittee.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then((lecturer) => {
      // console.log(lecturer);
      console.log("lecturer updatet in scientifice commite list");

      res.redirect("/admin/top-admin/scientific-committees");
    })
    .catch((err) => {
      res.send("cant update student, err is: " + err);
    });
});

//  * DELETE  - delete lecturer in scientific list

router.get("/scientific-committees/delete-lecturer/:id", async (req, res) => {
  await Scommittee.findByIdAndDelete({ _id: req.params.id })
    .then((result) => {
      console.log("Lecturer Deleted succesfully");
      res.redirect("/admin/top-admin/scientific-committees");
    })

    .catch((err) => {
      console.log(
        `we cant delete lecturer in the scientific committee list, ERR is: ${err}`
      );
    });
});

// !END OF SCIENTIFIC COMMITTEES

//  !admin
router.get("/admin-form/admin-list", async (req, res) => {
  await Admin.find().then((admins) => {
    res.render("admin/topAdmin/adminlist", { admins });
  });
});
router.post("/admin-form/add-admin-list", (req, res) => {
  const newUnderTopAdmin = new Admin({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    newUnderTopAdmin
      .save()
      .then((rs) => {
        console.log("new admin added successfully");
        res.redirect("/admin/top-admin/admin-form/admin-list");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

//  UPDATE: SCIENTIFIC COMMITTES

router.get("/admin-form/update-admin/:id", async (req, res) => {
  await Admin.findById({ _id: req.params.id })
    .then((user) => {
      res.render("admin/topAdmin/updateForm", {
        user,
        updateRoute: "admin-form/update-admin",
      });
    })
    .catch((err) => {
      res.send("erris " + err);
    });
});

router.post("/admin-form/update-admin/:id", async (req, res) => {
  await Admin.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then((lecturer) => {
      // console.log(lecturer);
      console.log("lecturer is updated succesfully");
      res.redirect("/admin/top-admin/admin-form/admin-list");
    })
    .catch((err) => {
      res.send("cant update student, err is: " + err);
    });
});

//delete student
router.get("/admin-form/delete-admin/:id", async (req, res) => {
  await Admin.findByIdAndDelete({ _id: req.params.id })
    .then((result) => {
      console.log("admin Deleted succesfully");
      res.redirect("/admin/top-admin/admin-form/admin-list");
    })

    .catch((err) => {
      console.log(err);
    });
});
//  !END admin

//! top admin send email to lecturers projects
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

//  add new top admin
router.post("/add-top-admin", async (req, res) => {
  const newTopAdmin = new TopAdmin({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await newTopAdmin.save().then((data) => {
      console.log("new top admin added..!!");
    });
  } catch (err) {
    res.json({
      message: err,
    });
  }
});

module.exports = router;
