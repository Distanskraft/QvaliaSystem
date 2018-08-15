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
            asanaTaskFunction.getCustomFieldIdByName(
              subTaskResponse,
              'Total Agreed Amount' //TODO: This should be changed into an incomming KEY instead.
            )
        );

        let customFieldId = '';

        customFieldId = asanaTaskFunction.getCustomFieldIdByName(
          subTaskResponse,
          'Total Agreed Amount'
        );

        let customFieldvalue = '';
        console.log(
          'The subtasks custom field value is: ' +
            asanaTaskFunction.getCustomFieldValueById(
              subTaskResponse,
              asanaTaskFunction.getCustomFieldIdByName(
                subTaskResponse,
                'Total Agreed Amount'
              )
            )
        );

        /* Below, the two functions are used combined, the first getting the id of the custom_field
           and the second retrieving the value from the custom field with that custom_field id.*/
        customFieldvalue = asanaTaskFunction.getCustomFieldValueById(
          subTaskResponse,
          asanaTaskFunction.getCustomFieldIdByName(
            subTaskResponse,
            'Total Agreed Amount'
          )
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

/* ASANA TASK FUNCTIONS STARTS HERE, THESE SHOULD BE MOVED TO A SEPARATE .JS FILE */
var asanaTaskFunction = {
  // This is just some test memory storage that I'm trying out, testValue and created_by.
  testValue: 'crap',
  created_by: 'Magnus is king ',

  /*  
  _____ _   _ _   _  ____ _____ ___ ___  _   _ 
 |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | |
 | |_  | | | |  \| | |     | |  | | | | |  \| |
 |  _| | |_| | |\  | |___  | |  | | |_| | |\  |
 |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|

 GET CUSTOM FIELD ID BY NAME

    The getCustomFieldIdByName loops though the customFieldNames in a task
    and compares that custom_field.name with the string input sent to the function. 
    If the string is found in the .name of the custom_field, the id of that custom_field 
    is returned to the code.
 */
  getCustomFieldIdByName: function(task, customFieldName) {
    console.log('asanaTaskFunction.GetCustomFieldIdByName: task: ' + task.id);
    console.log(
      'asanaTaskFunction.GetCustomFieldIdByName: customFieldName: ' +
        customFieldName
    );

    //console.log('task.custom_fields.length: ' + task.custom_fields.length);

    let result = '';
    for (let i = 0; i < task.custom_fields.length; i++) {
      console.log('Field[' + i + '].id: ' + task.custom_fields[i].id);
      console.log('Field[' + i + '].name: ' + task.custom_fields[i].name);
      if (task.custom_fields[i].name === customFieldName) {
        result = task.custom_fields[i].id;
      }
    }

    return result;
    //return this.id returns the string 'id' created at the top "id: 'id',"
  },

  /*  
  _____ _   _ _   _  ____ _____ ___ ___  _   _ 
 |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | |
 | |_  | | | |  \| | |     | |  | | | | |  \| |
 |  _| | |_| | |\  | |___  | |  | | |_| | |\  |
 |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|

 GET CUSTOM VALUE BY FIELD
 
  The getCustomFieldValueById loops though the customFieldId's in a task
  and compares that custom_field.id with the string (id) input sent to the function. 
  If the string is found in the .id of the custom_field, the value of that custom_field 
  is returned to the code. 

  Function is not 100% completed and does not return ENUM values since this requires 
  one more drill-down functionallity looping the enum values.

 */

  getCustomFieldValueById: function(task, customFieldId) {
    // Function is not completed. Have to do more testing.
    console.log('asanaTaskFunction.GetCustomFieldValueById: task: ' + task.id);
    console.log(
      'asanaTaskFunction.GetCustomFieldValueById: customFieldId: ' +
        customFieldId
    );

    // Loop though all the custom fields
    for (let i = 0; i < task.custom_fields.length; i++) {
      console.log('Field[' + i + '].id: ' + task.custom_fields[i].id);
      console.log('Field[' + i + '].name: ' + task.custom_fields[i].name);
      console.log('Field[' + i + '].type: ' + task.custom_fields[i].type);

      let value = '';
      // If the customFieldId matches the requested fieldID, then return the value.

      // Logging the values that will be usd later down in the if statement.
      console.log(
        'AsanaTaskFunction.getCustomFieldValueById: task.custom_fields[' +
          i +
          '].id: ' +
          task.custom_fields[i].id
      );

      console.log(
        'AsanaTaskFunction.getCustomFieldValueById: customFieldId: ' +
          customFieldId
      );

      if (task.custom_fields[i].id === customFieldId) {
        console.log('The comparison value in the if statement was true.');

        console.log(
          'AsanaTaskFunction.getCustomFieldValueById: task.custom_fields[' +
            i +
            '].type: ' +
            task.custom_fields[i].type
        );

        if (task.custom_fields[i].type === 'number') {
          return task.custom_fields[i].number_value;
        } else if (task.custom_fields[i].type === 'text') {
          return task.custom_fields[i].test_value;
        } else if (task.custom_fields[i].type === 'enum') {
          //TODO: Handle the fetching of a ENUM value too and not just numerical and text.
          return task.custom_fields[i].enum_value;
        } else {
          return 'N/A';
        }
      }
    }

    //return this.id returns the string 'id' created at the top "id: 'id',"
  }
};
