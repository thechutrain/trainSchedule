/* 
*
*
*
*/


// -------------------------- Declare Variables ------------------------------------ 
// Create a variable to reference the database.
var firebaseDB = firebase.database();


/* -------------------------- I.) Update to Database ------------------------------------ 
* this function adds a train to the database
* @param id {number} - the train number
* @param destination {string} - where the train is destined forEach
* @param frequency {number} - how frequently in minutes the train comes
*/
function addTrain(name, destination, firstTrainTime, frequency){
  // 1. get the unix time of first train
  var [hrs, mins] = firstTrainTime.split(":");
  var firstTrainUnix = moment().hour(hrs).minute(mins).unix() * 1000;

  // 2. data to post
  var trainData = {
    name: name,
    destination: destination,
    firstTrain: firstTrainUnix,
    frequency: frequency,
    timeStamp: moment().valueOf(),
  }

  // 3. get a new key for a new train
  var newTrainKey = firebaseDB.ref().child("trains").push().key;

  // 4. write a new update
  var updates = {};
  updates['trains/' + newTrainKey] = trainData;
  return firebaseDB.ref().update(updates);
}


/* -------------------------- II.) Read from Database ------------------------------------ 
*
*/

// get a references to the trains table in firebase
var trainsRef = firebaseDB.ref('trains/');
trainsRef.on('value', displayAllTrains); // auto updates on any changes on db



/* ---------------- displayAllTrains() -------------------
*
*/ 
function displayAllTrains(firebaseData){
  console.log("Displaying All Trains ...");
  // 0. remove all train instances in the table
  $("tr.train").remove();

  // 1. get the train object
  var all_trains = firebaseData.val() || {};

  // 1.5 check to see if there are no train!
  if ($.isEmptyObject(all_trains)){
    var message = $("<h4>").addClass("train bg-danger").text("No train data to show");
    $("#message").append(message);
    return;
  };

  // 2. Iterate through each train 
  Object.keys(all_trains).forEach(function(train_id){
    // i. get a train object
    var train_obj = all_trains[train_id];
    var train_str = JSON.stringify(train_obj);

    // ii. make a new row for each train
    var train_row = $("<tr>")
      .addClass("train")
      .attr("train_id", train_id)
      .data("trainObj", train_str); // store all the train info in the row!

    // iii. Get the proper time & calculate times:
    var origin_time = moment(train_obj["firstTrain"]).format();
    var frequency = train_obj["frequency"];
    var minsAway = Math.ceil(nextTrain(origin_time, frequency));
    var nextArrival = moment().add(minsAway, "minutes").format("HH:mm");
    var firstTrainTime = moment(train_obj["firstTrain"]).format("HH:mm");
    // DEBUGGING purpose
    // for (key in train_obj){
    //   console.log(key + ": " + train_obj[key]);
    // }
    // console.log(" - - - - - - - - - ");
    // debugger;

    // iv. make a new td element for each of the train descriptors.
    var name = $("<td class='train-name'>").text(train_obj["name"]);
    var destination = $("<td class='train-destination'>").text(train_obj["destination"]);
    var firstTrain = $("<td class='train-firstTrain'>").text(firstTrainTime);
    var frequency = $("<td class='train-frequency'>").text(train_obj["frequency"]);
    var nextArrival = $("<td class='train-nextArrival'>").text(nextArrival);
    var minsAway = $("<td class='train-minsAway'>").text(minsAway);

    // v. Make a remove btn
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
      .append(firstTrain)
      .append(frequency)
      .append(nextArrival)
      .append(minsAway)
      .append(removeBtnTd);

    // 5. append row to the html
    // TAKE THIS OUT LATER, when you control user auth upstream!
    $(".train-table").append(train_row);
    // var user = firebase.auth().currentUser;
    // if (user!= null){
    //   $(".train-table").append(train_row);
    // }
    // $(".train-table").append(train_row);

  }); // closes forEach
};

// --------------------------------------------------------------
