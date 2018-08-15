const express = require('express');
const router = express.Router();
const asana = require('asana');

/* The functions are better to have in another .js file to make the code cleaner and also 
   have the possibility to split the functions or code into multiple functions that are
   easier to maintain, and that have intellisense in the code.
    
   The below set's the .js file "myFunctions" as the constant myGodObject.
  const myGodObject = require('./myFunctions');

  After this is done, the functions can be called by this document by the full path. 
  myGodObject.asanaTaskFunction.getCustomFieldIdByName

  The other way is to declare the functions one and one and giving them a different name all 
  together. The below code set's the constant asanaTaskFunction accessable, but the "myOtherObjct"
  would still not show up in this document because it's not being requested.

  const asanaTaskFunction = require('./myFunctions').asanaTaskFunction;

  The last, and cleanest way of adding multiple .js functions from another document is a new way
  the below line of code loads the asanaTaskFunction from the myFunctions.js and the constant name
  will be set to "a". Since there is no : after the myOtherObjct so this library will still keep it's
  original name. This is the cleanest way to add the fucions in my opinion and therefore I will keep it.*/

const { asanaTaskFunction: a, myOtherObjct } = require('./myFunctions');

// Import keys
const keys = require('../../config/keys');
// Create Asana Client
client = asana.Client.create().useAccessToken(keys.distanskraftToken);
client.users.me().then(me => {
  console.log(me);
});

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
           When a match is found the custom_field id is returned to the code. */
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

module.exports = router;
