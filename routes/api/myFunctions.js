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
