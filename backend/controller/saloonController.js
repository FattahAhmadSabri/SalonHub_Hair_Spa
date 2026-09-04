const {
  addSaloonService,
  getSaloonByCity,
  getAllSaloon,
  getSaloonById
} = require("../service/saloonService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addSaloonController = async (req, res) => {
  try {
    const { name, description, latitude, longitude, address, city, duration } =
      req.body;

    const response = await addSaloonService(
      name,
      description,
      latitude,
      longitude,
      address,
      city,
      duration,
      req.file,
    );

    return successResponse(res, 201, "Saloon added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
const getSaloonbyCityController = async (req, res) => {
  try {
    const { city } = req.params;
    const response = await getSaloonByCity(city);
    return successResponse(res, 200, `Saloon in ${response.city} fetched successfully`, response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllSaloonController = async(req,res)=>{
  try {
      const response = await getAllSaloon()
      return successResponse(res, 200, "Saloon fetched successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

const getSaloonByIdController = async(req,res)=>{
  try {
    const id = req.params.id
      const response = await getSaloonById(id)
      return successResponse(res, 200, "Saloon fetched successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

module.exports = { addSaloonController,getAllSaloonController, getSaloonbyCityController, getSaloonByIdController };
