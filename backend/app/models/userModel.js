const {Schema, model} = require('mongoose');

const schema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  description: String,
  frontend: {
    type: Number,
    required: true
  },
  backend: {
    type: Number,
    required: true
  },
  business: {
    type: Number,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  }
},
{
  timestamps: true
});

module.exports = model('User', schema);