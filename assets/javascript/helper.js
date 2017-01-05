function getFormData(){
  var trainName = $("#trainName").val().trim();
  var origin = $("#origin").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var trainData = {
    0: trainName,
    1: origin,
    2: destination,
    3: frequency,
  };
  // console.log(trainData);
  return trainData;
}

function clearFormData(){
  var trainName = $("#trainName").val("");
  var origin = $("#origin").val("");
  var destination = $("#destination").val("");
  var frequency = $("#frequency").val("");
}
