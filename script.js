// this test object is the also the data model for the database
// var testObject = {
//   trainName: "Test Train",
//   destinationCity: "Springfield, PA",
//   firstDeparture: "06:25",
//   intervalMinutes: 22
// };

// init firebase
var config = {
  apiKey: "AIzaSyAwmdFmHNF1NBYYWr1GxKDeN9PMIQQQk3U",
  authDomain: "train-data-1712d.firebaseapp.com",
  databaseURL: "https://train-data-1712d.firebaseio.com",
  projectId: "train-data-1712d",
  storageBucket: "train-data-1712d.appspot.com",
  messagingSenderId: "487116484005"
};
firebase.initializeApp(config);

var database = firebase.database();

// click handler
$("#submitButton").on("click", function(event) {
  // pls dont refresh pls
  event.preventDefault();
  // clear any remaining input validation
  $("#nameFeedback").text("");
  $("#destCityFeedback").text("");
  $("#departFeedback").text("");
  $("#intervalFeedback").text("");
  // establish variables for usr entered data

  var usrTrainName = $("#trainName")
    .val()
    .trim();
  var usrDestinationCity = $("#destinationCity")
    .val()
    .trim();
  var usrFirstDeparture = $("#firstDeparture")
    .val()
    .trim();
  var usrIntervalMinutes = $("#intervalMinutes")
    .val()
    .trim();
  // create an object to send to the database
  var trainObject = {
    trainName: usrTrainName,
    destinationCity: usrDestinationCity,
    firstDeparture: usrFirstDeparture,
    intervalMinutes: usrIntervalMinutes
  };
  // create flags for input validation
  var nameFlag = usrTrainName !== "" ? true : false;
  var destFlag = usrDestinationCity !== "" ? true : false;
  var departFlag = usrFirstDeparture !== "" ? true : false;
  var intervalFlag =
    isNaN(parseInt(usrIntervalMinutes)) === true ? false : true;
  // input validation

  if (nameFlag && destFlag && departFlag && intervalFlag) {
    // make it so: (push data to database)
    database.ref().push(trainObject);
  } else {
    if (nameFlag === false) {
      $("#nameFeedback").text("Please enter a valid name");
    }
    if (destFlag === false) {
      $("#destCityFeedback").text("Please enter a valid destination");
    }
    if (departFlag === false) {
      $("#departFeedback").text("Please enter a valid departure time");
    }
    if (intervalFlag === false) {
      $("#intervalFeedback").text("Please enter a valid number");
    }
  }
});

// database update listener:
database.ref().on("child_added", function(snapshot) {
  var displayTrainName = snapshot.val().trainName;
  var displayDestinationCity = snapshot.val().destinationCity;
  // first train of the day, minus a year so we can work with positive numbers
  var convertedFirstDeparture = moment(
    snapshot.val().firstDeparture,
    "HH:mm"
  ).subtract(1, "years");
  var displayIntervalMinutes = snapshot.val().intervalMinutes;
  var diffTime = moment().diff(moment(convertedFirstDeparture), "minutes");
  var tRemainder = diffTime % displayIntervalMinutes;
  var tMinutesTillTrain = displayIntervalMinutes - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  var newTableRow = $("<tr>");
  newTableRow.append("<td>" + displayTrainName + "</td>");
  newTableRow.append("<td>" + displayDestinationCity + "</td>");
  newTableRow.append("<td>" + displayIntervalMinutes + "</td>");
  newTableRow.append("<td>" + moment(nextTrain).format("hh:mm A") + "</td>");
  newTableRow.append("<td>" + tMinutesTillTrain + "</td>");
  $("#trainTableBody").append(newTableRow);
});
