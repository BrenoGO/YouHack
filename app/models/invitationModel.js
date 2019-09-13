const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const invitationSchema = Schema({
  guest: {
    type: ObjectId,
    required: true,
    ref: 'User'
  },
  team: { type: ObjectId, ref: 'Team' },
  votes: [{ type: ObjectId, ref: 'User' }],
  approved: {
    type: Boolean,
    default: false
  },
  accepted: Boolean
},
{ timestamps: true });

module.exports = model('Invitation', invitationSchema);
