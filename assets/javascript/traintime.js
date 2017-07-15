$(document).ready(function(){
	//initialize firebase
var config = {
    apiKey: "AIzaSyDzakRv6ahMniKD15jq-CAU7t0mJjeEotw",
    authDomain: "train-time-18632.firebaseapp.com",
    databaseURL: "https://train-time-18632.firebaseio.com",
    projectId: "train-time-18632",
    storageBucket: "",
    messagingSenderId: "180027135988"
  };
  firebase.initializeApp(config);

//create variable for firebase database
var database = firebase.database();

//button click function
$("#submit").on("click", function() {

//create variables to capture input
	var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();

//move inputs to firebase
	database.ref().push({
		name: name,
		dest: dest,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	//do not refresh page
	$("input").val('');
    return false;
});

//function to prepend trains
database.ref().on("child_added", function(childSnapshot){
	//make sure it works
	console.log(childSnapshot.val());

	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + dest);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);
	console.log(moment().format("HH:mm"));

//change train time from string to a number
	var freq = parseInt(freq);
	//CURRENT TIME
	var currentTime = moment().format('LLLL');
	console.log("CURRENT TIME: " + moment().format('HH:mm'));
	//FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
	// var dConverted = moment(time,'hh:mm').subtract(1, 'years');
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	//math
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	//remainder
	var tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	//minutes until the next train
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	//next train arrival
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
	

 //update information in table 
$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
    // update html with children
    $("#nameDisplay").html(snapshot.val().name);
    $("#destDisplay").html(snapshot.val().dest);
    $("#timeDisplay").html(snapshot.val().time);
    $("#freqDisplay").html(snapshot.val().freq);
})

});