const User = require('../models/userModel');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const faker = require('Faker');
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
  store: async (req,res) => {
    const user = await User.create(req.body);

    if(req.file) {
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
    if(fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
    
    return res.json({ok:'removed'});
  },
  createFake: async (req, res) => {
    
    const user = await User.create({
      name: faker.Name.findName(),
      email: faker.Internet.email(),
      description: faker.Lorem.paragraph(),
      frontend: Math.floor(Math.random()*5),
      backend: Math.floor(Math.random()*5),
      business: Math.floor(Math.random()*5),
      mobile: Math.floor(Math.random()*5)
    })
    downloadAvatar(user._id);

    res.json(user);
  }
}