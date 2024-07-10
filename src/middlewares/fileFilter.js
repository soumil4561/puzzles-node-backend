const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const checkFileSize = (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }
  // if multiple files are uploaded
  if (req.files) {
    const sizeLimits = {
      'image/jpeg': 1024 * 1024 * 10, // 2MB
      'image/png': 1024 * 1024 * 10, // 2MB
      'image/jpg': 1024 * 1024 * 10, // 2MB
      'image/webp': 1024 * 1024 * 10, // 2MB
    };
    req.files.forEach((file) => {
      if (sizeLimits[file.mimetype] < file.size) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'File size is too large'));
      }
    });
    return next();
  }
  const { file } = req;
  const sizeLimits = {
    'image/jpeg': 1024 * 1024 * 10, // 2MB
    'image/png': 1024 * 1024 * 10, // 2MB
    'image/jpg': 1024 * 1024 * 10, // 2MB
    'image/webp': 1024 * 1024 * 10, // 2MB
  };

  if (sizeLimits[file.mimetype] < file.size) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'File size is too large'));
  }
  next();
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'));
  }
  cb(null, true);
};

module.exports = {
  checkFileSize,
  fileFilter,
};
