const Team = require('../models/teamModel');
const User = require('../models/userModel');

module.exports = {
  index: async (req, res) => {
    const teams = await Team.find({});
    return res.json(teams);
  },
  myTeam: async (req, res) => {
    const { user: id } = req.headers;
    const user = await User.findById(id).populate('team');
    res.json(user.team);
  },
  store: async (req, res) => {
    const { members } = req.body;
    if (members.length <= 1) {
      return res.json({ error: 'team have to have at least two members' });
    }
    const team = await Team.create({ members });

    members.forEach(async (member) => {
      await User.findByIdAndUpdate(member, { team: team._id });
    });

    return res.json(team);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);

    team.members.forEach(async (member) => {
      await User.findByIdAndUpdate(member, { $unset: { team: 1 } });
    });

    res.json(team);
  }
};
