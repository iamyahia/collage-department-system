const mongoose = require("mongoose");

//! models

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
    },
    teamMembers: [{ type: String }],
    project: {
      type: String,
    },
    totalGrade: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teams", teamSchema);
