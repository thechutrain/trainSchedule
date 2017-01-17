// --------------------------------------------------------------
// Create a variable to reference the database.
var firebase_db = firebase.database();

//  ------------------ PART I. ----------------------------------
// ---------- add train data to the firebase db ----------------
// Function adds a train to the database
// @param id {number} - the train number
// @param origin {string} - the station the train left
// @param destination {string} - where the train is destined forEach
// @param frequency {number} - how frequently in minutes the train comes
function addTrain(name, destination, firstTrainTime, frequency){
  var firstTrainTime = "08:00";
  var firstTrainNum =  moment("2017-01-17T" + firstTrainTime + ":00-05:00").unix() * 1000;
  // var firstTrainNum =  moment("2017-01-17T" + firstTrainTime + ":00-05:00").valueOf(); // same thing
  // console.log(typeof firstTrain); // number
  // debugger;


  // data to post
  var trainData = {
    name: name,
    destination: destination,
    firstTrain: firstTrainNum, //set for current time for now
    frequency: frequency,
    // timeStamp: moment().valueOf(),
  }

  // get a new key for a new train
  var newTrainKey = firebase_db.ref().child("trains").push().key;

  // write a new update
  var updates = {};
  updates['trains/' + newTrainKey] = trainData;
  return firebase_db.ref().update(updates);
}

//  ------------------ PART II. ----------------------------------
// ---------------- Get Train Data from the Firebase DB ----------
// get a references to the trains table in firebase
var trains_ref = firebase_db.ref('trains/');
// Event Listener with call back function
// trains_ref.once('value', displayAllTrains);
trains_ref.on('value', displayAllTrains); // difference if data ever gets changed, it automatically updates!

// helper function -- gets called back
function displayAllTrains(firebase_data){
  // 0. remove all train instances in the table
  $(".train").remove();

  // get the train object
  all_trains = firebase_data.val();
  // TO DO: make an array of object keys --> run through forEach to make each element
  // get all the trains
  // Don't proceed if there's an empty object
  if ($.isEmptyObject(all_trains)){
    var message = $("<h4>").addClass("train bg-danger").text("No train data to show");
    $("table").append(message);
    return;
  };

  Object.keys(all_trains).forEach(function(train_id){
    // DEBUGGIN purpose
    // console.log(train_id);
    // debugger;

    // 0. get a train object
    var train_obj = all_trains[train_id];
    var train_str = JSON.stringify(train_obj);
    // console.log(train_str);
    // debugger;

    // 1. for each train make a new row in the table
    var train_row = $("<tr>")
      .addClass("train")
      .attr("train_id", train_id)
      .data("trainObj", train_str); // store all the train info in the row!

    // 2. Get the proper time & calculate times:
    var origin_time = moment(train_obj["firstTrain"]).format();
    var frequency = train_obj["frequency"];
    var minsAway = Math.ceil(nextTrain(origin_time, frequency));
    var nextArrival = moment().add(minsAway, "minutes").format("hh:mm");

    // DEBUGGING purpose
    // for (key in train_obj){
    //   console.log(key + ": " + train_obj[key]);
    // }
    // console.log(" - - - - - - - - - ");

    // 3. make a new td element for each of the train descriptors.
    var name = $("<td class='train-name'>").text(train_obj["name"]);
    var destination = $("<td class='train-destination'>").text(train_obj["destination"]);
    var frequency = $("<td class='train-frequency'>").text(train_obj["frequency"]);
    var nextArrival = $("<td class='train-nextArrival'>").text(nextArrival);
    // var nextArrival = $("<td>").text(train_obj["firstTrain"]);
    var minsAway = $("<td class='train-minsAway'>").text(minsAway);
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
