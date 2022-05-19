const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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
    projectTeam: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Projects", projectSchema);
