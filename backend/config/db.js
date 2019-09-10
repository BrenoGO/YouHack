var mongoose = require('mongoose');

module.exports = function (url) {
  mongoose.connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
   });
  mongoose.connection.on('connected', () => {console.log('Mongoose connected');});
  mongoose.connection.on('disconnected', () => {console.log('Mongoose dropped connection');});
  mongoose.connection.on('error   ', err => {console.log('Mongoose error:'+err);});
  process.on('SIGINT', () => {
      mongoose.connection.close(() => {
          console.log('Mongoose was closed');
          process.exit(0);
      });
  });
};