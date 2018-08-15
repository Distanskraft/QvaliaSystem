/* GIT - Save the code to the server
git add .
git commit -am ”Comment of the commit”
git push -u origin master
*/

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
  console.log(req.body);
  client.tasks
    .create({
      workspace: keys.distanskraftSe,
      name: req.body.name,
      projects: req.body.projects,
      assignee: req.body.assignee
    })
    .then(response => {
      console.log(response.id);
      client.tasks
        .addSubtask(response.id, {
          name: req.body.subtaskname
        })
        .then(response => res.json(response));
    })
    .catch(error => res.json(error));
});

// @route   POST /api/qvalia/test
// @desc    Route test function
// @access  Public
router.post('/test2', (req, res) => {
  console.log(req.body);
  client.tasks
    .create({
      workspace: keys.distanskraftSe,
      name: req.body.name,
      projects: req.body.projects,
      assignee: req.body.assignee
    })
    .then(response => {
      console.log(response.id);
      client.tasks
        .addSubtask(response.id, {
          name: req.body.subtaskname
        })
        .then(response => res.json(response));
    })
    .catch(error => res.json(error));
});

module.exports = router;
