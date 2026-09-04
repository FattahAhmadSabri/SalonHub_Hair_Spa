const express = require("express");

const router = express.Router();

const {
  addAppointmentController,
  getAllAppointmentController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  getAppointmentByUserIdController
} = require("../controller/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/appointment/add", authMiddleware, addAppointmentController);

router.get("/appointment", authMiddleware, getAllAppointmentController);

router.get("/appointment/user", authMiddleware,getAppointmentByUserIdController)

router.get(
  "/appointment/:id",
  authMiddleware,
  authorizeRoles("user", "staff"),
  getAppointmentByIdController,
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("staff", "user"),
  updateAppointmentController,
);

router.delete(
  "/appointment/:id",
  authMiddleware,
  authorizeRoles("user", "staff", "admin"),
  deleteAppointmentController,
);

module.exports = router;
