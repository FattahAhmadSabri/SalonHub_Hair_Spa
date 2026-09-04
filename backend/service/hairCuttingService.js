const {SaloonFacility}= require("../model/index")

const addSaloonService = async (
  saloonId,
  name,
  price,
  duration,
  description
) => {
  const saloonService = await SaloonFacility.create({
    saloonId,
    name,
    price,
    duration,
    description,
  });

  return saloonService;
};


const getAllSaloonServices = async () => {
  const saloonServices = await SaloonFacility.findAll();

  return saloonServices;
};

const getSaloonServiceById = async (id) => {
  const saloonService = await SaloonFacility.findByPk(id);

  if (!saloonService) {
    throw new Error("Saloon service not found");
  }

  return saloonService;
};

const updateSaloonService = async (
  id,
  name,
  price,
  duration,
  description
) => {
  const saloonService = await SaloonFacility.findByPk(id);

  if (!saloonService) {
    throw new Error("Saloon service not found");
  }

  await SaloonFacility.update({
    name,
    price,
    duration,
    description,
  });

  return saloonService;
};

const deleteSaloonService = async (id) => {
  const saloonService = await SaloonFacility.findByPk(id);

  if (!saloonService) {
    throw new Error("Saloon service not found");
  }

  await saloonService.destroy();

  return saloonService;
};


module.exports = {
  addSaloonService,
  getAllSaloonServices,
  getSaloonServiceById,
  updateSaloonService,
  deleteSaloonService,
};

