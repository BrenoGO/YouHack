const userRoute = require('./user');

module.exports = function(app) {
  userRoute(app);
}