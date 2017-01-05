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
    }.bind(this), 1000);
  },

  display(){
    let time = this.currentTime.format('hh:mm:ss a'); // time is a string
    this.displayTarget.html(time);
  }
}

time.initialize();
// console.log(time.currentTime);
