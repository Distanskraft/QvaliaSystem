/* #region START */

/* #region INIT INITIALIZING */

const express = require('express');
const router = express.Router();
const asana = require('asana');

// Import keys
const keys = require('../../config/keys');
// Create Asana Client

api = asana.Client.create().useAccessToken(keys.distanskraftToken);
api.users.me().then(me => {
  console.log(me);
});

/* #endregion INIT [optional region name] */

/* #region DOCUMENT_COMMENTS ABOUT THIS DOCUMENT */

/* The is the myFunctions.js file. It's used to easier keep track of the functions used.

   The functions are better to have in another .js file to make the code cleaner and also 
   have the possibility to split the functions or code into multiple functions that are
   easier to maintain, and that have intellisense in the code.
    
  In order to use these functions, add one of the following code snippes in your .js file.

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
  original name. This is the cleanest way to add the fucions in my opinion.

  const { asanaTaskFunction: a, myOtherObjct } = require('./myFunctions');
*/

/* #endregion DOCUMENT_COMMENTS */
/* #region CONST_COMMENT ABOUT THE COMMENTS CONST */
/* THE COMMENTS VARIABLE
   The variable below is used in a 1 or something else fashion. If the value is 1
   The function code will show console.log() messages from the functions, if however
   the value is something else the comments will not be shows in the console.
   */
/* #endregion CONST_COMMENT*/
const comments = 1; //TODO: Build custom console.log function that looks at the COMMENTS var and acts accordingly, like "cl()";

/*
            _____         _   _            _______        _____ _  __  ______ _    _ _   _  _____ _______ _____ ____  _   _ 
     /\    / ____|  /\   | \ | |   /\     |__   __|/\    / ____| |/ / |  ____| |  | | \ | |/ ____|__   __|_   _/ __ \| \ | |
    /  \  | (___   /  \  |  \| |  /  \       | |  /  \  | (___ | ' /  | |__  | |  | |  \| | |       | |    | || |  | |  \| |
   / /\ \  \___ \ / /\ \ | . ` | / /\ \      | | / /\ \  \___ \|  <   |  __| | |  | | . ` | |       | |    | || |  | | . ` |
  / ____ \ ____) / ____ \| |\  |/ ____ \     | |/ ____ \ ____) | . \  | |    | |__| | |\  | |____   | |   _| || |__| | |\  |
 /_/    \_\_____/_/    \_\_| \_/_/    \_\    |_/_/    \_\_____/|_|\_\ |_|     \____/|_| \_|\_____|  |_|  |_____\____/|_| \_|

  */

/* #endregion START */
var asanaTaskFunction = {
  // This is just some test memory storage that I'm trying out.
  MotherTaskID: 'N/A',
  MotherTaskName: 'N/A',
  MotherTaskCreated_by: 'N/A',

  /* #region FUNCTION: getCustomFieldIdByName */

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
    if (comments == 1) {
      console.log('asanaTaskFunction.GetCustomFieldIdByName: task: ' + task.id);
      console.log(
        'asanaTaskFunction.GetCustomFieldIdByName: customFieldName: ' +
          customFieldName
      );
    }
    if (comments == 1) {
      console.log('task.custom_fields.length: ' + task.custom_fields.length);
    }

    let result = '';
    for (let i = 0; i < task.custom_fields.length; i++) {
      console.log('Field[' + i + '].id: ' + task.custom_fields[i].id);
      console.log('Field[' + i + '].name: ' + task.custom_fields[i].name);
      if (task.custom_fields[i].name === customFieldName) {
        result = task.custom_fields[i].id;
      }
    }
    return result;
  },

  /* #endregion */

  /* #region FUNCTION: getCustomFieldValueById */

  /* #region FUNCTION: getCustomFieldValueById */

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
    /*
    console.log('asanaTaskFunction.GetCustomFieldValueById: task: ' + task.id);
    console.log(
      'asanaTaskFunction.GetCustomFieldValueById: customFieldId: ' +
        customFieldId
    );
    */

    // Loop though all the custom fields
    for (let i = 0; i < task.custom_fields.length; i++) {
      if (comments == 1) {
        console.log('Field[' + i + '].id: ' + task.custom_fields[i].id);
        console.log('Field[' + i + '].name: ' + task.custom_fields[i].name);
        console.log('Field[' + i + '].type: ' + task.custom_fields[i].type);
      }

      let value = '';
      // If the customFieldId matches the requested fieldID, then return the value.

      if (comments == 1) {
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
      }

      if (task.custom_fields[i].id === customFieldId) {
        if (comments == 1) {
          console.log('The comparison value in the if statement was true.');
          console.log(
            'AsanaTaskFunction.getCustomFieldValueById: task.custom_fields[' +
              i +
              '].type: ' +
              task.custom_fields[i].type
          );
        }
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
  },

  /* #endregion */

  /*  
  _____ _   _ _   _  ____ _____ ___ ___  _   _ 
 |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | |
 | |_  | | | |  \| | |     | |  | | | | |  \| |
 |  _| | |_| | |\  | |___  | |  | | |_| | |\  |
 |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|

  GET TASK BY ID
  The getFunctionById is still under development.
  */

  getTaskById: function(taskId) {
    //console.log('Task ID from within the function: ', taskId);
    return api.tasks
      .update(taskId, {})
      .then(response => {
        return response;
      })
      .catch(err => err);
  },
  getSubTasks: function(taskId) {
    //console.log('Task ID from within the function: ', taskId);
    return api.tasks
      .subtasks(taskId)
      .then(response => {
        let arrSubTaskIds = [];
        let arrSubTasks = [];
        for (let i = 0; i < response.data.length; i++) {
          console.log('ID: ', response.data[i].id);
          //res.end('RESPONSE DATA LENGTH: ', response.data.length);
          /*
          api.tasks
            .update(response.data[i].id)
            .then(responseSublevel => arrSubTasks.push(responseSublevel));

          arrSubTaskIds[i] = response.data[i].id;
          */
        }
        return response;
      })
      .catch(err => err);
  },

  updateTaskCustomFields: function(taskId, customFields) {
    //console.log('Task ID from within the function: ', taskId);
    return api.tasks
      .update(taskId, {
        custom_fields: customFields
      })
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        return res.json(err);
      });
  },
  /*
  getSubTaskIdsAndExcludeSections: function(taskId) {
    //console.log('Task ID from within the function: ', taskId);
    return api.tasks
      .update(taskId, {})
      .then(response => {
        // For every subtask in the main task
        let arrSubTaskIds = [];
        let arrSubTasks = [];

        // For all subtasks push the task ID into the array arrSubTasks created above.
        for (let i = 0; i < response.data.length; i++) {
          api.tasks
            .update(response.data[i].id)
            .then(response => arrSubTasks.push(response));
          console.log(response);

          arrSubTaskIds[i] = response.data[i].id;
        }

        return arrSubTaskIds;
      })
      .catch(err => err);
  },
  */
  this_dummy_new_function: function(task, taskID) {},
  this_dummy_new_function2: function(task, taskID) {}
};

/*
  __  ____     __   ____ _______ _    _ ______ _____     ____  ____       _ ______ _____ _______ 
 |  \/  \ \   / /  / __ \__   __| |  | |  ____|  __ \   / __ \|  _ \     | |  ____/ ____|__   __|
 | \  / |\ \_/ /  | |  | | | |  | |__| | |__  | |__) | | |  | | |_) |    | | |__ | |       | |   
 | |\/| | \   /   | |  | | | |  |  __  |  __| |  _  /  | |  | |  _ < _   | |  __|| |       | |   
 | |  | |  | |    | |__| | | |  | |  | | |____| | \ \  | |__| | |_) | |__| | |___| |____   | |   
 |_|  |_|  |_|     \____/  |_|  |_|  |_|______|_|  \_\  \____/|____/ \____/|______\_____|  |_|   
                                                                                                 
*/

const myOtherObjct = {
  sayHi: function() {
    return 'hi';
  }
};

/* The below code exports all the modules in this .js file into an object. 
   See more info at the top on how to use this object in the work.js file. */
module.exports = {
  asanaTaskFunction,
  myOtherObjct
};
