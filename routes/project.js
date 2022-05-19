//  !packages
const express = require("express");
const router = express.Router();

//  !middleware

//  !models
const Projects = require("../models/project");
const ConSortingProject = require("../models/conditional-sorting-projects");
const Student = require("../models/student");

router.get("/sorting-project", async (req, res) => {
  await Projects.find()
    .then((projectsData) => {
      // res.json(projectsData);

      res.render("project/projectsorting", {
        projectsData,
      });
    })
    .catch((err) => {
      res.json({
        message: "we have err (project.js)",
        err: err,
      });
    });
});
router.post("/sorting-project", async (req, res) => {
  console.log(req.body.projectAuthor);

  const currentUser = req.cookies.student; //*  we use cookie for finding the current user team
  // console.log(currentUser.id);

  Student.findById({ _id: currentUser.id })
    .then(async (currentSt) => {
      // console.log(currentSt);

      const currentTeam = currentSt.teamMembers[0].teamMembers;
      // console.log("currentTEam");
      // console.log(currentTeam);

      //TODO: save user lsit to ConSortingProject db
      const newConStPr = new ConSortingProject({
        projectAuthors: req.body.projectAuthor,
        projectMembers: currentTeam,
      });
      console.log(newConStPr);

      await newConStPr
        .save()
        .then(() => {
          console.log("student list of sorted project saved....");
          res.redirect("/student/your-team");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

// router.post("/sorting-project", async (req, res) => {
//   let members;
//   //TODO: get current student in cookie, for get their teamMembers.
//   const currentStudent = req.cookies.student;
//   // console.log(currentStudent);
//   Student.find({ email: currentStudent.email })
//     .then((student) => {
//       console.log(student[0].teamMembers[0]);
//       //TODO: get the team members of current sutdent.
//       members = student[0].teamMembers[0].teamMembers;

//       /*
//       TODO: get the list that user submited in /project/sorting-project .
//       * we just use the project author, because with that project author we can search for the whole project detail in Project table, i
//       */

//       const bodyAuthor = req.body.projectAuthor;

//       //  TODO: save the projects in ConSortingProject db
//       const newConProject = ConSortingProject({
//         projectAuthors: bodyAuthor,
//         projectMembers: members,
//       });

//       newConProject
//         .save()
//         .then((data) => {
//           console.log("project saved in ConSorting project DB...");
//           res.redirect("/student/your-team");
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   //TODO: **we use this method in showing the authors project in Admin dashboard
//   // Projects.find({ projectAuthor: projects }).then((projects) => {
//   //   projects.forEach(async (pr) => {
//   //     newConProject = ConSortingProject({
//   //       projectAuthor: pr.projectAuthor,
//   //       projectName: pr.projectName,
//   //       projectInfo: pr.projectInfo,
//   //     });

//   //     await newConProject
//   //       .save()
//   //       .then((data) => {
//   //         console.log("your sorting projects is submited to dashboard");
//   //       })
//   //       .catch((err) => {
//   //         console.log(
//   //           "does not submit the sorting project, please try again later or contact to our support team"
//   //         );
//   //         console.log(err);
//   //       });
//   //     console.log(newConProject);
//   //   });
//   // });
// });
