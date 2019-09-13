const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  description: String,
  frontend: {
    type: Number,
    required: true,
  },
  backend: {
    type: Number,
    required: true,
  },
  business: {
    type: Number,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  team: {
    type: ObjectId,
    ref: 'Team',
  },
},
{
  timestamps: true,
});

module.exports = model('User', schema);
