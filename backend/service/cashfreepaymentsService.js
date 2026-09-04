const { Cashfree, CFEnvironment } = require("cashfree-pg");

const { User, Payment, Appointment, SaloonFacility} = require("../model/index");

const sequelize = require("../utils/dbConfig");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET,
);

const createOrder = async (
  orderId,
  customerId,
  customerPhone,
  appointmentId,
  orderCurrency = "INR",
) => {
  try {
    // Find appointment belonging to logged-in customer
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        userId: customerId,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    
    const service = await SaloonFacility.findByPk(appointment.serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    
    const amount = Number(service.price);

    if (!amount || amount <= 0) {
      throw new Error("Invalid service price");
    }

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: orderCurrency,

      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },

      order_meta: {
        return_url:
          "http://127.0.0.1:5500/frontend/payments/payment-sucess.html?order_id={order_id}",

        notify_url: "http://localhost:4500/api/payment/webhook",

        payment_methods: "cc,dc,upi",
      },

      order_expiry_time: expiryDate.toISOString(),
    };

    console.log(request);

    const response = await cashfree.PGCreateOrder(request);

    // Store payment information
    await Payment.create({
      orderId,
      userId: customerId,
      appointmentId: appointment.id,
      amount,
      status: "pending",
    });

    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create Cashfree order.",
    );
  }
};

const getOrderStatus = async (orderId) => {
  const transaction = await sequelize.transaction();

  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);

    const payments = response.data;

    let orderStatus;

    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    if (successfulPayment) {
      orderStatus = "success";

      const paymentRecord = await Payment.findOne({
        where: {
          orderId,
        },
        transaction,
      });

      if (paymentRecord) {
        // Update payment
        await Payment.update(
          {
            status: "success",
            paymentId: successfulPayment.cf_payment_id,
          },
          {
            where: {
              orderId,
            },
            transaction,
          },
        );

        // Confirm appointment
        await Appointment.update(
          {
            status: "confirmed",
          },
          {
            where: {
              id: paymentRecord.appointmentId,
            },
            transaction,
          },
        );
      }
    } else if (
      payments.some((payment) => payment.payment_status === "PENDING")
    ) {
      orderStatus = "pending";
    } else {
      orderStatus = "failure";
    }

    await transaction.commit();

    return {
      orderStatus,
      payments,
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

module.exports = {
  createOrder,
  getOrderStatus,
};
