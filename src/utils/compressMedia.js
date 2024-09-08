// const fs = require('fs');
const httpStatus = require('http-status');
const sharp = require('sharp');
const ApiError = require('./ApiError');
const logger = require('../config/logger');

const compressImage = async ({ file }) => {
  try {
    const newFilePath = file.path.replace('.', '-compressed.');
    if (file.mimetype.includes('webp')) {
      logger.info('File is already in webp format');
      const { data, info } = await sharp(file.path)
        .webp({ lossless: true, quality: 80 }) // quality can be adjusted as per requirement
        .toFile(newFilePath, { resolveWithObject: true });
      return { data, info };
    }
    if (file.mimetype.includes('jpeg') || file.mimetype.includes('jpg')) {
      const { data, info } = await sharp(file.path)
        .jpeg({ lossless: true, quality: 80 })
        .toFormat('webp')
        .toFile(newFilePath, { resolveWithObject: true });
      return { data, info };
    }
    if (file.mimetype.includes('png')) {
      const { data, info } = await sharp(file.path)
        .png({ lossless: true, quality: 80 })
        .toFormat('webp')
        .toFile(newFilePath, { resolveWithObject: true });
      return { data, info };
    }
  } catch (err) {
    throw new Error(err);
  }
};

const compressMedia = async (req, res, next) => {
  try {
    logger.info('Compressing media');
    if (!req.file && !req.files) {
      return next();
    }

    if (req.files) {
      const compressionPromises = req.files.map(async (file) => {
        // check mimetype
        if (!file.mimetype.includes('image')) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type');
        }
        return compressImage({ file });
      });
      const compressedFiles = await Promise.all(compressionPromises);
      req.files = compressedFiles;
      return next();
    }
    const { file } = req;
    const compressedFile = await compressImage({ file });
    req.file = compressedFile;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  compressMedia,
};
