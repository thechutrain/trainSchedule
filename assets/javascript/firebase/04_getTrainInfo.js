var train_ref = firebase_db.ref('trains/');
// console.log(train_ref.val());
train_ref.once('value', function(all_trains){
  // get all the trains
  all_trains.forEach(function(train){
    // for each train in the all_trains
    // 1) get all the object keys
    var train_obj = train.val();
    // console.log(train_obj);
    // console.log(typeof train_obj);
    // var keys = Object.keys(train_obj).map(function(key){
    //   return train_obj[key];
    // });
    // console.log(keys);

    for (key in train_obj){
      console.log(key + ": " + train_obj[key]);
    }

  }) // closes forEach on all trains
})
