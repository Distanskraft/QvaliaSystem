/* #region INIT */
const express = require('express');
const router = express.Router();
const asana = require('asana');

// Bring in asana helper
const helper = require('../../helpers/asana');

/* Email verifyer
const Verifier = require('email-verifier');
*/

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

/* #region WEBHOOKS_START: */

//@ route  POST api/ecokraft/subscribe/event
//@ desc   Route that starts to subscribe on events in an asana project
//@ desc   keys: asanaProjectId, workspaceId, projectType
//@ access Public
router.post('/subscribe/event', (req, res) => {
  const checkAsanaForWebhook = (workspaceId, asanaProjectId) => {
    const target = `https://qvaliasystem.herokuapp.com/api/qvalia/event/webhook/${asanaProjectId}`;
    client.webhooks
      .getAll(workspaceId, {
        resource: asanaProjectId
      })
      .then(hooksList => {
        console.log(hooksList);
        // Check Asana if Hook Already exist on same target
        // then return the already existing hook otherwise create new
        var resource = asanaProjectId;

        var alreadyExistingHook = hooksList.data.find(hook => {
          return hook.target == target;
        });

        if (alreadyExistingHook) {
          //Log
          console.log(`Hook Already exists for ${resource}:${target}`);

          return alreadyExistingHook;
        } else {
          return client.webhooks.create(resource, target);
        }
      })
      .then(hook => {
        res.json(hook);
      })
      .catch(err => {
        res.json(err.value);
      });
  };

  //Check in db if hook already exists
  let errors = {};
  Webhook.findOne({ asanaProjectId: req.body.asanaProjectId })
    .then(asanaProjectId => {
      if (asanaProjectId) {
        //Function to check if the subscription exists at asana
        checkAsanaForWebhook(
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

/* #endregion WEBHOOKS_START */

router.post('/email/verifyemail', (req, res) => {
  const Verifier = require('email-verifier');
  const email = req.body.email;
  let verifier = new Verifier('at_xS9OG0sYnp4ZQ6VloRDXq7Gn2XMDF');

  verifier.verify(email, (err, data) => {
    if (err) throw err;

    console.log(data);

    console.log('SMTP CHECK: ', data.smtpCheck);
    if (data.smtpCheck == 'null' || data.smtpCheck == 'false') {
      res.end('FALSE');
    } else {
      res.end('TRUE');
    }
    // res.json(data);
    //console.log(data);
    //res.data.json;
  });
});
//
//

/*  #region TASK_updateAccount */

router.post('/task/updateAccountName', (req, res) => {
  let arrTaskIds = [];
  let arrTemp = [];
  // Array that will be used to loop though all the tasks, and
  // set the field Account Name to the correct name.
  arrTaskIds.push(req.body.taskId);

  client.tasks
    .subtasks(req.body.taskId)
    .then(response => {
      return response;
    })
    .then(response => {
      let i = 0;
      // The below loop executes once, then tests the condition if its true.
      do {
        NumberOfUniqueTaskIdsAtStart = arrTaskIds.length;
        console.log('Number of tasks at start:', NumberOfUniqueTaskIdsAtStart);
        console.log('arrTaskIds before: ', arrTaskIds.length);
        console.log('arrTaskIds values: ', arrTaskIds);
        console.log(arrTemp);

        /*
        for ( i < arrTaskIds.length; i++);
        {
          console.log('Working on id: ', arrTaskIds[i]);

          getSubTaskIds(arrTaskIds[i])
            .then(result => {
              arrTemp.push(result);
              console.log('ArrTemp: ', arrTemp);
              // Add the id's to the arrTemp array which is the container for all
              // new tasks.
              arrTemp.push(myTemp);
              // Push all new found id's to the storage array
              arrTaskIds.push(arrTemp);
              console.log('arrTaskIds after: ', arrTaskIds.length);
              return arrTaskIds;
            })
            .catch(err => {
              console.log(err);
            });
        }
        */

        //Remove any duplicates.
        console.log('Array before unique: ', arrTaskIds);
        arrTaskIds = arrTaskIds.unique();
        console.log('Array after unique: ', arrTaskIds);

        NumberOfUniqueTaskIdsAtFinish = arrTaskIds.length;
        console.log(
          'Number of tasks at finish:',
          NumberOfUniqueTaskIdsAtFinish
        );
      } while (arrTaskIds.length < 0);

      res.json(response);
    })
    .catch(err => {
      console.log(err);
      return err;
      res.json(err);
    });
});

//res.json(subtasks);

/*
  let arrTaskIds = [];
  let arrTemp = [];

  // Get the account = requested task.
  client.tasks
    .update(req.body.taskId, { id: req.body.taskId })
    .then(response => {
      arrTaskIds.push(response.id);
      // The temp array will be used in order to compare if there where any new
      // task id's added to the array.
      arrTemp = arrTaskIds;
      let NumberOfUniqueTaskIdsAtStart = 0;
      let NumberOfUniqueTaskIdsAtFinish = 0;

      // The below loop executes once, then tests the condition if its true.
      do {
        NumberOfUniqueTaskIdsAtStart = arrTaskIds.length;
        console.log('Number of tasks at start:', NumberOfUniqueTaskIdsAtStart);
        console.log('arrTaskIds before: ', arrTaskIds.length);
        console.log(arrTemp);
        let i = 0;
        for (i = 0; i < arrTaskIds.length; i++);
        {
          console.log('Working on id: ', arrTaskIds[i]);

          getSubTaskIds(arrTaskIds[i])
            .then(result => {
              arrTemp.push(result);
              console.log('ArrTemp: ', arrTemp);
              // Add the id's to the arrTemp array which is the container for all
              // new tasks.
              arrTemp.push(myTemp);
              // Push all new found id's to the storage array
              arrTaskIds.push(arrTemp);
              console.log('arrTaskIds after: ', arrTaskIds.length);
              return arrTaskIds;
            })
            .catch(err => {
              console.log(err);
            });
        }

        //Remove any duplicates.
        console.log('Array before unique: ', arrTaskIds);
        arrTaskIds = arrTaskIds.unique();
        console.log('Array after unique: ', arrTaskIds);

        NumberOfUniqueTaskIdsAtFinish = arrTaskIds.length;
        console.log(
          'Number of tasks at finish:',
          NumberOfUniqueTaskIdsAtFinish
        );
      } while (arrTaskIds.length < 0);

      return response;
    })
    .catch(err => {
      console.log(err);
      return err;
    });

  // NumberOfUniqueTaskIdsAtStart < NumberOfUniqueTaskIdsAtFinish
  res.json(arrTaskIds);
*/
//
//
//
//
//
//
//

/*

  // Add the Account Task Id to the array
  arrTaskIds.push(Account.id);
  // Get all the subtasks for the account.
  let AccountSubTasks = await client.tasks
    .subtasks(Account.id)
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log(err);
      return err;
    });

  // Loop though all the subtasks
  for (i = 0; i < AccountSubTasks.data.length; i++) {
    // For each found subtask, create thisSubTask object to pull the id from.
    let thisTask = AccountSubTasks.data[i];
    // Push the id to the arrTaskIds.
    arrTaskIds.push(thisTask.id);
  }

  let arrTemp = arrTaskIds.unique();
  arrTaskIds = arrTemp;

  //let duplicates = [1,3,4,2,1,2,3,8];
  let uniques = duplicates.unique(); // result = [1,3,4,2,8]


  //console.log(AccountSubTasks.data.id.length);

  console.log(arrTaskIds);

  res.json(AccountSubTasks);
    */

async function getSubTaskIds(taskId) {
  let arrResponse = [];

  // Get all the subtasks for the account.
  let subTasks = await client.tasks
    .subtasks(taskId)
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log(err);
      return err;
    });

  // Loop though all the subtasks
  for (i = 0; i < subTasks.data.length; i++) {
    // For each found subtask, create thisSubTask object to pull the id from.
    let thisTask = subTasks.data[i];
    // Push the id to the response array.
    arrResponse.push(thisTask.id);
  }
  console.log(arrResponse);
  return arrResponse;
}

// Function to get unique values from an array.
Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
};

//
//
//
//
//
//
//
//
//
//

/*  #region TASK_updateCustomFieldByName */

router.post('/task/updateCustomFieldByName', async (req, res) => {
  const resp = await updateCustomFieldByName(
    req.body.taskId,
    req.body.cfName,
    req.body.cfValue
  );
  //console.log('response', resp);
  res.json(resp);
});

async function updateCustomFieldByName(taskId, cfName, cfValue) {
  /* Add the below into the router.post section: 
    const resp = await updateCustomFieldByName(
    req.body.taskId,
    req.body.cfName,
    req.body.cfValue
  );
  //console.log('response', resp);
  res.json(resp);
  */

  // Pull the task from Asana.
  let task = await a.getTaskById(taskId);

  if (task.toString() != 'Error: Invalid Request') {
    // Storage for Custom Field Id.
    let cfId = '';

    // Object used to send the custom fields to the Asana API
    let myCustom_field = {};

    // Filter the custom fields by name, if no hit, return error.
    return task.custom_fields.filter(function(field) {
      if (field.name === cfName) {
        if (field.type === 'text') {
          // Set the custom field id
          cfId = field.id;
          // Set the custom field object id to the incomming value.
          myCustom_field[cfId] = cfValue;
          // Update the task accordingly
          return client.tasks
            .update(task.id, {
              name: task.name,
              custom_fields: myCustom_field
            })
            .then(response => {
              return (
                'Successfully updated custom field' +
                cfName +
                ' to value ' +
                cfValue +
                ' in task ' +
                taskId +
                '.\n' +
                response
              );
            })
            .catch(err => console.log(err.value.errors));
        } else if (field.type === 'number') {
          // Set the custom field id
          cfId = field.id;
          // Set the custom field object id to the incomming value.
          myCustom_field[cfId] = cfValue;
          // Update the task accordingly
          return client.tasks
            .update(task.id, {
              name: task.name,
              custom_fields: myCustom_field
            })
            .then(response => {
              return (
                'Successfully updated custom field' +
                cfName +
                ' to value ' +
                cfValue +
                ' in task ' +
                taskId +
                '.\n' +
                response
              );
            })
            .catch(err => console.log(err.value.errors));
        } else if (field.type === 'enum') {
          field.enum_options.forEach(enum_options => {
            if (enum_options.name === cfValue) {
              // Set the custom field id
              cfId = field.id;
              // Set the custom field object id to the id which matches the incomming value.
              myCustom_field[cfId] = enum_options.id;
              // Update the task accordingly
              return client.tasks
                .update(task.id, {
                  name: task.name,
                  custom_fields: myCustom_field
                })
                .then(response => {
                  return (
                    'Successfully updated custom field' +
                    cfName +
                    ' to value ' +
                    cfValue +
                    ' in task ' +
                    taskId +
                    '.\n' +
                    response
                  );
                })
                .catch(err => console.log(err.value.errors));
            } else {
              // TODO: Error handling not working correctly. Gotta fix that for later.
              return 'ERROR 3. The requested custom field was found, but was enum and the requested update value was not in the enum list..';
            }
          });
        }
        // TODO: Error handling not working correctly. Gotta fix that for later.
      } else {
        return (
          'ERROR 2. The requested custom field ' + cfName + ' was not found.'
        );
      }
    });
  } else {
    return 'ERROR 1. No Asana task was found with ID: ' + taskId;
  }
}

/* #endregion TASK_updateCustomFieldByName */

/* #region TASK_addTaskToProjectByName */

router.post('/task/addtasktoprojectbyname', async (req, res) => {
  const resp = await addTaskToProjectByName(
    req.body.taskId,
    req.body.projectName
  );

  res.json(resp);
});

async function addTaskToProjectByName(taskId, projectName) {
  // Retrieve all projects.
  return client.projects
    .findAll({ workspace: 542024449570027 })
    .then(function(response) {
      //console.log(response);
      response.data.forEach(project => {
        if (project.name === projectName) {
          // TODO: Handle multiple hit issue.
          console.log('Found project, has id: ' + project.id);
          let to = { project: project.id };
          let taskid = taskId;
          client.tasks
            .addProject(taskid, to)
            .then(response => {
              return response;
            })
            .catch(err => {
              return err;
            });
        }
      });
      //response.data.name.forEach(name => console.log(response.data.name));
    });
}

/* #endregion /* #region TASK_addTaskToProjectByName */

/* #region TASK_addTagToTaskByName */

router.post('/task/addtagtotaskbyname', async (req, res) => {
  const query = req.body.name;

  updateOrCreateTag(query, {
    workspace: keys.distanskraftSe,
    name: req.body.name,
    color: req.body.color,
    notes: req.body.notes || ''
  })
    .then(results => res.status(200).json(results))
    .catch(err => res.json(err.value.errors));
});

async function updateOrCreateTag(query, defaults) {
  {
    var queryData = {
      type: 'tag',
      query: query,
      count: 1
    };
    return client.workspaces
      .typeahead(defaults.workspace, queryData)
      .then(results => {
        if (results.data[0] && results.data[0].name == query) {
          return client.tags.update(results.data[0].id, defaults);
        }
        return client.tags.create(defaults);
      });
  }
}

/* #endregion TASK_addTagToTaskByName */

//
//
//
//
//
//
//
//
//
//
//
//
//

/* #region POST_TASK_SHOW - UPDATE TASK */
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
router.post('/task/show', (req, res) => {
  const taskId = req.body.taskId; // send taskId @params

  // Update asana task with custom field.
  client.tasks
    .update(taskId, {})

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

/* #endregion POST_TASK_SHOW */

//
//
//
//
//
//

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
