const User = require('../models/userModel');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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
  store: async (req,res) => {
    console.log('body',req.body);
    console.log('file',req.file);

    const user = await User.create(req.body);
    console.log('user',user);

    if(req.file) {
      const fileName = `${user._id}.jpg`;
  
      await sharp(req.file.path)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(
          path.resolve(req.file.destination, 'avatars', fileName),
        );
      fs.unlinkSync(req.file.path);
    }
    return res.json(user);

  },
  delete: (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id);
    return res.json({ok:'removed'});
  }
}