const express = require("express");
const router = express.Router();

const conditionalProjects = require("../models/conditionalProject");
const Project = require("../models/project");
//  /   :   /lecturer/
router.get("/", (req, res) => {
  const currentLecturer = req.cookies.lecturer;

  let accepted = false; //* this is for status of lecturer project
  let renderProject;

  Project.findOne({ projectAuthor: currentLecturer.name }).then(
    (acceptedProject) => {
      if (acceptedProject) {
        renderProject = acceptedProject;
        accepted = true;
        return res.render("admin/lecturer/lecturerProject", {
          renderProject,
          accepted,
        });
      }
      conditionalProjects
        .findOne({ projectAuthor: currentLecturer.name })
        .then((currentProject) => {
          renderProject = currentProject;
          //* check if user already have project or not...
          if (currentProject) {
            return res.render("admin/lecturer/lecturerProject", {
              renderProject,
              accepted,
            });
          } else {
            return res.render("admin/lecturer/lecturer", {
              currentLecturer,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
});

router.post("/", async (req, res) => {
  const currentLecturer = req.cookies.lecturer;
  console.log("currentLecturer");
  console.log(currentLecturer);
  const currentProject = new conditionalProjects({
    projectAuthor: currentLecturer.name,
    projectName: req.body.title,
    projectInfo: req.body.discription,
  });

  try {
    const newConditionalProjects = await currentProject
      .save()
      .then((conditionProject) => {
        console.log("new conditional project added succesfully");
        //? create an .ejs page for the lecturer project that submitted, and show the status of lecturer  project mean accepted or not..!
        res.redirect("/admin/lecturer/");
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
