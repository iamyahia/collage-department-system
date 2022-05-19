const mongoose = require("mongoose");

const conditionalSortingProjects = new mongoose.Schema(
  {
    projectAuthors: [
      {
        type: String,
      },
    ],
    projectMembers: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "conditionalSortingProjects",
  conditionalSortingProjects
);
