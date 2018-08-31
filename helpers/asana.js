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
                if (_event.type == 'story') {
                  console.log('made it to MASTER case');
                  // Check for story text
                  if (data.text.match(/SYSTEM COMMAND/i)) {
                    console.log('yes');
                  } else if (
                    _event.type == 'story' &&
                    _event.action == 'added'
                  ) {
                    clientA.stories.findById(_event.resource).then(story => {
                      if (story.text.match(/:love_letter:/i)) {
                        console.log(story);
                        onLoveLetter(resourceId, story);
                      }
                    });
                  }
                }
              case 'CREATEDCOMPLETED':
                if (_event.type == 'story') {
                  console.log('made it to service case');
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
