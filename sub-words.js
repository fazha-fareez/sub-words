function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
var vowels = ["a", "e", "i", "o", "u"];
var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
var length;
var outputString;
var score;
var x;
var allInput =[0];
 

function startGame(){

	$("#quitButton").removeClass("hidden");
	$("#resetButton").removeClass("hidden");
	$("#startButton").addClass("hidden");
	$("#instruction").addClass("hidden");
	$("#playing").removeClass("hidden");

	score = 0;
	length = randomInteger(4,6);
	document.getElementById("outputString").innerHTML = " ";
	var randStart = randomInteger(0,1);
	// Initialize outputString with a random character
	if (randStart == 0) {
		var randVow = randomInteger(0, vowels.length - 1);
		outputString = vowels[randVow];
	}
	else {
		var randCon = randomInteger(0, consonants.length - 1);
		outputString = consonants[randCon]; 
	}
	for (var i=0; i < length - 1; i++) {
		var randVow = randomInteger(0, vowels.length - 1);
		outputString += vowels[randVow];
	//	document.getElementById("outputString").innerHTML += vowels[randVow];
		var randCon = randomInteger(0, consonants.length - 1);
		outputString += consonants[randCon];
	//	document.getElementById("outputString").innerHTML += consonants[randCon];
	}
	document.getElementById("outputString").innerHTML = outputString;

	// Sets the Timer
	var addedTime = 1;
	var currentTime = Date.parse(new Date());
	var timeLimit = new Date(currentTime + addedTime*60*1000);
	x = setInterval(function() {
		var now = new Date().getTime();
		var timeDifference = timeLimit - now + 1;
		var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
		document.getElementById("timer").innerHTML = seconds + "s";
		if (timeDifference < 0) {
			clearInterval(x);
			document.getElementById("timer").innerHTML = "TIME UP";
			document.getElementById("result").innerHTML = "Score: " + score;
		}
	}, 1000)
}

function checkExistingWord (str, arr) {
	for(var i=0; i < arr.length; i++) {
		if (str == arr[i]) {
			return true;
		}
	}
	return false;
}

function count_char(str, strLen){
	var arr = [0];
	for(var i=1; i < 26; i++) {
		arr.push(0);
	}
	for(var i=0; i < strLen; i++) {
		arr[str.charCodeAt(i) - 97] += 1;
	}
	return arr;
}

/*function displayInput(input) {
	var inputList = '<div>' + input + '</div>';
	document.getElementById("inputText").innerHTML += inputList;
} */

function checkInput() {
	var input = document.game.inputStr.value;
	var inputLen = input.length;
//	document.getElementById("inputText").innerHTML = "";
	if (inputLen > (length * 2)) {
		$("#invalid").removeClass("hidden");
	}
	else if(checkExistingWord(input, allInput) === false){
		var outputStr_arr = count_char(outputString, (length*2));
		var input_arr = count_char(input, inputLen);
		match = true;
		for(var i=0; i < 26; i++){
			if (input_arr[i] > outputStr_arr[i]) {
				match = false;
				break;
			}
		}
		if (match == true) {
			$.getJSON("https://api.pearson.com/v2/dictionaries/lasde/entries?headword=" + input + "&apikey=XHGACCNFuBLwBqsZcjZb7bafw9Vhklfa", function(data) {
				if (data.count > 0){
					$("#invalid").addClass("hidden");
					score += 1;
					allInput.push(input);
					var inputList = '<span style="margin-right: 20px;">' + input + '</span>';
					document.getElementById("inputText").innerHTML += inputList;
				}
				else {
					$("#invalid").removeClass("hidden");
				}
			})
		//	displayInput(input);
		}
		else {
			$("#invalid").removeClass("hidden");
		}
	}
} 

function enterInput(e, n) {
	if ((e.keyCode == 13) || (n==1) ) {
		e.preventDefault();
		checkInput();
		document.getElementById('inputStr').value='';
		document.getElementById('inputStr').focus();
	}

}

function quitGame() {
	$("#quitButton").addClass("hidden");
	clearInterval(x);
	document.getElementById("result").innerHTML = "Score: " + score;
	document.getElementById("inputStr").disabled = true;
	$("#enterButton").addClass("disable");
}

function resetGame() {
	$("#quitButton").addClass("hidden");
	$("#startButton").removeClass("hidden");
	clearInterval(x);
	window.location.reload();
}
