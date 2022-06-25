const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//!   models
const Student = require("../models/student");
const Team = require("../models/team");
const ConStProject = require("../models/conditional-sorting-projects");
const Project = require("../models/project");

//! packages
const _ = require("lodash");

// // isAuth middlware
// const { isAuth } = require("./middleware");

//* we use this varible for condition, that if user already have team or not...
let userReqInfo;

//
router.get("/", (req, res) => {
  res.redirect("/student/login");
});
// login
router.get("/login", (req, res) => {
  const emailError = req.flash("email");
  const passError = req.flash("pass");

  console.log(passError);

  //  for running stdlogin.ejs
  res.render("student/stdlogin", {
    title: "Student | login",
    emailError,
    passError,
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  Student.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        if (data.password == req.body.password) {
          userReqInfo = data;
          //* set cookie for student, we use student cookie information in /your-team route
          res.cookie("student", {
            name: data.fullName,
            email: data.email,
            id: data.id,
          });
          //  for make sure , user have team
          const userReqIdTeam = userReqInfo.teamMembers;

          console.log(userReqIdTeam);

          //  if user does not have any team  /else mean user have team
          if (userReqIdTeam == 0) {
            console.log(data);
            res.redirect("/student/selecting-group");
          } else {
            res.redirect("/student/your-team");
          }
        } else {
          req.flash("pass", "your password is incorrect");
          res.redirect("/student/login");
        }
      } else {
        req.flash("email", "Email is incorrect");
        res.redirect("/student/login");
        // res.send({ Success: "This Email Is not regestered!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err });
    });
});

//

//  select your team members
router.get("/selecting-group", async (req, res) => {
  const studentsInfo = await Student.find()
    .then((studentData) => {
      const currentStudent = req.cookies.student;
      console.log("current student");

      res.render("student/selectinggroup", {
        title: "Memebers",
        data: studentData,
        currentStudent: currentStudent,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: err,
      });
    });
});

router.post("/selecting-group", async (req, res) => {
  //  selected student in form...
  const submittedId = req.body.studentId;
  //  currentStudent that logged in...
  const currentStudent = req.cookies.student;

  const selectedStudentId = []; //TODO: PUSH email in student database, then save to teamInfo ...
  let total = 0; //* addition of grades of team members.

  //TODO: find that current student that loggedin ...
  Student.find({ _id: submittedId })
    .then(async (students) => {
      //  TODO: we repeat Studnet, just for addition of current student grade with members grades just for( line 121 -> 130) ...
      //  TODO: STORE ALL USER GRADE IN TEAM DATABASE
      Student.find({ _id: currentStudent.id }).then(async (currentSt) => {
        selectedStudentId.push(currentStudent.email); //*  we use this code for push the current user to user, because withoute this code we have a problem:  we cant the current student in team members.
        students.forEach((spData) => {
          selectedStudentId.push(spData.email);
          total += Number(spData.grade);
        });

        total += Number(currentSt[0].grade);
        // console.log("total");
        // console.log(total);
        // console.log("selectedStudentId:");
        // console.log(selectedStudentId);

        const teamInfo = new Team({
          teamName: req.body.teamName,
          teamMembers: selectedStudentId,
          totalGrade: total,
        });

        // console.log("teamInfo");
        // console.log(teamInfo);

        try {
          await teamInfo.save().then((data) => {
            console.log("new team is added");

            //TODO:  update the students that selected from the team members
            const teamMembersId = teamInfo.teamMembers;
            console.log("teamMembersId");
            // console.log(teamMembersId);

            try {
              teamMembersId.forEach((resss, index) => {
                Student.findOneAndUpdate(
                  { email: resss },
                  { teamMembers: teamInfo },
                  (reqq, ress) => {
                    console.log("students update their team");
                  }
                );
              });
              res.redirect("/project/sorting-project");
            } catch (err) {
              console.log(err);
              res.json({
                message: err,
              });
            }
          });
        } catch (err) {
          res.json({
            message: "cant add new team",
            err: err,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//  after student choose their team members,

//  show thieir team members
router.get("/your-team", async (req, res) => {
  const currentStudent = req.cookies.student;

  //TODO: find currentStudent data.
  await Student.findById({ _id: currentStudent.id })

    .then((student) => {
      //TODO: get teamMembers of currentUser
      // console.log(student.teamMembers);
      //* if user does not have team and type this route: /student/your-team then redirect to /student/selecting-group
      if (student.teamMembers.length != 0) {
        // console.log("student");

        // console.log(student.teamMembers[0]);

        const studentTeam = student.teamMembers[0].teamMembers; //* we use this variable for inserting teamMembers email, then find those email in Student table

        // //TODO:  find full name OF team members of currentuser,
        Student.find({ email: studentTeam }).then((students) => {
          // console.log("success");

          // console.log(students);

          const isConProject = students[0].teamMembers[0].conProject;
          // console.log("isConProject");

          // console.log(isConProject);
          if (isConProject.length === 0) {
            // console.log(" is project = 0");
            // console.log(isConProject.length);

            res.render("student/existStu", {
              team: students,
              isConProject: false,
            });
          } else {
            // console.log("is Con Project: ");

            // console.log(isConProject[0].projectAuthors);

            Project.find().then((randomProject) => {
              // console.log(randomProject);

              //? we use loadash..
              // console.log("\t -----------------gfg--------------");

              const last = randomProject.length;
              let sortedCollection = _.sortBy(randomProject, function (item) {
                return isConProject[0].projectAuthors.indexOf(
                  item.projectAuthor
                ) !== -1
                  ? isConProject[0].projectAuthors.indexOf(item.projectAuthor)
                  : last;
              });

              // console.log("sorted collection");
              // console.log(sortedCollection);
              res.render("student/existStu", {
                team: students,
                isConProject: true,
                sortedCollection,
              });
            });
          }

          //     //TODO: search for sorted projects that the team submitted, if they not submite make a link to /project/sorting-project.
          //     ConStProject.find({ projectMembers: crMembers }).then( //? we dont use conditional-sorting-project because we already have, conProject in team collumn,
          //       (conProject) => {
          //         console.log("conProject");
          //         console.log(conProject);
          //         let ctTest;
          //         if (conProject === undefined) {
          //           ctTest = conProject.projectAuthors;
          //         } else {
          //           ctTest = conProject[0].projectAuthors;
          //         }
          //         // console.log(
          //         //   "%this is the project that already sorted in con-st-Project db but we just have author without the whole auther project detail ",
          //         //   "color:green !important"
          //         // );

          //         console.log("ctTest");
          //         console.log(ctTest);

          //          Project.find( ).then((randomProject) => {
          //           //* now variable of randomProject does not, team that they sorted the project, so we need to sort like the conProject[0].projectAuthors sort

          //           // console.log("%cRandome project list", "color:red");
          //           // console.log(randomProject);

          //           //? we use loadash..
          //           // console.log("\t -----------------gfg--------------");

          //           const last = randomProject.length;
          //           let sortedCollection = _.sortBy(randomProject, function (item) {
          //             return ctTest.indexOf(item.projectAuthor) !== -1
          //               ? ctTest.indexOf(item.projectAuthor)
          //               : last;
          //           });

          //           //*

          //           // console.log("%sorted project list");

          //           // console.log(sortedCollection)
          //           if (sortedCollection.length === 0) {
          //             console.log("null");
          //           }

          //           res.render("student/existStu", {
          //             team: currentTeam,
          //             sortedCollection,
          //           });
          //         });
          //       }
          //     );

          //     //
        });
        //   .catch((err) => {
        //     console.log("error");
        //     console.log(err);
        //   });
      } else {
        res.redirect("/student/selecting-group");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
