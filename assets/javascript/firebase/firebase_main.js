// --------------------------------------------------------------
// Create a variable to reference the database.
var firebase_db = firebase.database();

// --------------------------------------------------------------
// Function adds a train to the database
// @param id {number} - the train number
// @param origin {string} - the station the train left
// @param destination {string} - where the train is destined forEach
// @param frequency {number} - how frequently in minutes the train comes
function addTrain(name, destination, firstTrain, frequency){
  // data to post
  var postData = {
    name: name,
    destination: destination,
    firstTrain: moment(),
    frequency: frequency,
    // timeStamp: moment().valueOf(),
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
// get a references to the trains table in firebase
var trains_ref = firebase_db.ref('trains/');
// Event Listener with call back function
// trains_ref.once('value', displayAllTrains);
trains_ref.on('value', displayAllTrains); // difference if data ever gets changed, it automatically updates!

// helper function -- gets called back
function displayAllTrains(all_trains){
  // get all the trains
  all_trains.forEach(function(train){
    // for each train in the all_trains
    // 1) get all the object keys
    var train_obj = train.val();
    for (key in train_obj){
      console.log(key + ": " + train_obj[key]);
    }
    console.log(" - - - - - - - - - ");

  }) // closes forEach on all trains
};

// --------------------------------------------------------------
