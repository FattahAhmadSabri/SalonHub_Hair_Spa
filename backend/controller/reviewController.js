const {
  addReviewService,
  getAllReviewService,
  getReviewBySaloonIdService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
} = require("../service/reviewService");

const addReviewController = async (req, res) => {
  try {
    const { saloonId, review, ratings } = req.body;

    const userId = req.user.id;

    if (!saloonId || !review || ratings === undefined) {
      return res.status(400).json({
        success: false,
        message: "saloonId, review and ratings are required",
      });
    }

    const response = await addReviewService(userId, saloonId, review, ratings);

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReviewController = async (req, res) => {
  try {
    const response = await getAllReviewService();

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReviewBySaloonIdController = async (req, res) => {
  try {
    const { saloonId } = req.params;

    const response = await getReviewBySaloonIdService(saloonId);

    return res.status(200).json({
      success: true,
      message: "Salon reviews fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getReviewByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await getReviewByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, ratings } = req.body;

    const userId = req.user.id;

    if (!review || ratings === undefined) {
      return res.status(400).json({
        success: false,
        message: "review and ratings are required",
      });
    }

    const response = await updateReviewService(id, userId, review, ratings);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;
    const role = req.user.role;

    await deleteReviewService(id, userId, role);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReviewController,
  getAllReviewController,
  getReviewBySaloonIdController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
};
