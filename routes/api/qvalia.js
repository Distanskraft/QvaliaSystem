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

// @route   POST /api/qvalia/update/task
// @desc    Update custom fields of tasks
// @access  Public
router.post('/update/task', (req, res) => {
  const taskId = req.body.taskId; // send taskId @params
  const customFields = req.body.customFields; // Send customFields[@fieldId] @value
  // Log field Value
  console.log(customFields);

  // Update asana task with custom field.
  client.tasks
    .update(taskId, {
      custom_fields: customFields
    })

    // Define Response in function.. This is a promise returned from Asana API
    .then(response => {
      //Send the response back in a json. This is already in json format from the asana api
      res.json(response);
    })
    .catch(err => {
      //IF Error, catch the error and log to console.
      console.log(err);

      //Return also the error back to the sender.
      res.json(err);
    });
});

module.exports = router;
