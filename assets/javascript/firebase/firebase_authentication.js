// look @ HELPER FUNCTIONS
// #5 - #9

// -------------------------------------
firebase.auth().onAuthStateChanged(function(user){
  if (user){
    // User is signed in
    // console.info("User is signed in!");

    // Display nav bar at the top with sign out button
    displaySignOut();

    // Get User & valid variable names
    var user = firebase.auth().currentUser; // Necessary??

    // is user is not null, get all info
    // if (user != null) {
    //   console.log(user.providerData);
    // };

  } else {
    // No User is signed in
    // console.info("NO USER signed in :( ");
    displaySignIn();

    // Hide content
    // hideContent();
  }
}); // closes onAuthStateChanged
