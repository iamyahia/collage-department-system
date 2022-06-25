require("./config/db");
//  !packages
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// !Middleware
//  get data from front-end
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
// *set Routes
app.use("/student", require("./routes/student"));
app.use("/project", require("./routes/project"));
app.use("/admin", require("./routes/admin"));
app.use("/admin/top-admin/", require("./routes/topAdmin/index"));
app.use("/admin/lecturer", require("./routes/lecturer"));
app.use("/admin/sCommitte", require("./routes/sCommitte"));
app.use("/admin/tadmin", require("./routes/TAdmin"));
app.use("/forgot-password", require("./routes/forgotPassword"));
app.use("/reset-password", require("./routes/resetPassword"));

app.use("/test", require("./routes/test"));

//  !Models
const Project = require("./models/project");
const Student = require("./models/student");
const Team = require("./models/team");

//*  automation

/*
    TODO: check that all student have team ...
    ?     if not? 
    *     that mean we have some students that does not have team.
*/
Student.find().then((students) => {
  const isStConProject = []; //* if this array ===0, that mean all student have teamMembers, because if some student's does not have team, we push one data to this array, so if length of this array ==3 that we mean we have 3 students, that does not have team, ok ....
  students.forEach((student, index) => {
    // console.log(student.teamMembers[0].conProject.length);
    // console.log(student.id);

    //* we check students that have teamMember of not ...
    if (student.teamMembers.length === 0) {
      console.log("student.teamMembers.length is ZERROO");
      isStConProject.push(index);
    }
  });
  if (isStConProject.length === 0) {
    const isTeamConProject = []; //* if this array ===0, that mean all teams have sorted thier list of projects (mean have conProject), because if some team does not have team, we push one 1 to this array, so if length of this array ==3 that we mean we have 3 teams, that does not have conProject(doesnnot sort project), ok ....

    Team.find().then((teams) => {
      teams.forEach((team, indexB) => {
        console.log(team.conProject.length);

        if (team.conProject.length === 0) {
          isTeamConProject.push(1);
        }
      });

      // console.log("isTeamConProject");
      // console.log(isTeamConProject.length);
      //*
      if (isTeamConProject.length === 0) {
        //TODO: PROGRAM THE AUTOMATION...

        //TODO: 1) sort teams grade
        console.log("teams ... totalGrade");

        let totalGrade = [];

        //TODO: push total graade to totalGrade variable...
        teams.forEach((team, indexC) => {
          console.log(team.totalGrade);
          totalGrade.push(team.totalGrade);
        });
        totalGrade.sort((a, b) => b - a);

        console.log("total grade");
        console.log(totalGrade);

        // //? we use loadash..
        // console.log("\t -----------------gfg--------------");

        // const last = randomProject.length;
        // let sortedCollection = _.sortBy(randomProject, function (item) {
        //   return isConProject[0].projectAuthors.indexOf(item.projectAuthor) !==
        //     -1
        //     ? isConProject[0].projectAuthors.indexOf(item.projectAuthor)
        //     : last;
        // });
      }
    });
  }

  // if(isConProject.length === 0){

  // }
});

//TODO: check all team, have listed thier project or not ...
// Team.find().then((teams) => {
//   const isProject = []; //* if length of array == 0, mean we have some team that does not have project, if array = 3 mean we have 3 team that have project
//   const teamGrades = []; //* push all grades of teams and sort it...

//   teams.forEach((team, index) => {
//     //* push team grade to variable
//     teamGrades.push(team.totalGrade);

//     if (!team.project) {
//       isProject.push(1);
//     }
//   });

//   console.log(teamGrades.sort((a, b) => b - a));
//   //* Make sure that all team, have project...
//   // if (isProject.length === 0) {
//   //* check that all student have team
//   Student.find().then((students) => {
//     const isTeam = []; //* if length of array == 0, mean studentsdoes not have any team, if array = 3 mean we have 3 student that does not have team.

//     students.forEach((student, index) => {
//       //* check if student don't have team.
//       if (student.teamMembers.length === 0) {
//         //* this condition mean the actual student, doesnot have teamMmebers, so if it's have the length of array will be 1, arr=1.
//         isTeam.push(1);
//       }
//       //*
//     });

//     //* isteam.length = 0 mean every student have team
//     if (isTeam.length === 0) {
//       console.log("helelo");
//     }
//     console.log(isTeam.length);
//   });
//   // }
// });

//

app.listen(5000, console.log("Server Start on port: 5000"));
