const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const registerSchema = Schema({
  confirmedBy: {
    type: ObjectId,
    ref: 'User'
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

const teamSchema = Schema({
  teamName: String,
  members: {
    type: [{ type: ObjectId, ref: 'User' }],
    validate: {
      validator: (arr) => arr.length <= 5,
      message: 'Team exceeded the limit of 5'
    }
  },
  register: registerSchema
}, {
  timestamps: true
});

module.exports = model('Team', teamSchema);
