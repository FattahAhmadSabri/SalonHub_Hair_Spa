const { Saloon } = require("../model/index");
const s3 = require("../utils/s3Config")

const { PutObjectCommand } = require("@aws-sdk/client-s3");



const addSaloonService = async (
  name,
  description,
  latitude,
  longitude,
  address,
  city,
  duration,
  image,
) => {
  let imageUrl = null;

  
  if (image) {
    const fileKey = `saloons/${Date.now()}-${image.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    await s3  .send(new PutObjectCommand(uploadParams));

    imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  const saloon = await Saloon.create({
    name,
    description,
    latitude,
    longitude,
    address,
    city,
    duration,
    image: imageUrl,
    
  });

  return saloon;
};



const getSaloonByCity = (city) => {
  const response = Saloon.findAll({
    where: {
      city: city,
    },
  });
  return response;
};



const getAllSaloon = ()=>{
  const response =Saloon.findAll()
  return response
}

const getSaloonById = (id)=>{
  const response =Saloon.findByPk(id)
  return response
}
module.exports = {
  addSaloonService,
  getSaloonByCity,
  getAllSaloon,
  getSaloonById
};
