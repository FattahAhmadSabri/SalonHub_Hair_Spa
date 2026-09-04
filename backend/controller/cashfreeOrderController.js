const {
  createOrder,
  getOrderStatus,
} = require("../service/cashfreepaymentsService");

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const { randomUUID } = require("crypto");

const cashfreeOrderController = async (req, res) => {
  try {
    const customerId = req.user.id;

    const { customerPhone, appointmentId } = req.body;

    const orderId = randomUUID();

    const order = await createOrder(
      orderId,
      customerId,
      customerPhone,
      appointmentId
    );

    return successResponse(
      res,
      201,
      "Payment generated",
      order
    );
  } catch (error) {
    console.log(error);

    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

const getOrderStatusCashfreeController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await getOrderStatus(orderId);

    return successResponse(
      res,
      200,
      "Payment status fetched successfully",
      response
    );
  } catch (error) {
    console.log(error);

    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

module.exports = {
  cashfreeOrderController,
  getOrderStatusCashfreeController,
};