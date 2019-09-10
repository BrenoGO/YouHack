const express = require('express');
const cors = require('cors');
const router = require('../app/routes');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3333);

app.use(cors());
app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, 'assets', 'resized')));

router(app);

module.exports = app;
