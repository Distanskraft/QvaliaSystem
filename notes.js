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

async function updateCustomFieldByNameOLD(taskId, cfName, cfValue) {
  /* PUT THIS IN THE POST/REQUEST SECTION (ROUTER.POST)
  const resp = await updateCustomFieldByName(
    req.body.taskId,
    req.body.cfName,
    req.body.cfValue
  );
  //console.log('response', resp);
  res.json(resp);
  */

  // Pull the that that should be updated from Asana.
  let task = await a.getTaskById(taskId);
  // TODO: Error handling in case no task if found!

  // Storage for Custom Field Id.
  let cfId = '';

  // Object used to send the custom fields to Asana
  let myCustom_field = {};

  // The cfId string will be populated by the loop below.
  // Loop though all the custom_fields texts and compare
  // them with the requests target custom_field name.
  // If a match if found, set the value cfId.
  for (let i = 0; i < task.custom_fields.length; i++) {
    // If the requested custom field matches the active one
    if (cfName === task.custom_fields[i].name) {
      // Set the cfId value
      cfId = task.custom_fields[i].id.toString();
    }
  }

  // Create an object that can go into the Asana API.
  myCustom_field[cfId] = cfValue;
  //console.log('cfId: ', cfId);

  // If no value is found, return error and
  return client.tasks
    .update(task.id, {
      name: task.name,
      custom_fields: myCustom_field
    })
    .then(response => {
      return response;
    })
    .catch(err => console.log(err.value.errors));
}
