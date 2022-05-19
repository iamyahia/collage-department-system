const mongoose = require("mongoose");
const teamSchema = require("./team").schema;

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    grade: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    teamMembers: [teamSchema], //! change name of teamMembers to team
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Students", studentSchema);
