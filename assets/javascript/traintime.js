$(document).ready(function() {
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
	database.ref().on("child_added", function(childSnapshot) {
		var newName = childSnapshot.val().name;
		var newDest = childSnapshot.val().dest;
		var newTime = childSnapshot.val().time;
		var newFreq = childSnapshot.val().freq;
		var currentTime = moment();
		console.log(moment(currentTime).format("LT"));
		var firstTimeConverted = moment(newTime, "LT").subtract(1, "days");
		// Get the difference between now and the time of the first train
		// by subtracting the current time from the first train time
		timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("Difference in time: " + timeDiff);
		// Time apart
		var remainder = timeDiff % newFreq;
		console.log("Remainder: ", remainder);
		// Minutes until the next train calculated by subtracting the the remainder from the frequency
		var minsUntilTrain = newFreq - remainder;
		console.log("Time Til Train: " + minsUntilTrain);
		// Calculate next train time by adding the current time to the minsUntilTrain
		var nextTrainTime = moment().add(minsUntilTrain, "minutes");
		console.log("Next arrival: " + moment(nextTrainTime).format("LT"));
		// $("#addTrain").validate({
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
		$('#trainTable').append("<tr><td id='nameDisplay'>" + childSnapshot.val().name + "</td><td id='destDisplay'>" + childSnapshot.val().dest + "</td><td id='freqDisplay'>" + childSnapshot.val().freq + "</td><td id='nextDisplay'>" + moment(nextTrainTime).format("LT") + "</td><td id='awayDisplay'>" + minsUntilTrain + ' minutes until arrival' + "</td></tr>");
	}, function(errorObject) {
		console.log("Read failed: " + errorObject.code)
	});
	// database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
	//     // update html with children
	//     $("#nameDisplay").html(snapshot.val().name);
	//     $("#destDisplay").html(snapshot.val().dest);
	//     $("#timeDisplay").html(moment(nextTrain).format("HH:mm"));
	//     $("#freqDisplay").html(snapshot.val().freq);
	// })
	//remove train button click function
	$('#removeTrain').on('click', trainTable, function() {
		//$("#trainTable").closest('tr').remove ();
		var table = document.getElementById("trainTable");
		table.deleteRow(table.rows.length - 1);
	});
});