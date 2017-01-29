var time = {
  currentTime: null,
  timerReference: null,
  displayTarget: $("#timeDisplay"),

  /*
  initializes the current time
  */
  initialize(){
    // 1) set the current time
    this.currentTime = moment();

    // 2) update the view
    this.display();

    // 3) keep the timer running every
    timerReference = setInterval(function(){
      this.currentTime = moment();
      this.display();
      // call the update function if seconds == 00;
      // console.log(this.currentTime.seconds()); // debugging
      if ((this.currentTime.seconds() % 6) === 0){
        // update;
        // test();
        console.info("updating ...");
        updateTrainTimes();
      };
    }.bind(this), 1000);
  },

  display(){
    let time = this.currentTime.format('HH:mm:ss'); // time is a string 'hh:mm:ss a'
    this.displayTarget.html(time);
  }
}

time.initialize();
// console.log(time.currentTime);
