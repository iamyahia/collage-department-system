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
  //  search for the student in Student table,
  const submittedId = req.body.studentId;
  console.log("submitted id");
  console.log(submittedId);
  const currentStudent = req.cookies.student;

  //
  let total = 0;

  //

  const foundedStudent = [];
  Student.find()
    .then(async (student) => {
      foundedStudent.push(currentStudent.email); //*  we use this code for push the current user to user, because withoute this code we have a problem:  we cant the current student in team members.

      student.forEach((st, index) => {
        submittedId.forEach((sbId, index) => {
          if (st.id === sbId) {
            foundedStudent.push(st.email);
          }
        });
      });

      // console.log("founded");
      // console.log(foundedStudent);
      //  add new team Information to the team collection
      const teamInfo = new Team({
        teamName: req.body.teamName,
        teamMembers: foundedStudent,
      });

      // console.log("teamInfo");
      // console.log(teamInfo);

      //  TODO: STORE ALL USER GRADE IN TEAM DATABASE
      Student.find({ email: foundedStudent }).then(async (spDatas) => {
        // console.log("spdatas");
        // console.log(spDatas);

        spDatas.forEach((spData) => {
          console.log(spData.grade);

          total += Number(spData.grade);
        });

        console.log("total");
        console.log(total);

        try {
          await teamInfo.save().then((data) => {
            console.log("new team is added");
          });
        } catch (err) {
          res.json({
            message: "cant add new team",
            err: err,
          });
        }

        //  update the students that selected from the team members
        const teamMembersId = teamInfo.teamMembers;
        console.log(teamMembersId);
        try {
          teamMembersId.forEach((res, index) => {
            Student.findOneAndUpdate(
              { email: teamMembersId[index] },
              { teamMembers: teamInfo },
              (reqq, ress) => {
                console.log("students update their team");
              }
            );
          });

          //TODO: save&update totalGrades of current team
          Team.findOneAndUpdate(
            { teamMembers: foundedStudent },
            { totalGrade: total },
            (reqq, ress) => {
              console.log("total grades updated");
              res.redirect("/project/sorting-project");
            }
          );
        } catch (err) {
          console.log(err);
          res.json({
            message: err,
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
      const studentTeam = student.teamMembers[0];

      const membersId = studentTeam.teamMembers; //* we use this variable for inserting teamMembers fullName of current user.

      console.log("membersId");

      console.log(membersId);
      //TODO:  find full name team members of currentuser,
      Student.find({ email: membersId })
        .then((currentTeam) => {
          console.log("success");
          console.log(currentTeam);

          const crMembers = currentTeam[0].teamMembers[0].teamMembers;
          console.log("crMembers");
          console.log(crMembers);

          //TODO: search for projectsTeam  that they submitted, if they not submite make a link to /project/sorting-project.
          ConStProject.find({ projectMembers: crMembers }).then(
            (conProject) => {
              console.log("conProject");
              console.log(conProject);
              let ctTest;
              if (conProject === undefined) {
                ctTest = conProject.projectAuthors;
              } else {
                ctTest = conProject[0].projectAuthors;
              }
              // console.log(
              //   "%this is the project that already sorted in con-st-Project db but we just have author without the whole auther project detail ",
              //   "color:green !important"
              // );

              console.log("ctTest");
              console.log(ctTest);

              Project.find({
                projectAuthor: ctTest,
              }).then((randomProject) => {
                //* now variable of randomProject does not, team that they sorted the project, so we need to sort like the conProject[0].projectAuthors sort

                // console.log("%cRandome project list", "color:red");
                // console.log(randomProject);

                //? we use loadash..
                // console.log("\t -----------------gfg--------------");

                const last = randomProject.length;
                let sortedCollection = _.sortBy(randomProject, function (item) {
                  return ctTest.indexOf(item.projectAuthor) !== -1
                    ? ctTest.indexOf(item.projectAuthor)
                    : last;
                });

                //*

                // console.log("%sorted project list");

                // console.log(sortedCollection)
                if (sortedCollection.length === 0) {
                  console.log("null");
                }

                res.render("student/existStu", {
                  team: currentTeam,
                  sortedCollection,
                });
              });
            }
          );

          //
        })
        .catch((err) => {
          console.log("error");
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
