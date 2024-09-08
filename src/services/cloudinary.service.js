const httpStatus = require('http-status');
const fs = require('fs').promises;
const ApiError = require('../utils/ApiError');
const cloudinary = require('../config/cloudinary');
const logger = require('../config/logger');

const uploadImage = async (fileName, file) => {
  const options = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
    folder: 'puzzles',
    public_id: fileName,
  };

  try {
    const result = await cloudinary.uploader.upload(file.path, options);
    await fs.rm(file.path); 
    return result;
  } catch (error) {
    await fs.rm(file.path); 
    logger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error uploading image');
  }
};

module.exports = {
  uploadImage,
};
