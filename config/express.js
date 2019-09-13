const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('../app/routes');

const app = express();

app.set('port', process.env.PORT || 3333);

app.use(express.json());
app.use(cors());

app.use('/avatars', express.static(path.resolve(__dirname, '..', 'assets', 'avatars')));

router(app);

module.exports = app;
