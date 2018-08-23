//Function to check if the subscription exists at asana
module.exports.checkAsanaForWebhook = (workspaceId, asanaProjectId) => {
  const target = `https://cm.subflow.se/api/ecokraft/event/webhook/${
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

function subscribeToAsanaWebhooks(eventList, resourceId) {
  console.log(eventList, resourceId);
  return eventList.reduce((promise, _event) => {
    return promise.then(response => {
      //console.log(response);
      //
      return Webhook.findOne({ asanaProjectId: resourceId }).then(WhEvent => {
        //console.log('hej');
        const pType = WhEvent.projectType || 'UNKNOWN';

        return clientA[pluralize(_event.type)]
          .findById(_event.resource, {
            //opt_expand: 'target' & 'text'
          })
          .then(data => {
            // This part will be used to call the Catch Hooks On Zapier
            switch (pType.toUpperCase()) {
              case 'ASSIGNED':
                // Logic here to check if event is for new Assignee
                // then call The CatchHook as required.
                if (_event.type == 'story') {
                  // New Assignee
                  if (data.text.match(/\bassigned\b/i)) {
                    onNewAssignee(resourceId, data);
                  } // End of New Assignee else if
                } // End of Assignee Change Detection

                break;

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
                  // clientA.stories
                  //   .findById(791351724504405)
                  //   .then(story => console.log(story));
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
