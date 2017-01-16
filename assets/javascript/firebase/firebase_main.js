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

// ---------------- PART II.  ----------------
// ---------------- Get Train Data from the Firebase DB ----------------
// get a references to the trains table in firebase
var trains_ref = firebase_db.ref('trains/');
// Event Listener with call back function
// trains_ref.once('value', displayAllTrains);
trains_ref.on('value', displayAllTrains); // difference if data ever gets changed, it automatically updates!

// helper function -- gets called back
function displayAllTrains(firebase_data){
  all_trains = firebase_data.val();
  // TO DO: make an array of object keys --> run through forEach to make each element

  // get all the trains
  Object.keys(all_trains).forEach(function(train_id){
    // DEBUGGIN purpose
    // console.log(train_id);
    // debugger;

    // 1. for each train make a new row in the table
    var train_row = $("<tr>").attr("train_id", train_id);

    // 2. get a train object
    var train_obj = all_trains[train_id];

    // DEBUGGING purpose
    // for (key in train_obj){
    //   console.log(key + ": " + train_obj[key]);
    // }
    // console.log(" - - - - - - - - - ");

    // 3. make a new td element for each of the train descriptors.
    var name = $("<td>").text(train_obj["name"]);
    var destination = $("<td>").text(train_obj["destination"]);
    var frequency = $("<td>").text("--");
    var nextArrival = $("<td>").text("--");
    var minsAway = $("<td>").text("--");
    // 3.5 Make a remove btn
    var removeSpan = $("<span>").addClass("glyphicon glyphicon-remove");
    var removeBtn = $("<button>")
      .addClass("btn btn-danger removeBtn")
      .data("id", train_id)
      .append(removeSpan);
    var removeBtnTd = $("<td>").append(removeBtn);

    // 4. append all the train key-values to the row
    train_row
      .append(name)
      .append(destination)
      .append(frequency)
      .append(nextArrival)
      .append(minsAway)
      .append(removeBtnTd);

    // 5. append row to the html
    $("table").append(train_row);

  }); // closes forEach
};

// --------------------------------------------------------------
