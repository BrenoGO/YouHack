const userRoute = require('./user');
const teamRoute = require('./team');
const invitationRoute = require('./invitation');

module.exports = function (app) {
  userRoute(app);
  teamRoute(app);
  invitationRoute(app);
};
