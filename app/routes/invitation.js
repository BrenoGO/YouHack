const invitationController = require('../controllers/invitationController');

module.exports = function (app) {
  app.get('/invitation/all', invitationController.all);

  app.get('/invitation/team', invitationController.getTeamInvitations);
  app.get('/invitation/accept/:id', invitationController.acceptInvitation);
  app.get('/invitation/decline/:id', invitationController.declineInvitation);
  app.get('/invitation', invitationController.getInvitations);

  app.post('/invitation/team', invitationController.createTeamInvitation);
  app.post('/invitation', invitationController.createAloneInvitation);

  app.put('/invitation/vote', invitationController.vote);
  app.put('/invitation/removevote', invitationController.removeVote);

  app.delete('/invitation/:id', invitationController.removeInvitation);
};
