const router = require("express").Router();
const {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  addConnection,
  removeConnection,
} = require("../../controllers/developerController");

router.route("/").get(getDevelopers).post(createDeveloper);
router
  .route("/:developerId")
  .get(getDeveloperById)
  .put(updateDeveloper)
  .delete(deleteDeveloper);
router
  .route("/:developerId/connections/:connectionId")
  .post(addConnection)
  .delete(removeConnection);

module.exports = router;
