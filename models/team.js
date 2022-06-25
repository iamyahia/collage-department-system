const mongoose = require("mongoose");

//! models
const conStSortedPr = require("../models/conditional-sorting-projects").schema;

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
    },
    teamMembers: [{ type: String }],
    project: {
      type: String,
    },
    conProject: [conStSortedPr],
    totalGrade: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teams", teamSchema);
