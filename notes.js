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
/* #region POST_WEBHOOK_UPDATE_ACCOUNT_NAME - WEBHOOK/UpdateAccountName */
/*  WEBHOOK/TEST1
  ____   ___  ____ _____ 
 |  _ \ / _ \/ ___|_   _|
 | |_) | | | \___ \ | |  
 |  __/| |_| |___) || |  
 |_|    \___/|____/ |_|  
                       
*/
// @route   POST /api/qvalia/webhook/UpdateAccountName
// @desc    Update custom fields of tasks
// @access  Public
router.post('/Webhooks/UpdateAccountName', (req, res) => {
  const taskId = req.body.taskId; // send taskId @params

  let arrTempTaskHolder = [];
  let arrTempCustomFieldsHolder = [];
  myTempReply = [];

  // Get the Mother task
  client.tasks
    .update(taskId, {})
    .then(AsanaResponse => {
      arrTempTaskHolder.push(AsanaResponse);
      arrTempCustomFieldsHolder.push(arrTempTaskHolder[0].custom_fields);

      // 1. Find the field that should be updated from it's text.
      // 2. Update the field value in the main task.
      // 3. Search the main task for subtasks (multi level loop)
      // 4. Update the subtasks custom_fields value.
      // 5. Search the subtasks for lower level subtasks (loop)
      // 6. Update the sublevel subtasks fields.
      myTempReply = myTempReply + 'REPLY FROM QVALIA API: \n';

      myTempReply =
        myTempReply + 'New Account Name: "' + arrTempTaskHolder[0].name + '"\n';

      myTempReply =
        myTempReply +
        'custom_fields[0].Id:  "' +
        arrTempTaskHolder[0].custom_fields[0].id +
        '"\n';

      myTempReply =
        myTempReply +
        'CUSTOM FIELD "ACCOUNT NAME CUSTOM FIELD VALUE: ": ' +
        a.getCustomFieldValueById(
          AsanaResponse,
          a.getCustomFieldIdByName(AsanaResponse, 'Account Name')
        );

      // SEND THE REPLY TO POSTMAN! WORKS!
      res.end(myTempReply);

      //a.getCustomFieldIdByName('Account Name')

      //res.json(AsanaResponse);
    })
    .catch(err => {
      //IF Error, catch the error and log to console.
      console.log(err);

      //Return also the error back to the sender.
      res.json(err);
    });

  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // res.end('Hello! Im going fo fix task: ' + taskId + '!\n');
});

/* #endregion POST_WEBHOOK_UPDATE_ACCOUNT_NAME */

router.post('/email/verifyemaillog', (req, res) => {
  var fs = require('fs');
  var emailTextFile = fs.readFileSync('emails.txt', 'utf8');
  var emails = emailTextFile.split(';');

  if (fs.existsSync('result.txt')) {
    fs.unlink('result.txt', err => {
      if (err) throw err;
    });
  }

  let verifier = new Verifier('at_xS9OG0sYnp4ZQ6VloRDXq7Gn2XMDF');

  emails.forEach(email => {
    verifier.verify(email, (err, data) => {
      if (err) throw err;
      //console.log('CHECKING EMAIL ADDRESS: ', email);
      //console.log(data);
      //console.log(data.smtpCheck);
      fs.appendFileSync(
        'result.txt',
        email + '; ' + data.smtpCheck + '; \n' + JSON.stringify(data)
      );
    });
  });

  res.end('Emails where checked and result put in the log.');
});
