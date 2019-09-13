const Invitation = require('../models/invitationModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');

module.exports = {
  all: async (req, res) => {
    const invitations = await Invitation.find({});
    res.json(invitations);
  },
  getInvitations: async (req, res) => {
    const { user } = req.headers;
    const invitations = await Invitation.find({
      guest: user, approved: true, accepted: { $exists: false }
    });

    res.json(invitations);
  },
  getTeamInvitations: async (req, res) => {
    const { user: userId } = req.headers;
    const user = await User.findById(userId);
    const invitations = await Invitation.find({ team: user.team, accepted: { $exists: false } });

    res.json(invitations);
  },
  createAloneInvitation: async (req, res) => {
    const { user } = req.headers;
    const { guestId } = req.body;

    const invitation = await Invitation.create({
      guest: guestId,
      votes: [user],
      approved: true
    });
    return res.json(invitation);
  },
  createTeamInvitation: async (req, res) => { // a member of a team creates this..
    const { user } = req.headers;
    if (!user) return res.json({ error: 'didnt pass the user in headers' });
    const { guestId, teamId } = req.body;

    const invitation = await Invitation.create({
      team: teamId,
      guest: guestId,
      votes: [user]
    });
    return res.json(invitation);
  },
  vote: async (req, res) => {
    const { user: userId } = req.headers;
    const { invitationId } = req.body;

    const invitation = await Invitation.findByIdAndUpdate(
      invitationId,
      { $push: { votes: userId } },
      { new: true }
    );
    const user = await User.findById(userId).populate('team');

    if (invitation.votes.length === user.team.members.length) {
      // votes values == members values, so, it's approved
      invitation.approved = true;
      await invitation.save();
    }

    return res.json(invitation);
  },
  removeVote: async (req, res) => {
    const { userId } = req.headers;
    const { invitationId } = req.body;

    const invitation = await Invitation.findByIdAndUpdate(invitationId, {
      $pull: { votes: { $in: userId } }
    });

    return res.json(invitation);
  },
  removeInvitation: async (req, res) => {
    const { id } = req.params; //  invitation's id
    await Invitation.findByIdAndDelete(id);

    res.json({ ok: 'removed' });
  },
  acceptInvitation: async (req, res) => {
    const { user: userId } = req.headers;
    if (!userId) {
      return res.json({ error: 'did not pass the user the header' });
    }
    const { id } = req.params; //  invitation's id

    const invitation = await Invitation.findById(id);

    if (invitation.team) { // invitation with team
      const team = await Team.findById(invitation.team);

      if (team.members.length === 5) {
        return res.json({ error: 'team is already completed' });
      }
      team.members.push(userId);
      await team.save();

      await User.findByIdAndUpdate(userId, { team: team._id });
    } else { // invitation alone, but now, the user might have a team..gotta test...
      const inviter = await User.findById(invitation.votes[0]);

      if (inviter.team) { // the inviter has a team..
        const team = await Team.findById(inviter.team);

        if (team.members.length === 5) {
          return res.json({ error: 'team is already completed' });
        }
        team.members.push(userId);
        await team.save();

        await User.findByIdAndUpdate(userId, { team: team._id });
      } else { // inviter does not have a team.. create one
        const members = [inviter._id, userId];
        const team = await Team.create({ members });

        members.forEach(async (member) => {
          await User.findByIdAndUpdate(member, { team: team._id });
        });
      }
    }

    invitation.accepted = true;
    await invitation.save();

    // decline all other invitations
    await Invitation.updateMany({
      _id: { $ne: invitation._id },
      guest: userId
    }, { accepted: false });

    return res.json({});
  },
  declineInvitation: async (req, res) => {
    // const { userId } = req.headers;
    const { id } = req.params; //  invitation's id

    const invitation = await Invitation.findByIdAndUpdate(id, {
      accepted: false
    });

    res.json(invitation);
  }

};
