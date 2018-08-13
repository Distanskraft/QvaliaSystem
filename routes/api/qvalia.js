const express = require('express');
const router = express.Router();

// @route   POST /api/qvalia/test
// @desc    Route test function
// @access  Public

router.post('/test', (req, res) => {
  let a = req.body.a;
  let b = req.body.b;
  let response = a + b;
  res.json({ hej: response });
});

module.exports = router;
