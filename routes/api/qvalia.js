/* #region INIT */
const express = require('express');
const router = express.Router();
const asana = require('asana');

// Server URL:  https://qvaliasystem.herokuapp.com/api/qvalia/webhooks/COMMAND_783353782030230 */

// This imports the myFunctions libary modules, renames asanaTaskFunction to simply "a" for easier use.
const { asanaTaskFunction: a, myOtherObjct } = require('./myFunctions');

// Import keys
const keys = require('../../config/keys');
// Create Asana Client
client = asana.Client.create().useAccessToken(keys.distanskraftToken);
client.users.me().then(me => {
  console.log(me);
});

/* #endregion INIT */
/* #region POST_UPDATE_TASK - UPDATE TASK */
/*  TASK/UPDATE
  ____   ___  ____ _____ 
 |  _ \ / _ \/ ___|_   _|
 | |_) | | | \___ \ | |  
 |  __/| |_| |___) || |  
 |_|    \___/|____/ |_|  
                       
*/
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

/* #endregion POST_UPDATE_TASK */

/* #region POST_WEBHOOK_TEST1 - WEBHOOK/TEST1 */
/*  WEBHOOK/TEST1
  ____   ___  ____ _____ 
 |  _ \ / _ \/ ___|_   _|
 | |_) | | | \___ \ | |  
 |  __/| |_| |___) || |  
 |_|    \___/|____/ |_|  
                       
*/
// @route   POST /api/qvalia/webhook/test1
// @desc    Update custom fields of tasks
// @access  Public
router.post('/Webhooks/UpdateAccountName', (req, res) => {
  const taskId = req.body.taskId; // send taskId @params

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello! Im going fo fix task: ' + taskId + '!\n');
});

/* #endregion POST_WEBHOOK_TEST1 */

/* #region POST_TEST_TEST1 POST TEST1*/

/*  TEST/TEST1
  ____   ___  ____ _____ 
 |  _ \ / _ \/ ___|_   _|
 | |_) | | | \___ \ | |  
 |  __/| |_| |___) || |  
 |_|    \___/|____/ |_|  
                       
*/
// @route   POST /api/qvalia/test/test1
// @desc    Used for basic testing
// @access  Public
router.post('/test/test1', (req, res) => {
  const taskId = req.body.taskId;

  console.log('Initiating function call for AsanaTaskFunction.getTaskById.');
  console.log('Requested Task ID:  ', taskId);
  var task = a.getTaskById(taskId);

  res.json('Hej! Ville du veta nått om task: ' + taskId + '?');
});

/* #endregion POST_TEST_TEST1 POST TEST1*/

/* #region POST_LOL POST LOL */
/*  LOL
  ____   ___  ____ _____ 
 |  _ \ / _ \/ ___|_   _|
 | |_) | | | \___ \ | |  
 |  __/| |_| |___) || |  
 |_|    \___/|____/ |_|  
                         

*/
router.post('/lol', (req, res) => {
  client.tasks.subtasks(req.body.taskId).then(response => {
    console.log(response);

    // For every subtask in the main task
    let arrSubTaskIds = [];
    let arrSubTasks = [];

    // For all subtasks push the task ID into the array arrSubTasks created above.
    for (let i = 0; i < response.data.length; i++) {
      client.tasks
        .update(response.data[i].id)
        .then(response => arrSubTasks.push(response));
      console.log(response);

      arrSubTaskIds[i] = response.data[i].id;
    }

    // For all subtask id's, extract the value from the selected custom field.
    for (let i = 0; i < response.data.length; i++) {
      console.log('Running the subtask loop, i = ' + i);
      client.tasks.update(arrSubTaskIds[i]).then(subTaskResponse => {
        console.log(subTaskResponse);

        /* The "asanaTaskFunction" is built below, custom made functions used in order
           to not have to repeat the code up here, and to make the code more redable. 
           The function "getCustomFieldsIdByName" requires a task object (response) 
           and a string to search the custom fields for. 
           When a match is found the custom_field id is returned to the code. 
        console.log(
          'Initiating function call to "asanaTaskFunction.getCustomFieldIdByName()".'
        );

        console.log(
          'The subtasks custom field id equals: ' +
            a.getCustomFieldIdByName(
              subTaskResponse,
              'Total Agreed Amount' //TODO: This should be changed into an incomming KEY instead.
            )
        );

        let customFieldId = '';

        customFieldId = a.getCustomFieldIdByName(
          subTaskResponse,
          'Total Agreed Amount'
        );

        let customFieldvalue = '';
        console.log(
          'The subtasks custom field value is: ' +
            a.getCustomFieldValueById(
              subTaskResponse,
              a.getCustomFieldIdByName(subTaskResponse, 'Total Agreed Amount')
            )
        );
        */

        /* Below, the two functions are used combined, the first getting the id of the custom_field
           and the second retrieving the value from the custom field with that custom_field id.*/
        customFieldvalue = a.getCustomFieldValueById(
          subTaskResponse,
          a.getCustomFieldIdByName(subTaskResponse, 'Total Agreed Amount')
        );

        console.log('CustomFieldValue = ' + customFieldvalue);
      });
    }

    if (arrSubTaskIds.length === response.data.length) {
      res.json(arrSubTaskIds);
    }
  });
});

/* #endregion POST_LOL POST LOL */

module.exports = router;
