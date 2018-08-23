/* #region INIT */
const express = require('express');
const router = express.Router();
const asana = require('asana');

// Bring in asana helper
const helper = require('../../helpers/asana');

//Load webhook model
const Webhook = require('../models/Webhook');

let myTempReply = '';
// Server URL:  https://qvaliasystem.herokuapp.com/api/qvalia/webhooks/COMMAND_783353782030230 */

// This imports the myFunctions libary modules, renames asanaTaskFunction to simply "a" for easier use.
const { asanaTaskFunction: a, myOtherObjct } = require('./myFunctions');

// Import keys
const keys = require('../../config/keys');
// Create Asana Client
client = asana.Client.create().useAccessToken(keys.distanskraftToken);
client.users.me().then(me => {
  //console.log(me);
});

/* COMMENTS OF CODE, SNIPPETS AND STUFF BELOW */
/* DELAY FUNCTION CALL WITH MS
  let husse = task.then(responses => {
    console.log('TASK FFS: ', responses.name);
    setTimeout(function() {
      return responses;
    }, 2000);
  });
*/

/* #endregion INIT */

/* WEBHOOKS START: */

//@ route  POST api/ecokraft/subscribe/event
//@ desc   Route that starts to subscribe on events in an asana project
//@ desc   keys: asanaProjectId, workspaceId, projectType
//@ access Public
router.post('/subscribe/event', (req, res) => {
  //Check in db if hook already exists
  let errors = {};
  Webhook.findOne({ asanaProjectId: req.body.asanaProjectId })
    .then(asanaProjectId => {
      if (asanaProjectId) {
        //Function to check if the subscription exists at asana
        helper.checkAsanaForWebhook(
          asanaProjectId.workspaceId,
          asanaProjectId.asanaProjectId
        );
        //errors.asanaProjectId = 'asanaProjectId already exists';
        //return res.status(400).json(errors);
      } else {
        const newWebhook = new Webhook({
          asanaProjectId: req.body.asanaProjectId,
          workspaceId: req.body.workspaceId,
          projectType: req.body.projectType
        });

        newWebhook
          .save()
          .then(webhook => {
            checkAsanaForWebhook(webhook.workspaceId, webhook.asanaProjectId);
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

//@ route  POST api/ecokraft/event/webhook/:resourceId
//@ desc   Route that recieves calls from asana
//@ desc   keys: req.body & req.params
//@ access Public
router.post('/event/webhook/:resourceId', (req, res) => {
  //console.log(req.body);
  const resourceId = req.params.resourceId;
  var events = req.body.events;

  helper.subscribeToAsanaWebhooks(events || [], resourceId).then(respList => {
    console.log('Asana Webhook Subscribe: ', respList);
    console.log('Got the promise back');
  });
  // sets and responds to the X-Hook-Secret
  res.set('X-Hook-Secret', req.headers['x-hook-secret']);
  res.status(200).json({});
});

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
  // Not required right now, but will give access to the top level task for later use.

  // Setting the variables that are required here.
  let Account, AccountSubTasks;

  //console.log('#1');
  a.getTaskById(req.body.taskId)
    .then(result => {
      //console.log('#2');
      Account = result;
      return a.getSubTasks(Account.id);
    })
    .then(result => {
      AccountSubTasks = result;
      console.log('AccountSubTasks', result);
      return Promise.resolve();
    })
    .then(result => {
      console.log('Account', Account);
      console.log('AccountSubTasks', AccountSubTasks);
      return Promise.resolve();
    })
    .then(result => {
      // MAIN CODE STARTS HERE!

      // a.getCustomFieldIdByName(Account, 'Account Name');
      let customFields =
        'customFields[' +
        a.getCustomFieldIdByName(Account, 'Account Name') +
        ']: NEW_NAME!';

      res.json(a.updateTaskCustomFields(Account, customFields));

      /*
    "custom_fields": [ {"id":783353782030230, "enum_value":null,"text":[,
*/

      /* "custom_fields": [
        {
          "id": 783353782030230,
          "name": "SYSTEM COMMAND",
          "type": "enum",
          "enum_value": null,
          "enum_options": [
              {
                  "id": 783353782030231,
                  "name": "Update Account Name",
                  "enabled": true,
                  "color": "yellow-green"
              }
          ],
          "enabled": true
      },

      */

      // Update asana task with custom field.
      client.tasks
        .update(Account.id, {
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

      /*

      // For all tasks under the Account
      for (let i = 0; i < AccountSubTasks.data.length; i++) {}

      let subtask_count = AccountSubTasks.data.length;
      let arrSubTaskIds = [];
      let arrSubTasks = [];

      res.json(cf_AccountNameId);
*7


      /*
      res.json(
        'Hej! Ville du veta nått om task: ' +
          Account.id +
          '? TASK NAME: ' +
          Account.name
      );
      */
    });
  //console.log('#3');
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
