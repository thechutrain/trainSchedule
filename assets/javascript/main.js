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

  // clear form data
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  // return the train object;
  // console.log(trainData);
  // debugger;
  return trainData;
}

// ---------------------------------------------------
// EVENT LISTENERS!!
$(document).ready(function(){
  // Event Listener for form submission
  $("#submitBtn").on("click", function(e){
    //1) prevent default
    e.preventDefault();
    // 2) get the form data
    var data = getFormData();
    // 3) submit the train data
    var return_obj = addTrain(data[0], data[1], data[2], data[3]);
    // debugger;
    console.info("Entered Data");
  });

  // General event listener for when a remove btn is called
  $(document).on("click", "button.removeBtn",function(e){
    var train_id = $(this).data("id");
    // console.log(train_id);
    removeTrain(train_id);
  });

});
