const multer = require('multer');

const userController = require('../controllers/userController');
const uploadConfig = require('../../config/upload');

const upload = multer(uploadConfig);

module.exports = function(app) {
  app.get('/user', userController.index);
  app.get('/user/:id', userController.findById);
  app.post('/user', upload.single('avatar'), userController.store);
  app.delete('/user/:id', userController.delete);

  return app;
}