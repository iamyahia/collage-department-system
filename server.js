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

//  automation

//

app.listen(5000, console.log("Server Start on port: 5000"));
