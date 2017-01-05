// --------------------------------------------------------------
// Create a variable to reference the database.
var firebase_db = firebase.database();

// --------------------------------------------------------------
// Function adds a train to the database
// @param id {number} - the train number
// @param origin {string} - the station the train left
// @param destination {string} - where the train is destined forEach
// @param frequency {number} - how frequently in minutes the train comes
function addTrain(id, origin, destination, frequency){
  // data to post
  var postData = {
    id: id,
    origin: origin,
    destination: destination,
    frequency: frequency,
    timeStamp: moment().valueOf(),
  }
  // get a new post key
  var newPostKey = firebase_db.ref().child('trains').push().key;
  // write a new update
  var updates = {};
  updates['/trains/' + newPostKey] = postData;

  // Updating
  return firebase_db.ref().update(updates);
}

// --------------------------------------------------------------
// // test the function that adds a train
// var test = addTrain("Tampa", 12345);
