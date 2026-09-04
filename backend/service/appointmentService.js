const { User, Appointment, Saloon, SaloonFacility } = require("../model/index");

const addAppointmentService = async (
  userId,
  saloonId,
  serviceId,
  date,
  startTime,
) => {
  const saloon = await Saloon.findByPk(saloonId);

  if (!saloon) {
    throw new Error("Saloon not found");
  }

  const service = await SaloonFacility.findOne({
    where: {
      id: serviceId,
      saloonId: saloonId,
    },
  });

  if (!service) {
    throw new Error("Service does not belong to this saloon");
  }

  const appointment = await Appointment.create({
    userId,
    saloonId,
    serviceId,
    date,
    startTime,
  });

  return appointment;
};

const getAllAppointmentService = async () => {
  return await Appointment.findAll({
    include: [
      {
        model: User,
      },
      {
        model: Saloon,
      },
      {
        model: SaloonFacility,
      },
    ],
  });
};

const getAppointmentByIdService = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      {
        model: User,
      },
      {
        model: Saloon,
      },
      {
        model: SaloonFacility,
      },
    ],
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};

const getAppointmentByUserIdService = async (userId) => {
  const appointments = await Appointment.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: Saloon,
        attributes: ["id", "name", "city", "address"],
      },
      {
        model: SaloonFacility,
        attributes: ["id", "name", "price", "duration"],
      },
    ],
    order: [
      ["date", "ASC"],
      ["startTime", "ASC"],
    ],
  });

  return appointments;
};

const updateAppointmentService = async (id, date, startTime, status) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  await appointment.update({
    date,
    startTime,
    status,
  });

  return appointment;
};

const deleteAppointmentService = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  await appointment.destroy();

  return appointment;
};

module.exports = {
  addAppointmentService,
  getAllAppointmentService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getAppointmentByUserIdService,
};
