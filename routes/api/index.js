const router = require("express").Router();
const developerRoutes = require("./developerRoutes");
const postRoutes = require("./postRoutes");

router.use("/developers", developerRoutes);
router.use("/posts", postRoutes);

module.exports = router;
