const mongoose = require("mongoose");
const projectSchema = require("./project").schema;

const lecturerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    project: [projectSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lecturers", lecturerSchema);
