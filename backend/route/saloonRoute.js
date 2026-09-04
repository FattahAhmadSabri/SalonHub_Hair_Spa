const express = require("express");
const {
  addSaloonController,
  getSaloonbyCityController,
  getAllSaloonController,
  getSaloonByIdController
} = require("../controller/saloonController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");

router.post(
  "/saloon/add",
  upload.single("image"),
  authMiddleware,
  addSaloonController,
);

router.get("/saloon/get", getSaloonbyCityController);
router.get("/saloon/all", getAllSaloonController);
router.get("/saloon/get/:id", getSaloonByIdController);

module.exports = router;
