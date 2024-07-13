const multer = require('multer');
const fileFilter = require('./fileFilter');

const upload = multer({
  fileFilter,
  storage: multer.memoryStorage(),
});

module.exports = upload;
