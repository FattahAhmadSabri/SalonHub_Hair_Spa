const {
  addAppointmentService,
  getAllAppointmentService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getAppointmentByUserIdService
} = require("../service/appointmentService");

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addAppointmentController = async (req, res) => {
  try {
    const {
      saloonId,
      serviceId,
      date,
      startTime,
    } = req.body;

    const userId = req.user.id;

    const appointment = await addAppointmentService(
      userId,
      saloonId,
      serviceId,
      date,
      startTime
    );

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAppointmentByUserIdController =async(req,res)=>{
  try {
       const userId =req.user.id 
       const response = await getAppointmentByUserIdService(userId)
       return successResponse(res, 200, "User appointment successfully", response);
    
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}


const getAllAppointmentController = async (req, res) => {
  try {
    const appointments = await getAllAppointmentService();

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAppointmentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await getAppointmentByIdService(id);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      date,
      startTime,
      status,
    } = req.body;

    const appointment = await updateAppointmentService(
      id,
      date,
      startTime,
      status
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteAppointmentController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAppointmentService(id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addAppointmentController,
  getAllAppointmentController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  getAppointmentByUserIdController
};