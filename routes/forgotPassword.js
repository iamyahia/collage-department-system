const router = require("express").Router();
const Student = require("../models/student");
const jwt = require("jsonwebtoken");

//! functionallity
const sendMail = require("../config/email");

//! modeles
const TopAdmin = require("../models/topAdmin");
const Admin = require("../models/admin");
const SCommitte = require("../models/scientificCommitte");
const Lecturer = require("../models/lecturer");

router.get("/", (req, res) => {
  res.render("forgotPassword");
});
router.post("/", async (req, res) => {
  console.log(req.body);

  //!   student
  if (req.body.select === "student") {
    res.cookie("role", "student");
    //* make sure user in database
    await Student.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);

        //*   user exist then, now create one time link valid for 15min
        const secret = "secret" + user.password;
        const payload = {
          email: user.email,
          id: user.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        //* when user click this link(this link send to the user email), where to go?
        const link = `http://127.0.0.1:5000/reset-password/${user.id}/${token}`;
        //*   send email now
        sendMail(
          user.email,
          "Reset password",
          `
              <hi>  hi ${user.fullName}.</h1> <br/>

        <p>
        Forgot your password?</br>
         No worries. It happens to everyone. We’ve made it easy for you to access project system again.
         </br>
        You can reset your password immediately by <strong><a href="${link}">clicking here .</a></strong>
        </p>
        <p>
        If you run into any other problems, drop us a line at <strong> finalptoject@gmail.com </strong>.
        </br>
        Best regard.
          The project System Team
        </p>
        `
        );
        res.send(
          "Please check your email. Instructions were sent to your email address."
        );
      })
      .catch((err) => {
        console.log("we cant find user with that email");
        console.log(err);
      });
  }
  //! top admin
  else if (req.body.select === "topAdmin") {
    res.cookie("role", "topAdmin");

    //* make sure user in database
    await TopAdmin.findOne({ email: req.body.email })
      .then((user) => {
        // console.log(user);
        console.log("gget cookie");
        console.log(req.cookies);

        //*   user exist then, now create one time link valid for 15min
        const secret = "secret" + user.password;
        const payload = {
          email: user.email,
          id: user.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        //* when user click this link(this link send to the user email), where to go?
        const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
        console.log(link);

        //*   send email now
        sendMail(
          user.email,
          "Reset password",
          `
                <hi>  hi ${user.fullName}.</h1> <br/>
  
          <p>
          Forgot your password?</br>
           No worries. It happens to everyone. We’ve made it easy for you to access project system again.
           </br>
          You can reset your password immediately by <strong><a href="${link}">clicking here .</a></strong>
          </p>
          <p>
          If you run into any other problems, drop us a line at <strong> finalptoject@gmail.com </strong>.
          </br>
          Best regard.
            The project System Team
          </p>
          `
        );

        res.send(
          "Please check your email. Instructions were sent to your email address."
        );
      })
      .catch((err) => {
        console.log("we cant find student with that email");
        console.log(err);
      });
  }

  //! admin
  else if (req.body.select === "admin") {
    res.cookie("role", "admin");

    //* make sure user in database
    await Admin.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);

        //*   user exist then, now create one time link valid for 15min
        const secret = "secret" + user.password;
        const payload = {
          email: user.email,
          id: user.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        //* when user click this link(this link send to the user email), where to go?
        const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
        console.log(link);
        //*   send email now
        sendMail(
          user.email,
          "Reset password",
          `
                <hi>  hi ${user.fullName}.</h1> <br/>
  
          <p>
          Forgot your password?</br>
           No worries. It happens to everyone. We’ve made it easy for you to access project system again.
           </br>
          You can reset your password immediately by <strong><a href="${link}">clicking here .</a></strong>
          </p>
          <p>
          If you run into any other problems, drop us a line at <strong> finalptoject@gmail.com </strong>.
          </br>
          Best regard.
            The project System Team
          </p>
          `
        );
        res.send(
          "Please check your email. Instructions were sent to your email address."
        );
      })
      .catch((err) => {
        console.log("we cant find student with that email");
        console.log(err);
      });
  }
  //! s.commite
  else if (req.body.select === "sCommite") {
    res.cookie("role", "sCommite");

    //* make sure user in database
    await SCommitte.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);

        //*   user exist then, now create one time link valid for 15min
        const secret = "secret" + user.password;
        const payload = {
          email: user.email,
          id: user.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        //* when user click this link(this link send to the user email), where to go?
        const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
        console.log(link);

        //*   send email now
        sendMail(
          user.email,
          "Reset password",
          `
                <hi>  hi ${user.fullName}.</h1> <br/>
  
          <p>
          Forgot your password?</br>
           No worries. It happens to everyone. We’ve made it easy for you to access project system again.
           </br>
          You can reset your password immediately by <strong><a href="${link}">clicking here .</a></strong>
          </p>
          <p>
          If you run into any other problems, drop us a line at <strong> finalptoject@gmail.com </strong>.
          </br>
          Best regard.
            The project System Team
          </p>
          `
        );
        res.send(
          "Please check your email. Instructions were sent to your email address."
        );
      })
      .catch((err) => {
        console.log("we cant find student with that email");
        console.log(err);
      });
  }
  //! lecturer
  else if (req.body.select === "lecturer") {
    res.cookie("role", "lecturer");

    //* make sure user in database
    await Lecturer.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);

        //*   user exist then, now create one time link valid for 15min
        const secret = "secret" + user.password;
        const payload = {
          email: user.email,
          id: user.id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        //* when user click this link(this link send to the user email), where to go?
        const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
        console.log(link);

        //*   send email now
        sendMail(
          user.email,
          "Reset password",
          `
                <hi>  hi ${user.fullName}.</h1> <br/>
  
          <p>
          Forgot your password?</br>
           No worries. It happens to everyone. We’ve made it easy for you to access project system again.
           </br>
          You can reset your password immediately by <strong><a href="${link}">clicking here .</a></strong>
          </p>
          <p>
          If you run into any other problems, drop us a line at <strong> finalptoject@gmail.com </strong>.
          </br>
          Best regard.
            The project System Team
          </p>
          `
        );

        res.send(
          "Please check your email. Instructions were sent to your email address."
        );
      })
      .catch((err) => {
        console.log("we cant find student with that email");
        console.log(err);
      });
  }
  //*   else if something else
  else {
    console.log("your request does not exist");
  }
});

module.exports = router;
