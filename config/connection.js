const mongoose = require("mongoose");

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/devlink";

mongoose.connect(connectionString);

module.exports = mongoose.connection;
