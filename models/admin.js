const mongoose = require("mongoose");

const Admin = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: { type: String },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", Admin);
