//  !packages
const express = require("express");
const router = express.Router();

//  !middleware

//  !models
const Projects = require("../models/project");
const Student = require("../models/student");
const Team = require("../models/team");

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

//TODO: when user list their project, update those part: 1) student -> teamMembers -> conStProject .  2) team -> conProject
router.post("/sorting-project", async (req, res) => {
  // console.log(req.body.projectAuthor);

  const currentUser = req.cookies.student; //*  we use cookie for finding the current user team
  // console.log(currentUser.id);

  //* we search for current student data in Student table, then get curretn team member then, save in tcon Sorting project
  Student.findById({ _id: currentUser.id })
    .then(async (currentSt) => {
      // console.log(currentSt);

      const currentTeam = currentSt.teamMembers[0].teamMembers;
      console.log("currentTEam");
      console.log(currentTeam);

      //TODO: update all students collumn -> (conditiona-student-project)
      Student.find({ email: currentTeam }).then((students) => {
        console.log("current teammember");
        // console.log(students);

        students.forEach((st, index) => {
          console.log("st.teamMembers[0].teamName");

          console.log(st.teamMembers[0].teamName);
          Student.findByIdAndUpdate(
            { _id: st._id },
            // {
            //   "teamMembers.conProject.projectAuthors": req.body.projectAuthor,
            //   "teamMembers.conProject.projectMembers": currentTeam,
            // }
            {
              teamMembers: {
                teamName: st.teamMembers[0].teamName,
                teamMembers: currentTeam,

                conProject: {
                  projectAuthors: req.body.projectAuthor,
                  projectMembers: currentTeam,
                },
                totalGrade: st.teamMembers[0].totalGrade,
              },
            }
          ).then(() => {
            console.log("update student");
          });
        });

        //TODO: update team collumn -> (team -> conditiona-student-project)
        Team.findOneAndUpdate(
          { teamMembers: currentTeam },
          {
            conProject: {
              projectAuthors: req.body.projectAuthor,
              projectMembers: currentTeam,
            },
          }
        ).then(() => {
          console.log("team constPr updated");
          res.redirect("/student/your-team");
        });
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
