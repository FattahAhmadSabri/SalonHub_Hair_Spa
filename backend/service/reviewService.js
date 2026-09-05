const { Review, User, Saloon } = require("../model/index");

// CREATE REVIEW
const addReviewService = async (userId, saloonId, review, ratings) => {
  const salon = await Saloon.findByPk(saloonId);

  if (!salon) {
    throw new Error("Salon not found");
  }

  const existingReview = await Review.findOne({
    where: {
      userId,
      saloonId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this salon");
  }

  const newReview = await Review.create({
    userId,
    saloonId,
    review,
    ratings,
  });

  return newReview;
};

// GET ALL REVIEWS
const getAllReviewService = async () => {
  return await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
      {
        model: Saloon,
        attributes: ["id", "name", "city"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

// GET REVIEWS BY SALON
const getReviewBySaloonIdService = async (saloonId) => {
  const salon = await Saloon.findByPk(saloonId);

  if (!salon) {
    throw new Error("Salon not found");
  }

  return await Review.findAll({
    where: {
      saloonId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
      {
        model: Saloon,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

// GET REVIEW BY ID
const getReviewByIdService = async (id) => {
  const review = await Review.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
      {
        model: Saloon,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

// UPDATE REVIEW
const updateReviewService = async (id, userId, review, ratings) => {
  const existingReview = await Review.findByPk(id);

  if (!existingReview) {
    throw new Error("Review not found");
  }

  // Only the owner can update the review
  if (existingReview.userId !== userId) {
    throw new Error("You can only update your own review");
  }

  await existingReview.update({
    review,
    ratings,
  });

  return existingReview;
};

// DELETE REVIEW
const deleteReviewService = async (id, userId, role) => {
  const existingReview = await Review.findByPk(id);

  if (!existingReview) {
    throw new Error("Review not found");
  }

  // Admin can delete any review
  // User can delete only their own review
  if (role !== "admin" && existingReview.userId !== userId) {
    throw new Error("You can only delete your own review");
  }

  await existingReview.destroy();

  return true;
};

module.exports = {
  addReviewService,
  getAllReviewService,
  getReviewBySaloonIdService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
};
