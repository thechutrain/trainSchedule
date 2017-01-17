// HELPER FUNCTIONS
// -------------------------------------------------------
// given a train id, it will remove the train
function removeTrain(train_id){
  // console.warn(train_id);
  firebase_db.ref("trains/" + train_id).remove();
};

// -------------------------------------------------------
// this function gets the time until the next train, given the original time & interval
function nextTrain(origin_time, interval){
  // Turn unix nums --> moment objects
  firstTrain = moment(origin_time);
  var now = moment();
  var timeDiff = firstTrain.diff(now, "minutes", true);

  // check to see if firstTrainHas Passed
  if (timeDiff > interval){
    var next_train_in = timeDiff;
  } else {
    var next_train_in = interval - (Math.abs(timeDiff) % interval);
  };
  return next_train_in;
};
// // testing
// var origin_time = moment("2017-01-17T08:00:02-05:00");
// nextTrain(origin_time, 15);

// -------------------------------------------------------
// this function will update the next arrival & minutes away for each train;
function updateTrainTimes(){
  // Get all the trains into a train array
  var trains_NodeList = document.querySelectorAll("tr.train"); // returns a NodeList
  var trains_array = [];
  // debugger;
  // allTrains.prototype.forEach(function(train){
  //   allTrains_array.push(train);
  // });
  for (var i=0; i < trains_NodeList.length; i++){
    trains_array.push(trains_NodeList[i]);
  };
  // console.log(trains_array);
  // debugger;

  // if array is empty just exit;
  if (trains_array.length === 0){
    console.log("no trains");
    return;
  }

  // for each train,
  trains_array.forEach(function(tr_train){
    // i. Get the train object
    var train_ref = $(tr_train);
    var trainObj = JSON.parse(train_ref.data("trainObj"));
    // console.log(trainObj);
    // debugger;

    // ii. calculate the minutes away
    var minsAway = nextTrain(trainObj["firstTrain"], trainObj["frequency"]);
    // var minsAway = Math.ceil(minsAway); // convert to integer

    // iii. set the next arrival
    var nextArrival = moment().add(minsAway, "minutes").format("HH:mm");

    var trainHasPassed = true;
    //* Don't display trains that are set in the future
    // var firstTrain_moment = moment(trainObj["firstTrain"]);
    // var now = moment().add(trainObj["frequency"], "minutes");
    firstTrain = moment(trainObj["firstTrain"]);
    var now = moment();
    var timeDiff = firstTrain.diff(now, "minutes", true);
    // debugger;
    if (timeDiff > trainObj["frequency"] ){
      // train is in the future
      // debugger;
      trainHasPassed = false;
    };


    // *check to see if train arrived
    // console.log((trainObj["frequency"] - minsAway));
    // debugger;
    if (((trainObj["frequency"] - minsAway) < 0.2) && trainHasPassed){
      minsAway = " -- ";
      nextArrival = " Arrived ";
    } else {
      var minsAway = Math.ceil(minsAway); // convert to integer
    };


    // iv. update the view
    $(tr_train).find(".train-minsAway").text(minsAway);
    $(tr_train).find(".train-nextArrival").text(nextArrival);

  })
};
// TESTING
// window.setInterval(function(){
//     updateTrainTimes();
//     console.log("updated");
// }, 2000);

// function test(){
//   console.warn("sup braaaaa");
// }

// -------------------------------------------------------
// this function validates that the time entered by the user is valid
function validateTime(){

}
