const teamController = require('../controllers/teamController');


module.exports = function (app) {
  app.get('/team/m', teamController.myTeam);
  app.get('/team', teamController.index);

  app.post('/team', teamController.store);

  app.delete('/team/:id', teamController.delete);
};
