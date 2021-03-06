const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const faker = require('Faker');

const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Invitation = require('../models/invitationModel');
// const Team = require('../models/teamModel');


const imgSize = [400, 400];

async function downloadAvatar(id) {
  const url = faker.Image.avatar();
  const imgPath = path.resolve(__dirname, '..', '..', 'assets', 'avatars', `${id}.jpg`);

  const response = await axios.get(url, { responseType: 'arraybuffer' });

  await sharp(response.data)
    .resize(...imgSize)
    .jpeg()
    .toFile(imgPath);
}

module.exports = {
  index: async (req, res) => {
    const users = await User.find({});
    return res.json(users);
  },
  findById: async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.json(user);
  },
  store: async (req, res) => {
    const user = await User.create(req.body);

    if (req.file) {
      const fileName = `${user._id}.jpg`;

      await sharp(req.file.path)
        .resize(...imgSize)
        .jpeg()
        .toFile(
          path.resolve(req.file.destination, 'avatars', fileName),
        );
      fs.unlinkSync(req.file.path);
    }
    return res.json(user);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    const imgPath = path.resolve(__dirname, '..', '..', 'assets', 'avatars', `${id}.jpg`);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    return res.json({ ok: 'removed' });
  },
  createFake: async (req, res) => {
    const user = await User.create({
      name: faker.Name.findName(),
      email: faker.Internet.email(),
      description: faker.Lorem.paragraph(),
      frontend: Math.floor(Math.random() * 5),
      backend: Math.floor(Math.random() * 5),
      business: Math.floor(Math.random() * 5),
      mobile: Math.floor(Math.random() * 5),
    });
    downloadAvatar(user._id);

    return res.json(user);
  },
  updateTeam: async (req, res) => {
    const { user: userId } = req.body;
    let { teamId } = req.body;
    if (teamId === 0) {
      teamId = '000000000000000000000000';
    }
    await User.findByIdAndUpdate(userId, { team: teamId });
    return res.json({ ok: 'ok' });
  },
  findTeammate: async (req, res) => {
    // scores are now from 0 to 4.
    const { user: userId } = req.headers;
    const user = await User.findById(userId);

    //  exclude the user himself & doesn't have a team
    const conditions = [{ _id: { $ne: userId } }, { team: { $exists: false } }];

    // set frontend skill rules
    const frontend = {};
    if (user.frontend < 2) {
      frontend.$gte = 2;
      conditions.push({ frontend });
    } else if (user.frontend >= 3) {
      frontend.$lte = 2;
      conditions.push({ frontend });
    }

    // set backend skill rules
    const backend = {};
    if (user.backend < 2) {
      backend.$gte = 2;
      conditions.push({ backend });
    } else if (user.backend >= 3) {
      backend.$lte = 2;
      conditions.push({ backend });
    }

    // set business skill rules
    const business = {};
    if (user.business < 2) {
      business.$gte = 2;
      conditions.push({ business });
    } else if (user.business >= 3) {
      business.$lte = 2;
      conditions.push({ business });
    }

    // set mobile skill rules
    const mobile = {};
    if (user.mobile < 2) {
      mobile.$gte = 2;
      conditions.push({ mobile });
    } else if (user.mobile >= 3) {
      mobile.$lte = 2;
      conditions.push({ mobile });
    }

    let users = await User.find({
      $and: conditions,
    });

    if (users.length === 0) {
      const newConditions = [{ _id: { $ne: userId } }, { team: { $exists: false } }];
      users = await User.find({
        $and: newConditions
      });
    }

    return res.json(users);
  },
  clearAll: async (req, res) => {
    await User.deleteMany({});
    await Team.deleteMany({});
    await Invitation.deleteMany({});
    res.json({ ok: 'all clear' });
  }
};
