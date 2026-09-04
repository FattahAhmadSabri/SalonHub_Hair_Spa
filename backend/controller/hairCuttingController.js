const {
  addSaloonService,
  getAllSaloonServices,
  getSaloonServiceById,
  updateSaloonService,
  deleteSaloonService,
}  = require("../service/hairCuttingService")

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addSaloonServiceController = async (req, res) => {
  try {
    const {
      saloonId,
      name,
      price,
      duration,
      description,
    } = req.body;

    const response = await addSaloonService(
      saloonId,
      name,
      price,
      duration,
      description
    );

    return successResponse(
      res,
      201,
      "Saloon service added successfully",
      response
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


const getAllSaloonServicesController = async (req, res) => {
  try {
    const response = await getAllSaloonServices();

    return successResponse(
      res,
      200,
      "Saloon services fetched successfully",
      response
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getSaloonServiceByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await getSaloonServiceById(id);

    return successResponse(
      res,
      200,
      "Saloon service fetched successfully",
      response
    );
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

const updateSaloonServiceController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      duration,
      description,
    } = req.body;

    const response = await updateSaloonService(
      id,
      name,
      price,
      duration,
      description
    );

    return successResponse(
      res,
      200,
      "Saloon service updated successfully",
      response
    );
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

const deleteSaloonServiceController = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteSaloonService(id);

    return successResponse(
      res,
      200,
      "Saloon service deleted successfully",
      response
    );
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

module.exports = {
  addSaloonServiceController,
  getAllSaloonServicesController,
  getSaloonServiceByIdController,
  updateSaloonServiceController,
  deleteSaloonServiceController,
};