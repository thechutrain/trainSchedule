/////////////////// Helper Functions ////////////////
/* Helper functions organized by their functionalities 
* 1.) train function 
* 2.) validators
* 3.) authentication
*/

/*-*-*-*-*-*-*-*-*-* Train Function  *-*-*-*-*-*-*-*-*-*/
// removeTrain() // nextTrain() // 

/* ----------------- #1 removeTrain() ------------------- 
* this function will remove a train from the firebase db, given an id
* @param {string} id: the hash_key/id of the train that is used to identify in firebase db
*/
function removeTrain(id){
    firebaseDB.ref("trains/" + id).remove();
};

/*  ----------------- #2 nextTrain() ------------------- 
* this function will get the next time of the train, given the first train & time interval
* handles exceptions of trains that haven't passed yet
* @param{string} origin: represents the time of the first train
* @param{integer} interval: represents the number of minutes in between trains
*@return{float}: A float of the number of minutes to the next train 
*/
function nextTrain(origin, interval){
    // 1. Get moment object of origin time & current time
    var firstTrainTime = moment(origin);
    var currentTime = moment();

    // 2. Find the difference between the two times
    var timeDifference = firstTrainTime.diff(currentTime, "minutes", true); // exact mins as float 

    // 3. Check if the first train has passed yet
    if (timeDifference > 0){
         // the first train hasn't come yet
        return timeDifference
    } else {
        //  the first train has indeed passed -- > next train is the remainder 
        return (interval - (Math.abs(timeDifference) % interval) );
    }; 
}; 

/* ----------------- #3 updateTrainTimes() ------------------- 
*this function will grab each train displayed in the table
* and implement the nextTrain() & update the view of the nextTrain time.
*/
function updateTrainTimes(){
    // 1. Get all of the trains in the table --> array
    var trains_nl = document.querySelectorAll("tr.train"); 
    var trains_arr = [];
    for (var i=0; i< trains_nl.length; i++){
        trains_arr.push(trains_nl[i]);
    };

    // 2. check to make sure that the array is not empty
    if (trains_arr.length === 0){
        console.log("No trains to update");
        return;
    };

    // 3. For each train
    trains_arr.forEach(function(train){
        // i. get the train object
        var trainObj = JSON.parse( $(train).data("trainObj") );
        var firstTrain = trainObj["firstTrain"]; // as unix #
        var freqTrain = trainObj["frequency"]; // freq of train in mins

        // ii. get the nextArrival time & #mins away the next train is
        var minsAway = nextTrain(firstTrain, freqTrain); // mins as float
        var nextArrival = moment().add(minsAway, "minutes").format("HH:mm");

        // iii. see if the first train has passed
        var trainPassed = moment().diff( moment(firstTrain) ) > 0 ? true : false;

        // iv. check if the train has passed recently --> tell user it has arrived  
        if ( (freqTrain - minsAway < 0.2) && trainPassed ) {
            minsAway = " -- ";
            nextArrival = " Arrived ";
        } else {
            minsAway = Math.ceil(minsAway);
        }

        // v. update the DOM
        $(train).find(".train-minsAway").text(minsAway);
        $(train).find(".train-nextArrival").text(nextArrival);
    }); // forEach

}; // updateTrainTimes()

/*-*-*-*-*-*-*-*-*-* Validators  *-*-*-*-*-*-*-*-*-*/
// validateTime

/* ----------------- validTime() ------------------- 
* this function is used to check for valid first train time in 
* submission of new trains
*@param{string} timeInput - the input of the time of the train
*@return{bool} isValid - check to see if the returned value is valid or not
*/
function validTime(timeInput){
  var re = new RegExp("^[0-9]{1,2}[:][0-9]{2}$", "g");
  var isValid = re.test(timeInput) ? true : false;
  return isValid;
};
/*-*-*-*-*-*-*-*-*-* Authentication  *-*-*-*-*-*-*-*-*-*/
// displaySignOut() // signOut() 
// displaySignIn() // signIn() 




// /* ---------------- displaySignOut() --------------------
// *
// */
// function displaySignOut(){
//   console.warn("Display Sign out ...");
//   // get ref to nav-bar & signin button
//   var navBar = $("div.navbar-header");
//   // remove any buttons inside the navBar
//   // navBar.find("button").remove();
//   navBar.find("#signIn").hide();
//   navBar.find("#signUp").hide();
//   navBar.find("#signOut").show();

//   // add the name the user is signed in as ...
//   var user = firebase.auth().currentUser;
//   if (user!=null){
//     // var userName = user.providerData.email;
//     var userName = user.email;
//     var signedInAs = $("<p>").addClass("navbar-text userInfo").text(userName);
//     navBar.append(signedInAs);
//   }
// };


// /* ---------------- signOut() --------------------
// *
// */
// function signOut(){
//   // console.log("YOU CLICKED THE SIGN OUT BUTTON?????");
//   firebase.auth().signOut().then(function() {
//     // Sign-out successful.
//     console.info("You've successfully signed out");
//     // TO DO: alert the user here?
//     displaySignIn();
//   }, function(error) {
//     // An error happened.
//     alert("ERROR ... check your console");
//     console.log(error);
//   });
// };


// /* ---------------- displaySignIn() --------------------
// *
// */
// function displaySignIn(){
//   console.info("Display Sign in / Sign up...");
//   // get ref to nav-bar & signin button
//   var navBar = $("div.navbar-header");

//   // hide the signout button & remove userInfo
//   navBar.find("#signIn").show();
//   navBar.find("#signUp").show();
//   navBar.find("#signOut").hide();
//   navBar.find(".userInfo").remove();
// };


// /* ---------------- signIn() --------------------
// *
// */
// function signIn(email, password){
//   firebase.auth().signInWithEmailAndPassword(email, password).then(function(response){
//     // TO DO: REMOVE THE MODAL
//     console.log("You just signed successfully!!");
//     console.log(response);
//     // debugger;
//   }).catch(function(error) {
//     // Handle Errors here.
//     console.warn("ERRORS ...");
//     console.warn(error);
//     // debugger;
//     // var errorCode = error.code;
//     // var errorMessage = error.message;
//   });
// };


// // ------------------------- END #8 -------------------------------




// // #10
// // event listeners for the Modal Sign in / Sign up / Login
// $(document).ready(function(){
//   // EVENT LISTENRS FOR THE NAV BUTTONS
//   // Sign Out -- navbar
//   $(".navbar-header #signOut").on("click", signOut);

//   // EVENT LISTENERS FOR THE MODALS BUTTONS
//   // event listener --> display Sign In Modal
//   $("button#signInBtnSubmit").on("click", function(){
//     console.log("Trying to sign in...");
//     // Get the user's email and password
//     var userEmail = $("#inputEmail_1").val().trim();
//     var userPassword = $("#inputPassword_1").val().trim();
//     // TO DO: - validate userEmail?
//     // sign the user in
//     signIn(userEmail, userPassword);
//   });

//   // event listener --> display Sign Up Modal
//   $("button#signUpBtnSubmit").on("click", function(){
//     console.info("Trying to start an account ehhh?");
//     // Get the form data:
//     var userEmail = $("#inputEmail_2").val().trim();
//     var password_2 = $("#inputPassword_2").val().trim();
//     var password_3 = $("#inputPassword_3").val().trim();

//     // TO DO: Validate two passwords the same, userEmail etc.

//     signUp(userEmail, password_2);
//   });

// })
// // ------------------------- END #10 -------------------------------

// // #11
// // hideContent if no user signed in
// // function hideContent(){
// //   // Hide the Train Schedule Panel & Train Submission Form
// //   // $("table.train-table").hide(); // still can see if if you go into DOM :)
// //   $("table.train-table").empty();
// //   debugger;
// //   $("#train-submission-form").hide();
// //
// //   // tell use to sign in / sign up to view
// //   var panelBody = $("<div>").addClass("panel-body").append(
// //     $("<h4>").addClass("text-center").text("Please Sign in or Sign up to view")
// //   );
// //   $("#train-schedule-panel").append(panelBody);
// // };
// // // ------------------------- END #11 -------------------------------
// //
// // // #12
// // // displayContent if no user signed in
// // function showContent(){
// //   // debugger;
// //   // Remove the panel-body
// //   $("#train-schedule-panel .panel-body").remove();
// //   // Make the train table
// //   var th = $("<th>");
// //   var tr = $("<tr>").addClass("bg-info")
// //     .append( th.clone().text("Train Name") )
// //     .append( th.clone().text("Destination") )
// //     .append( th.clone().text("First Train") )
// //     .append( th.clone().text("Frequency (min)") )
// //     .append( th.clone().text("Next Arrival") )
// //     .append( th.clone().text("Minutes Away") )
// //     .append( th.clone() );
// //     debugger;
// //     $("table.train-table").append(tr);
// //   // append to the panel-body
// //
// //   // if ( $(".train-table").length === 0){
// //   //   $("#train-schedule-panel").append(table);
// //   // }
// //
// //
// //   // Display the submit train form
// //   $("#train-submission-form").show();
// // }
