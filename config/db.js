const mongoose = require("mongoose");

//  for creating database and name it.

mongoose.connect("mongodb://127.0.0.1/final_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("database connected"))
  .on("error", (err) => {
    console.log(`db has error: ${err}`);
  });
