const router = require("express").Router();
const jwt = require("jsonwebtoken");

//! models
const Student = require("../models/student");
const TopAdmin = require("../models/topAdmin");
const Admin = require("../models/admin");
const SCommitte = require("../models/scientificCommitte");
const Lecturer = require("../models/lecturer");

router.get("/:id/:token", (req, res) => {
  console.log(req.params);
  console.log("req.cookies");
  console.log(req.cookies);

  const currentRole = req.cookies.role;
  console.log(`currentRole: ${currentRole}`);

  //!   student
  if (currentRole === "student") {
    //*   verify token, that we get in req
    //* check the req.params.id that we have in the database
    Student.findOne({ _id: req.params.id })
      .then((student) => {
        console.log(student);
        const secret = "secret" + student.password;

        try {
          //
          const payload = jwt.verify(req.params.token, secret);
          res.render("resetPassword");
          //
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("invalid user id with token.id");
        console.log(err);
      });
  }
  //!   top-admin
  else if (currentRole === "topAdmin") {
    //*   verify token, that we get in req
    //* check the req.params.id that we have in the database
    TopAdmin.findOne({ _id: req.params.id })
      .then((user) => {
        console.log("reset-password:  top-admin");
        console.log(user);
        const secret = "secret" + user.password;

        try {
          //
          const payload = jwt.verify(req.params.token, secret);
          res.render("resetPassword");
          //
        } catch (err) {
          console.log("payload error");
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("invalid user id with token.id");
        console.log(err);
      });
  }
  //!   admin
  else if (currentRole === "admin") {
    //*   verify token, that we get in req
    //* check the req.params.id that we have in the database
    Admin.findOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
        const secret = "secret" + user.password;

        try {
          //
          const payload = jwt.verify(req.params.token, secret);
          res.render("resetPassword");
          //
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("invalid user id with token.id");
        console.log(err);
      });
  }

  //!   s.committe
  else if (currentRole === "sCommite") {
    //*   verify token, that we get in req
    //* check the req.params.id that we have in the database
    SCommitte.findOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
        const secret = "secret" + user.password;

        try {
          //
          const payload = jwt.verify(req.params.token, secret);
          res.render("resetPassword");
          //
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("invalid user id with token.id");
        console.log(err);
      });
  }

  //!   lecturer
  else if (currentRole === "lecturer") {
    //*   verify token, that we get in req
    //* check the req.params.id that we have in the database
    Lecturer.findOne({ _id: req.params.id })
      .then((user) => {
        console.log(user);
        const secret = "secret" + user.password;

        try {
          //
          const payload = jwt.verify(req.params.token, secret);
          res.render("resetPassword");
          //
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log("invalid user id with token.id");
        console.log(err);
      });
  }
});

router.post("/:id/:token", async (req, res) => {
  console.log(req.body);
  console.log("/reset password token");
  console.log(req.params);

  //!   get the role of user in cookies
  const currentRole = req.cookies.role;

  console.log(`current role: ${currentRole}`);
  if (req.body.password === req.body.confirmPassword) {
    console.log("both pass is correct");
    //!   student
    if (currentRole === "student") {
      Student.findOne({ _id: req.params.id })
        .then(async (student) => {
          console.log(student);

          const secret = "secret" + student.password;

          try {
            //*   verify the current user
            const payload = jwt.verify(req.params.token, secret);

            //*   validate password and confirmed password amtch
            //*   find user with payload (email - user id ) and finally update new password
            await Student.findOneAndUpdate(
              { _id: req.params.id },
              { password: req.body.password }
            ).then((data) => {
              console.log("student password updated succesfully");
              res.redirect("/student/login");
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("invalid user id with token.id");
          console.log(err);
        });
    } else if (currentRole === "topAdmin") {
      TopAdmin.findOne({ _id: req.params.id })
        .then(async (user) => {
          console.log(user);

          const secret = "secret" + user.password;

          try {
            //*   verify the current user
            const payload = jwt.verify(req.params.token, secret);

            //*   validate password and confirmed password amtch
            //*   find user with payload (email - user id ) and finally update new password
            await TopAdmin.findOneAndUpdate(
              { _id: req.params.id },
              { password: req.body.password }
            ).then((data) => {
              console.log("user password updated succesfully");
              res.redirect("/admin");
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("invalid user id with token.id");
          console.log(err);
        });
    }
    //! admin
    else if (currentRole === "admin") {
      Admin.findOne({ _id: req.params.id })
        .then(async (user) => {
          console.log(user);

          const secret = "secret" + user.password;

          try {
            //*   verify the current user
            const payload = jwt.verify(req.params.token, secret);

            //*   validate password and confirmed password amtch
            //*   find user with payload (email - user id ) and finally update new password
            await Admin.findOneAndUpdate(
              { _id: req.params.id },
              { password: req.body.password }
            ).then((data) => {
              console.log("user password updated succesfully");
              res.redirect("/user/login");
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("invalid user id with token.id");
          console.log(err);
        });
    }
    //!   s.commite
    else if (currentRole === "sCommite") {
      SCommitte.findOne({ _id: req.params.id })
        .then(async (user) => {
          console.log(user);

          const secret = "secret" + user.password;

          try {
            //*   verify the current user
            const payload = jwt.verify(req.params.token, secret);

            //*   validate password and confirmed password amtch
            //*   find user with payload (email - user id ) and finally update new password
            await SCommitte.findOneAndUpdate(
              { _id: req.params.id },
              { password: req.body.password }
            ).then((data) => {
              console.log("user password updated succesfully");
              res.redirect("/admin");
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("invalid user id with token.id");
          console.log(err);
        });
    }

    //!   lecturer
    else if (currentRole === "lecturer") {
      Lecturer.findOne({ _id: req.params.id })
        .then(async (user) => {
          console.log("user data:");
          console.log(user);

          const secret = "secret" + user.password;

          try {
            //*   verify the current user
            const payload = jwt.verify(req.params.token, secret);

            //*   validate password and confirmed password amtch
            //*   find user with payload (email - user id ) and finally update new password
            await Lecturer.findOneAndUpdate(
              { _id: req.params.id },
              { password: req.body.password }
            ).then((data) => {
              console.log("user password updated succesfully");
              res.redirect("/admin");
            });
          } catch (err) {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("invalid user id with token.id");
          console.log(err);
        });
    }
  } else {
    console.log("password and confirm password must same");
  }
});

module.exports = router;
