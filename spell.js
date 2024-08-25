var testArray = null;
var currentWordNumber = 1;
var currentWord = null;
var numCorrect = 0;
var numIncorrect = 0;
var badHistory = null;

// Shuffle function to randomize array elements
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Function to speak the word
function speakWord(msg) {
    if (msg == null) return;
    var speech = new SpeechSynthesisUtterance(msg);
    speech.lang = 'en-GB';
    var voices = window.speechSynthesis.getVoices();
    speech.default = false;
    speech.voice = voices.filter(function(voice) {
        return voice.name == 'Google UK English Male';
    })[0];
    window.speechSynthesis.speak(speech);
}

function getMaxWords(array) {
    if (array == null || array.length == 0) return 0;
    var max = array.length - 1;
    if (max > 50) max = 50;
    return max;
}

function updateProgress() {
    if (testArray == null) return;
    var max = getMaxWords(testArray);
    if (currentWordNumber > 0 && currentWordNumber <= max) {
        document.getElementById("numCurrent").innerHTML = currentWordNumber;
    }
    document.getElementById("numTotal").innerHTML = max;
    document.getElementById("numCorrect").innerHTML = numCorrect;
    document.getElementById("numIncorrect").innerHTML = numIncorrect;
    document.getElementById("spellText").value = "";
    document.getElementById("spellText").focus();
}

function startTest() {
    fetch('https://pastebin.com/raw/MzG3K2Mu') // URL de tu archivo raw en Pastebin
        .then(response => response.text())
        .then(data => {
            testArray = shuffle(data.split("\n").map(word => word.trim()).filter(word => word.length > 0));
            if (testArray == null) {
                alert("Unexpected level!");
                return;
            }
            badHistory = [];
            var max = getMaxWords(testArray);
            document.getElementById("currentLevel").innerHTML = "Custom";
            document.getElementById("totalWords").innerHTML = max;

            document.getElementById("levelSelect").className = "hide";
            document.getElementById("testArea").className = "show";
            document.getElementById("txtEntryArea").className = "show";
            document.getElementById("spellText").focus();

            runTest();
        });
}

function runTest() {
    if (testArray == null) {
        alert("Bad test");
        return;
    }
    var max = getMaxWords(testArray);
    if (currentWordNumber < 1 || currentWordNumber > max + 1) {
        return;
    }
    updateProgress();
    if (currentWordNumber == max + 1) {
        document.getElementById("txtEntryArea").className = "hide";
        return;
    }
    currentWord = testArray[currentWordNumber - 1];
    speakWord(currentWord);
}

function errorReport() {
    if (badHistory == null) return;
    var hist = document.getElementById("historyReport");
    var rpt = "<table border=1><tr><td>Word</td><td>You Typed</td></tr></tr>";
    for (var i = 0; i < badHistory.length; i = i + 2) {
        rpt += "<tr><td>" + badHistory[i] + "</td><td>" + badHistory[i + 1] + "</td></tr>";
    }
    rpt += "</td>";
    hist.innerHTML = rpt;
    hist.className = "show";
}

function checkSpell(e, text) {
    var key = e.keyCode || e.which;
    if (key == 13) { // Enter key
        if (text != "" && text != null) {
            text = text.trim();
            if (text == currentWord) {
                numCorrect++;
            } else {
                numIncorrect++;
                badHistory.push(currentWord);
                badHistory.push(text);
                errorReport();
            }
            currentWordNumber++;
            runTest();
        }
    }
}

function startOver() {
    document.getElementById("levelSelect").className = "show";
    document.getElementById("testArea").className = "hide";
    document.getElementById("historyReport").className = "hide";
    currentWordNumber = 1;
    currentWord = null;
    numCorrect = 0;
    numIncorrect = 0;
    testArray = null;
    document.getElementById("spellText").value = "";
}

function getCheckedValue(name) {
    var x = document.getElementsByName(name);
    var i;
    for (i = 0; i < x.length; i++) {
        if (x[i].checked == true) {
            return x[i].value;
        }
    }
    return "";
}
