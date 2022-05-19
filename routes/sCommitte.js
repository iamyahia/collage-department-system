const express = require("express");
const router = express.Router();
//! Models
const conditionalProjectDB = require("../models/conditionalProject");
const Project = require("../models/project");
const Lecturer = require("../models/lecturer");

//! Route
router.get("/", async (req, res) => {
  await conditionalProjectDB
    .find()
    .then((project) => {
      // console.log(project);
      res.render("admin/sCommitte/projectacceptance", { project });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/accept/:id", async (req, res) => {
  console.log(`req.params.id: ${req.params.id}   `);
  //  1:  get this project from conditionalPrDB
  await conditionalProjectDB
    .findById({ _id: req.params.id })
    .then(async (project) => {
      const newProject = new Project({
        projectAuthor: project.projectAuthor,
        projectName: project.projectName,
        projectInfo: project.projectInfo,
      });

      try {
        await newProject
          .save()
          .then(async (data) => {
            console.log("prject accepted succefully");

            await conditionalProjectDB
              .findByIdAndDelete({ _id: req.params.id })
              .then(async (dlData) => {
                console.log("prject SUCCESFULLY, deleted in database  ...");
              });

            //  update lecturer project in their data in database
            try {
              console.log("project data");
              console.log(project);
              await Lecturer.findOneAndUpdate(
                { fullName: project.projectAuthor },
                { project: newProject },
                (reqq, ress) => {
                  console.log("lecturer updated");
                  res.redirect("/admin/scommitte");
                }
              );
            } catch (err) {
              console.log(err);
            }
          })
          .catch((err) =>
            console.log(`cant save new project we have err: ${err}`)
          );
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  //  2;  save this project in project.db

  //  3:  delete this project in conditionalPrDB
});

router.get("/reject/:id", async (req, res) => {
  await conditionalProjectDB
    .findByIdAndDelete({ _id: req.params.id })
    .then((project) => {
      res.redirect("/admin/scommitte");
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(req.body);
});

module.exports = router;
