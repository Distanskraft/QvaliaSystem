/* #region INIT Initialized values here.  */

const asana = require('asana');
const request = require('request');
const pluralize = require('pluralize');

// Get the keys
const keys = require('../config/keys');
// Get myfunctions
const {
  asanaTaskFunction: a,
  myOtherObjct
} = require('../routes/api/myFunctions');

// Connect to asana
const client = asana.Client.create().useAccessToken(keys.distanskraftToken);

/* #endregion INIT */

/* #region LAUNCED_FUNCTIONS */

// UPDATE CUSTOM FIELD BY NAME FUNCTION
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

//Function to send post request to webhook -- zapier?
function onServiceTaskCompletion(projectId, data) {
  const hookData = {
    ProjectID: projectId,
    TaskID: data.target.id,
    ModifiedAt: data.target.modified_at
  };
  request(
    {
      uri: 'https://hooks.zapier.com/hooks/catch/2773343/qb3w5x/',
      method: 'POST',
      json: hookData
    },
    (error, response, body) => {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    }
  );
}

//Function to send post request to webhook -- zapier?
function onServiceTaskCreation(projectId, data) {
  const hookData = {
    ProjectID: projectId,
    TaskID: data.id,
    ModifiedAt: data.modified_at
  };
  request(
    {
      uri: 'https://hooks.zapier.com/hooks/catch/2773343/qb3w5x/',
      method: 'POST',
      json: hookData
    },
    (error, response, body) => {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
    }
  );
}

/*
//Function to check if the subscription exists at asana
module.exports.checkAsanaForWebhook = (workspaceId, asanaProjectId) => {
  const target = `https://qvaliasystem.herokuapp.com/api/qvalia/event/webhook/${
    req.body.asanaProjectId
  }`;
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
*/

function subscribeToAsanaWebhooks(eventList, resourceId) {
  console.log(eventList, resourceId);
  return eventList.reduce((promise, _event) => {
    return promise.then(response => {
      //console.log(response);
      //
      return Webhook.findOne({ asanaProjectId: resourceId }).then(WhEvent => {
        //console.log('hej');
        const pType = WhEvent.projectType || 'UNKNOWN';

        return client[pluralize(_event.type)]
          .findById(_event.resource, {
            opt_expand: 'target'
          })
          .then(data => {
            // This part will be used to call the Catch Hooks On Zapier
            switch (pType.toUpperCase()) {
              case 'MASTER':
                if (_event.type == 'story' || _event.type == 'task') {
                  console.log('made it to MASTER case');
                  // Check for story text
                  if (data.text.match(/SYSTEM COMMAND to "Action here"/i)) {
                    console.log('yes');
                    console.log(data.target.id);
                    updateCustomFieldByName(
                      data.target.id,
                      'Account Name',
                      'Snigel'
                    );
                  }
                }
                //
                //
                break;

              case 'CREATEDCOMPLETED':
                if (_event.type == 'story') {
                  console.log('made it to CREATEDCOMPLETED case');
                  // Check for story text
                  if (
                    data.text.match(
                      /marked this task complete|completed this task/i
                    )
                  ) {
                    // Task Completion
                    onServiceTaskCompletion(resourceId, data);
                    console.log(resourceId, data);
                  } // End of comletion Task if
                } else if (_event.type == 'task' && _event.action == 'added') {
                  // New Task is created
                  console.log(resourceId, data);
                  onServiceTaskCreation(resourceId, data);
                } else {
                  console.log('Här nere id: ' + _event.resource);
                }

              default:
                console.log('No Match');
                break;
            }
          })
          .catch(err => console.log(err.value, err.status));
      });
      // // End of Dumping to Database
    }); // End of Reduce Accumulator Return
  }, Promise.resolve([])); // End of Reduce
}

module.exports.subscribeToAsanaWebhooks = subscribeToAsanaWebhooks;

/* #endregion LAUNCED_FUNCTIONS */

module.exports.updateCustomFieldByName = updateCustomFieldByName;
