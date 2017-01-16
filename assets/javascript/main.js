function getFormData(){
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();
  var trainData = {
    0: trainName,
    1: destination,
    2: firstTrain,
    3: frequency,
  };
  return trainData;
}

function clearFormData(){
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
}

// ---------------------------------------------------
// EVENT LISTENERS!!
// Handle submit button
$("#submit").on("click", function(e){
  //1) prevent default
  e.preventDefault();
  // 2) get the form data
  var data = getFormData();
  // 3) submit the train data
  addTrain(data[0], data[1], data[2], data[3]);
  // console.info("Entered Data");
  //4) clear form
  clearFormData();
})
