const express = require("express");
const mongo = require("./config/connection");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

mongo.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`DevLink API running at http://localhost:${PORT}`);
  });
});

mongo.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

module.exports = app;
