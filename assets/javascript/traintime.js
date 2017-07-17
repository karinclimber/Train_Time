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

	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

//change train time from string to a number
	var freq = parseInt(freq);
//current time
	var currentTime = moment().format('LLLL');

//current time, minus 1
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	
//train time
	var trainTime = moment(dConverted).format('HH:mm');
	
	//math
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	
	//remainder
	var tRemainder = tDifference % freq;
	
	//minutes until the next train
	var minsAway = freq - tRemainder;
	
	//next train arrival
	var nextTrain = moment().add(minsAway, 'minutes');
	
	
// $(".form-group").validate({
// 	rules: {
// 		nameInput: "required",
// 		destInput: "required",
// 		timeInput: {
// 			require: true,
// 			number: true
// 		},
// 		freqInput: {
// 			required: true,
// 			number: true
// 		}
// 	},
// 	messages: {
// 		nameInput: "Please enter a valid train name!",
// 		destInput: "Please enter a valid destination!",
// 		timeInput: "Please enter a valid time, HH:mm.",
// 		freqInput: "Please enter a valid number."
// }
// });


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

//remove train button click function
$('#removeTrain').on('click', trainTable, function(){
	//$("#trainTable").closest('tr').remove ();
	var table = document.getElementById("trainTable");
	table.deleteRow(table.rows.length-1);
});
	



});