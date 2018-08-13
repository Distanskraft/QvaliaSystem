const express = require('express');
const router = express.Router();
const asana = require('asana');

// Import keys
const keys = require('../../config/keys');

// Create Asana Client
client = asana.Client.create().useAccessToken(keys.distanskraftToken);
client.users.me().then(me => {
  console.log(me);
});

// @route   POST /api/qvalia/test
// @desc    Route test function
// @access  Public
router.post('/test', (req, res) => {
  let a = req.body.a;
  let b = req.body.b;
  let response = a * b;
  res.json({ hej: response });
});

module.exports = router;
