const express = require("express");
const router = express.Router();

const TopAdmin = require("../models/topAdmin");
const Lecturer = require("../models/lecturer");
const sCommitte = require("../models/scientificCommitte");
const Admin = require("../models/admin");

//  check which admin is try to login
router.get("/", (req, res) => {
  const topAdminEmailError = req.flash("top-admin-email");
  const topAdminPassError = req.flash("top-admin-pass");
  const lecturerEmail = req.flash("lecturer-email");
  const lecturerPass = req.flash("lecturer-pass");
  const scommiteEmail = req.flash("scommite-email");
  const scommitePass = req.flash("scommite-pass");

  res.render("admin/adminlogin", {
    topAdminEmailError,
    topAdminPassError,
    lecturerEmail,
    lecturerPass,
    scommiteEmail,
    scommitePass,
  });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  if (req.body.select === "topAdmin") {
    await TopAdmin.findOne({ email: req.body.email })
      .then((topAdminData) => {
        if (topAdminData.password === req.body.password) {
          res.cookie("topAdmin", {
            name: topAdminData.fullName,
            email: topAdminData.email,
            id: topAdminData.id,
          });

          return res.redirect("/admin/top-admin");
        } else {
          req.flash("top-admin-pass", "top admin, password is incorrect");
          res.redirect("/admin");
        }
      })
      .catch((err) => {
        req.flash(
          "top-admin-email",
          "we can not find top admin with that email"
        );
        res.redirect("/admin");
      });
  } else if (req.body.select === "lecturer") {
    await Lecturer.findOne({ email: req.body.email })
      .then((lecturerData) => {
        if (lecturerData.password === req.body.password) {
          console.log("lecturerData");

          // console.log(lecturerData);
          res.cookie("lecturer", {
            name: lecturerData.fullName,
            email: lecturerData.email,
            id: lecturerData.id,
          });
          return res.redirect("/admin/lecturer");
        } else {
          req.flash("lecturer-pass", "lecturer password is incorrect");
          res.redirect("/admin");
        }
      })
      .catch((err) => {
        req.flash("lecturer-email", "lecturer email is incorrect");
        res.redirect("/admin");
      });
  } else if (req.body.select === "sCommite") {
    await sCommitte
      .findOne({ email: req.body.email })
      .then((sCommitteData) => {
        if (sCommitteData.password === req.body.password) {
          res.cookie("sCommitte", {
            name: sCommitteData.fullName,
            id: sCommitteData.id,
          });
          console.log(sCommitteData);
          return res.redirect("/admin/scommitte");
        } else {
          req.flash(
            "scommite-pass",
            "scientific commite password is incorrect"
          );
          res.redirect("/admin");
        }
      })
      .catch((err) => {
        req.flash("scommite-email", "scientific commite email is incorrect");
        res.redirect("/admin");
      });
  } else if (req.body.select === "admin") {
    await Admin.findOne({ email: req.body.email })
      .then((user) => {
        if (user.password === req.body.password) {
          res.cookie("admin", {
            name: user.fullName,
            email: user.email,
            id: user.id,
          });
          console.log(user);
          return res.redirect("/admin/tadmin");
        } else {
          req.flash("Admin-pass", "Admin password is incorrect");
          res.redirect("/admin");
        }
      })
      .catch((err) => {
        req.flash("scommite-email", "Admin email is incorrect");
        res.redirect("/admin");
      });
  } else {
    res.send(".....");
  }
});

//  top admin

// end of top admin
module.exports = router;
