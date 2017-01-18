// look @ HELPER FUNCTIONS

// -------------------------------------
firebase.auth().onAuthStateChanged(function(user){
  if (user){
    console.info("THERE IS A USER! SIGNED INNNNN");
    // Display nav bar at the top with sign out button
    displaySignOut();

    // User is signed in
    console.info("User is signed in!");

    // Get User & valid variable names
    var user = firebase.auth().currentUser;
    debugger;

    // is user is not null, get all info
    if (user != null) {
      console.log(user.providerData);
      // user.providerData.forEach(function (profile) ){
      //   console.log(profile);
      // }
    };

  } else {
    console.info("NO USER signed in :(");
    // No User is signed in
    debugger;
    displaySignIn();

    // signIn_PROXY();
    // var signin = confirm("Would you like to sign in?");
    // if (signin){
    //   // sign in
    //   console.log("Let sign in");
    //   var email = prompt("What is your email?");
    //   var password = prompt("Enter your password");
    //   createUser(email, password);
    // }

  } // closes else
}); // closes onAuthStateChanged
