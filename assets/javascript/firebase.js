// --------------------------------------------------------------
// Create a variable to reference the database.
var firebase_db = firebase.database();

// --------------------------------------------------------------
// Create a train schedule database - works
// firebase_db.ref("train").on("value", (snapshot)=>{
//   console.log(snapshot.val());
// })

// --------------------------------------------------------------
// Function adds a train to the database
function addTrain(destination, time){
  // data to post
  var postData = {
    destination: destination,
    time: time,
  }
  // get a new post key
  var newPostKey = firebase_db.ref().child('trains').push().key;
  // write a new update
  var updates = {};
  updates['/trains/' + newPostKey] = postData;

  // Updating
  return firebase_db.ref().update(updates);
}

var test = addTrain("Tampa", 12345);
