/* -------- getFormData() ------
* this function gets the data from the form, and returns it as an object
*
*/
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

  if (!validTime(firstTrain)) {
    alert("Please enter a valid time in form: 'hh:mm' military time");
    debugger;
    return false;
  };

  // clear form data
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  return trainData;
}

// ----------------------- EVENT LISTENERS ----------------------------
$(document).ready(function(){
  // Event listeners for Login, Sign Up, Logout
  $("div.navbar-header button").on("click", function(){
    console.info(this);
  });

  // Form Submission
  $("#submitBtn").on("click", function(e){
    // 1. prevent default
    e.preventDefault();
    
    // 2. get the form data
    var data = getFormData();
    if (!data){return;} // if not valid data, exit out!

    // 3. submit the train data
    var return_obj = addTrain(data[0], data[1], data[2], data[3]);
    // debugger;
    console.info("Entered Data");
  });

  // Removing Train
  $(document).on("click", "button.removeBtn",function(e){
    var train_id = $(this).data("id");
    removeTrain(train_id);
  });

});
