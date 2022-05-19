const mongoose = require("mongoose");

const conditionalProjects = new mongoose.Schema(
  {
    projectAuthor: {
      type: String,
    },
    projectName: {
      type: String,
    },
    projectInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conditional-Projects", conditionalProjects);
