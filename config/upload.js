const multer = require('multer');
const path = require('path');

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'assets'),
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
};
