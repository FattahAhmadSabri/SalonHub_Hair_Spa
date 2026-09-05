const express = require("express");

const router = express.Router();

const {
  addReviewController,
  getAllReviewController,
  getReviewBySaloonIdController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
} = require("../controller/reviewController");
const authorizeRoles = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/review", authMiddleware, addReviewController);

router.get("/review", getAllReviewController);

router.get("/review/saloon/:saloonId", getReviewBySaloonIdController);

router.get("/review/:id", getReviewByIdController);

router.put(
  "/review/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  updateReviewController,
);

router.delete(
  "/review/:id",
  authMiddleware,
  authorizeRoles("user", "admin"),
  deleteReviewController,
);

module.exports = router;
