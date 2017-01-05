var train_ref = firebase_db.ref('trains/');
// console.log(train_ref.val());
train_ref.once('value', function(all_trains){
  // get all the trains
  all_trains.forEach(function(train){
    // for each train in the all_trains
    // 1) get all the object keys
    var train_obj = train.val();


    // debugger;
  }) // closes forEach on all trains
})
