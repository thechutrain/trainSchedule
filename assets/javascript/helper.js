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
  navBar.find("button").remove();

  // add the name the user is signed in as ...
  var user = firebase.auth().currentUser;
  if (user!=null){
    // var userName = user.providerData.email;
    var userName = user.email;
    var signedInAs = $("<p>").addClass("navbar-text userInfo").text(userName);
    navBar.append(signedInAs);
  }

  // make a signout button
  var signOutBtn = $("<button>")
    .attr("type", "button")
    .addClass("btn btn-default navbar-btn")
    .attr("id", "signin");

  // change the sign in button to a sign out button;
  signOutBtn.attr("id", "signOut").text("Sign out");

  // add event listener to sign out btn
  signOutBtn.on("click", signOut); // closes event listener

  // debugger;
  // append the signout button
  navBar.append(signOutBtn);

};
// ------------------------- END #5 -------------------------------

// #6)
function signOut(){
  // console.log("YOU CLICKED THE SIGN OUT BUTTON?????");
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.info("You've successfully signed out");
  }, function(error) {
    // An error happened.
    alert("ERROR ... check your console");
    console.log(error);
  });
};
// ------------------------- END #6 -------------------------------

// #7)
function displaySignIn(){
  console.warn("Display Sign in / Sign up...");
  // get ref to nav-bar & signin button
  var navBar = $("div.navbar-header");
  // remove any buttons inside the navBar
  navBar.find("button").remove();
  navBar.find(".userInfo").remove();

  // make a signin button
  var signInBtn = $("<button>")
    .attr("type", "button")
    .addClass("btn btn-primary navbar-btn")
    .attr("id", "signin")
    .text("Sign in")
    .data("toggle", "modal")
    .data("target", "#exampleModal");

  // // add event listener to sign out btn
  signInBtn.on("click", function(){
    // signIn_PROXY();
    console.log("You clicked me");
    // $("#exampleModal").click();
    $("#exampleModal").trigger("click");
  }); // closes event listener

  // TO DO ... display a SIGN UP as well
  // make a signUp button
  var signUpBtn = $("<button>")
    .attr("type", "button")
    .addClass("btn btn-default navbar-btn")
    .attr("id", "signUp")
    .text("Sign Up");

  signUpBtn.on("click", signUp_PROXY);

  // add the button to html
  // debugger;
  navBar.append(signInBtn);
  navBar.append(signUpBtn);

};

// ------------------------- END #7 -------------------------------


// #8)
function signIn(email, password){
  firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error) {
  // Handle Errors here.
  console.warn("ERRORS ...");
  console.warn(error);
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
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
};
// ------------------------- END #9 -------------------------------
