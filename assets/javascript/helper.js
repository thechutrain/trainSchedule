// HELPER FUNCTIONS
// #1)
// given a train id, it will remove the train
function removeTrain(train_id){
  // console.warn(train_id);
  firebase_db.ref("trains/" + train_id).remove();
};
// ----------------------- END #1 --------------------------------


// #2)
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
// ------------------------ END #2 -------------------------------

// #3)
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
// ------------------------- END #3 -------------------------------

// #4)
// this function validates that the time entered by the user is valid
function validTime(timeInput){
  var re = new RegExp("^[0-9]{1,2}[:][0-9]{2}$", "g");
  var isValid = re.test(timeInput) ? true : false;
  // console.log(isValid);
  // debugger;
  return isValid;
};
// ------------------------- END #4 -------------------------------


// #5)
function displaySignOut(){
  console.warn("Display Sign out ...");
  // get ref to nav-bar & signin button
  var navBar = $("div.navbar-header");
  // remove any buttons inside the navBar
  // navBar.find("button").remove();
  navBar.find("#signIn").hide();
  navBar.find("#signUp").hide();
  navBar.find("#signOut").show();

  // add the name the user is signed in as ...
  var user = firebase.auth().currentUser;
  if (user!=null){
    // var userName = user.providerData.email;
    var userName = user.email;
    var signedInAs = $("<p>").addClass("navbar-text userInfo").text(userName);
    navBar.append(signedInAs);
  }
};
// ------------------------- END #5 -------------------------------

// #6)
function signOut(){
  // console.log("YOU CLICKED THE SIGN OUT BUTTON?????");
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.info("You've successfully signed out");
    // TO DO: alert the user here?
    displaySignIn();
  }, function(error) {
    // An error happened.
    alert("ERROR ... check your console");
    console.log(error);
  });
};
// ------------------------- END #6 -------------------------------

// #7)
function displaySignIn(){
  console.info("Display Sign in / Sign up...");
  // get ref to nav-bar & signin button
  var navBar = $("div.navbar-header");

  // hide the signout button & remove userInfo
  navBar.find("#signIn").show();
  navBar.find("#signUp").show();
  navBar.find("#signOut").hide();
  navBar.find(".userInfo").remove();
};

// ------------------------- END #7 -------------------------------


// #8)
function signIn(email, password){
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(response){
    // TO DO: REMOVE THE MODAL
    console.log("You just signed successfully!!");
    console.log(response);
    // debugger;
  }).catch(function(error) {
    // Handle Errors here.
    console.warn("ERRORS ...");
    console.warn(error);
    // debugger;
    // var errorCode = error.code;
    // var errorMessage = error.message;
  });
};

function signIn_PROXY(){
  console.log("Let's sign in");
  var email = prompt("What is your email?");
  var password = prompt("Enter your password");
  signIn(email, password);
}
// ------------------------- END #8 -------------------------------


// #9)
function signUp_PROXY(){
  console.log("Let;s sign UPPPP");
  var email = prompt("What is your email?");
  var password = prompt("Enter your password");
  signUp(email, password);
};
// eventually just the lower one
function signUp(email, password){
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){
    console.log(result);
    debugger;
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
};
// ------------------------- END #9 -------------------------------

// #10
// event listeners for the Modal Sign in / Sign up / Login
$(document).ready(function(){
  // EVENT LISTENRS FOR THE NAV BUTTONS
  // Sign Out -- navbar
  $(".navbar-header #signOut").on("click", signOut);

  // EVENT LISTENERS FOR THE MODALS BUTTONS
  // event listener --> display Sign In Modal
  $("button#signInBtnSubmit").on("click", function(){
    console.log("Trying to sign in...");
    // Get the user's email and password
    var userEmail = $("#inputEmail_1").val().trim();
    var userPassword = $("#inputPassword_1").val().trim();
    // TO DO: - validate userEmail?
    // sign the user in
    signIn(userEmail, userPassword);
  });

  // event listener --> display Sign Up Modal
  $("button#signUpBtnSubmit").on("click", function(){
    console.info("Trying to start an account ehhh?");
    // Get the form data:
    var userEmail = $("#inputEmail_2").val().trim();
    var password_2 = $("#inputPassword_2").val().trim();
    var password_3 = $("#inputPassword_3").val().trim();

    // TO DO: Validate two passwords the same, userEmail etc.

    signUp(userEmail, password_2);
  });

})
// ------------------------- END #10 -------------------------------

// #11
// hideContent if no user signed in
// function hideContent(){
//   // Hide the Train Schedule Panel & Train Submission Form
//   // $("table.train-table").hide(); // still can see if if you go into DOM :)
//   $("table.train-table").empty();
//   debugger;
//   $("#train-submission-form").hide();
//
//   // tell use to sign in / sign up to view
//   var panelBody = $("<div>").addClass("panel-body").append(
//     $("<h4>").addClass("text-center").text("Please Sign in or Sign up to view")
//   );
//   $("#train-schedule-panel").append(panelBody);
// };
// // ------------------------- END #11 -------------------------------
//
// // #12
// // displayContent if no user signed in
// function showContent(){
//   // debugger;
//   // Remove the panel-body
//   $("#train-schedule-panel .panel-body").remove();
//   // Make the train table
//   var th = $("<th>");
//   var tr = $("<tr>").addClass("bg-info")
//     .append( th.clone().text("Train Name") )
//     .append( th.clone().text("Destination") )
//     .append( th.clone().text("First Train") )
//     .append( th.clone().text("Frequency (min)") )
//     .append( th.clone().text("Next Arrival") )
//     .append( th.clone().text("Minutes Away") )
//     .append( th.clone() );
//     debugger;
//     $("table.train-table").append(tr);
//   // append to the panel-body
//
//   // if ( $(".train-table").length === 0){
//   //   $("#train-schedule-panel").append(table);
//   // }
//
//
//   // Display the submit train form
//   $("#train-submission-form").show();
// }
