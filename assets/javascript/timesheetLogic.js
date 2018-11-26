var config = {
  apiKey: "AIzaSyConzXOadcm7NMVwJQEM4F3XL2X5cQvfO4",
  authDomain: "train-time-179d8.firebaseapp.com",
  databaseURL: "https://train-time-179d8.firebaseio.com",
  projectId: "train-time-179d8",
  storageBucket: "train-time-179d8.appspot.com",
  messagingSenderId: "486280849285"
};
firebase.initializeApp(config);

var database = firebase.database();

// function forceNumeric(){
//   var $input = $(this);
//   $input.val($input.val().replace(/[^\d]+/g,''));
// }
// $('#time-input').on('propertychange input', 'input[type="number"]', forceNumeric);

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  var timeInput = $("#time-input").val().trim()
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  //show time in military time, hours and minutes
  var trainTime = moment(timeInput, "HH:mm").format("HH:mm");
  var trainFreq = $("#frequency-input").val().trim();

  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    freq: trainFreq
  };

  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.freq);

  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
  //logging to see if there is error
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFreq = childSnapshot.val().freq;

  var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
  var tRemainder = diffTime % trainFreq;
  var tMinutesTillTrain = trainFreq - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainTime),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFreq),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
  );
  $("#train-table > tbody").append(newRow);

//show any errors in console
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

