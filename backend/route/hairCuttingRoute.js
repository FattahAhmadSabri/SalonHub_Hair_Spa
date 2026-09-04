const express = require("express");

const router = express.Router();

const {
  addSaloonServiceController,
  getAllSaloonServicesController,
  getSaloonServiceByIdController,
  updateSaloonServiceController,
  deleteSaloonServiceController,
} = require("../controller/hairCuttingController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/saloon-service/add",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  addSaloonServiceController,
);

router.get("/saloon-service/all", getAllSaloonServicesController);

router.get("/saloon-service/:id", getSaloonServiceByIdController);

router.put(
  "/saloon-service/:id",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  updateSaloonServiceController,
);

router.delete(
  "/saloon-service/:id",
  authMiddleware,
  authorizeRoles("admin", "staff"),
  deleteSaloonServiceController,
);

module.exports = router;
