const httpStatus = require('http-status');
const sharp = require('sharp');
const ApiError = require('./ApiError');

const compressImage = async ({ file }) => {
  try {
    if (file.mimetype.includes('webp')) {
      const { data, info } = await sharp(file.buffer)
        .webp({ lossless: true, quality: 80 }) // quality can be adjusted as per requirement
        .toBuffer({ resolveWithObject: true });
      return { data, info };
    }
    if (file.mimetype.includes('jpeg') || file.mimetype.includes('jpg')) {
      const { data, info } = await sharp(file.buffer)
        .jpeg({ lossless: true, quality: 80 })
        .toFormat('webp')
        .toBuffer({ resolveWithObject: true });
      return { data, info };
    }
    if (file.mimetype.includes('png')) {
      const { data, info } = await sharp(file.buffer)
        .png({ lossless: true, quality: 80 })
        .toFormat('webp')
        .toBuffer({ resolveWithObject: true });
      return { data, info };
    }
  } catch (err) {
    throw new Error(err);
  }
};

const compressMedia = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return next();
    }
    if (req.files) {
      // const compressedFiles = [];
      // req.files.forEach(async (file) => {
      //   // check mimetype
      //   if (!file.mimetype.includes('image')) {
      //     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type');
      //   }
      //   const compressedFile = await compressImage({ file });
      //   compressedFiles.push(compressedFile);
      // });
      // console.log(compressedFiles);
      // req.files = compressedFiles;
      // return next();
      const compressionPromises = req.files.map(async (file) => {
        // check mimetype
        if (!file.mimetype.includes('image')) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type');
        }
        return compressImage({ file });
      });
      // Wait for all promises to resolve
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
