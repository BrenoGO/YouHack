const multer = require('multer');

const userController = require('../controllers/userController');
const uploadConfig = require('../../config/upload');

const upload = multer(uploadConfig);

module.exports = function (app) {
  app.get('/user/faker', userController.createFake);
  app.get('/user/teammate', userController.findTeammate);

  app.get('/user', userController.index);
  app.get('/user/:id', userController.findById);

  app.put('/user/:id', userController.updateTeam);

  app.post('/user', upload.single('avatar'), userController.store);
  app.delete('/user/:id', userController.delete);
};
