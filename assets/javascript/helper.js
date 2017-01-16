function removeTrain(train_id){
  // console.warn(train_id);
  debugger;
  firebase_db.ref("trains/" + train_id).remove();
  console.warn(train_id);
}
