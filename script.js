function getScoresFromBoxes(scoreBoxes) {
    var scoresAll = [];
    for (let i = 0; i < scoreBoxes.length; i++) {
        var score = Number(scoreBoxes[i].value); // null values are converted to 0.
        scoresAll.push(score);
    }
    return scoresAll;
}

function autoFillScore(clickedElement) {
    var currentCorner = clickedElement.getAttribute("data-corner");
    var currentRound = clickedElement.getAttribute("data-round-number");
    var checkOtherCorner = (currentCorner == "red") ? "blue" : "red" // If you filled in a score for the red corner, check the score for the blue corner, vice-versa.
    var checkOtherCornerScore = document.querySelector(`.round-score-box[data-corner='${checkOtherCorner}'][data-round-number='${currentRound}']`);
    console.log(currentCorner,currentRound,checkOtherCorner,checkOtherCornerScore);
    if (checkOtherCornerScore.value == "")  {
        checkOtherCornerScore.value = "9";
        if (messageDisplayed == false) {
            document.querySelector(".help-box").innerHTML = "For your convienence, if one corner is scored 10, the other corner is scored 9. You can still change the score."
            messageDisplayed = true;
        }
    }
}

function calculateScoreCard(clickedElement) {
    function Corner (color) {
        this.color = color.charAt(0).toUpperCase() + color.slice(1); // "this" refers to an object created by this constructor
        this.fighterName = document.querySelector(`.corner-name-${color}`).value
        this.scoreBoxesAll = null;
        this.scoresAll = [];
        this.totalScore = 0;
        Corner.prototype.calculateStats = function() {
            //console.log(this);
            this.scoreBoxesAll = document.querySelectorAll(`.round-score-box[data-corner='${color}']`);
            for (let i = 0; i < this.scoreBoxesAll.length; i++) {
                var score = Number(this.scoreBoxesAll[i].value); // null values are converted to 0.
                this.scoresAll.push(score);
                this.totalScore = this.totalScore + score;
            }
            //console.log(this);
        };
        this.calculateStats();
    }
    Corner.prototype.compareScores = function(otherCorner) {
        if ((this.totalScore == 0) && (otherCorner.totalScore == 0)) return console.log("No scores inputed");
        var isTheFightOver = ((this.scoresAll.indexOf(0) < 0) && (otherCorner.scoresAll.indexOf(0) < 0));
        var ahead = "White"; //((this.totalScore > otherCorner.totalScore) ? this.color : otherCorner.color);
        if (this.totalScore > otherCorner.totalScore) ahead = this.fighterName;
        else if (this.totalScore < otherCorner.totalScore) ahead = otherCorner.fighterName;
        else if (this.totalScore == otherCorner.totalScore) ahead = "draw";
        if (ahead == "draw") {
            var declare = ((isTheFightOver) ? "The fight is a draw! " : "The fight is even, ")
            document.querySelector(".result").innerHTML = declare + this.totalScore + " - " + otherCorner.totalScore;
        } else {
            var declare = ((isTheFightOver) ? "is the winner" : "is leading")
            document.querySelector(".result").innerHTML = ahead + " " + declare + ", " + this.totalScore + " - " + otherCorner.totalScore;
            console.log(ahead + " is leading.");
        }
    }
    if (clickedElement.value == "10") autoFillScore(clickedElement);
    var red = new Corner("red");
    var blue = new Corner("blue");
    console.log(red,blue)
    red.compareScores(blue);
}

function checkScoresFilled(clickedElement) {
    /* Prevents the user from skipping scoreboxes. The program assumes that if a
        KO happens, it happens the round after the last fill-in scorebox. This 
        function ensures that a KO is calculated in the right round. 
    */
   currentRound= parseInt(clickedElement.getAttribute("data-round-number"));
   checkCorner = clickedElement.getAttribute("data-corner");
   allCornerRounds = Array.prototype.slice.call(document.querySelectorAll(`.round-score-box[data-corner=${checkCorner}]`));
   checkRoundScores = []; // Get the scores for all rounds being checked.
   for (let i = 0; i < (currentRound -1); i++) {
        checkRoundScores.push(allCornerRounds[i].value);
   }
   emptyRound = checkRoundScores.indexOf();
   console.log(currentRound,checkCorner,checkRoundScores, emptyRound);
   if (currentRound == 1) return true; // There are no rounds to check.
   if (checkRoundScores.indexOf("") < 0) {
       return true 
   }
   alert("Please fill in the corner's previous score boxes before filling out this one");
   clickedElement.value = "";
   return false
}

function calculateKORoundCorner(color) { 
    /* If a KO happens, its assumed to be the round after the last round. Red and blue corner
        are compared in case one is filled out but the other is not. */
    var scoreBoxes = document.querySelectorAll(`.round-score-box[data-corner='${color}']`);
    console.log(scoreBoxes);
    scoresAll = getScoresFromBoxes(scoreBoxes);
    console.log(scoresAll);
    return scoresAll.indexOf(0) + 1; // +1 to accomodate index number

}

function calculateKORound() {
    return Math.max(calculateKORoundCorner("red"),calculateKORoundCorner("blue"));
}

function checkScoreRange(clickedElement) {
    /* This checks and ensures that the scorecard is between 0 and 10 */
    var messages = {
        tooHigh: "The score you plugged in is too high. Changing the score to 10, which is the most points per round.",
        tooLow: "The score you plugged in is too low (below 0). Changing the score to 9. You can reenter as long as its above 0"
    }
    var checkNumber = Number(clickedElement.value);
    var helpBox = document.querySelector(".help-box");
    if (checkNumber > 10) {
        clickedElement.value = "10";
        helpBox.innerHTML = messages.tooHigh;
    } else if (checkNumber < 0) {
        clickedElement.value = "9";
        helpBox.innerHTML = messages.tooLow;
    }
    
}

function initialFighterName(color) {
    var labelTarget = document.querySelector(`label[data-corner='${color}']`);
    var inputTarget = document.querySelector(`[name='ko-winner'][data-corner='${color}']`);
    var fighterName = document.querySelector(`.corner-name-${color}`).value;
    if (fighterName == "") {
        fighter.value = color.charAt(0).toUpperCase() + color.slice(1);
        document.querySelector(".help-box").innerHTML = "You cannot leave the fighter's name blank. Resetting the name to the fighter's corner color."
    }
    labelTarget.innerHTML = fighterName;
    inputTarget.value = fighterName;
}

function updateFighterName(fighter) {
      var color = fighter.getAttribute("data-corner");
      var labelTarget = document.querySelector(`label[data-corner='${color}']`);
      var inputTarget = document.querySelector(`[name='ko-winner'][data-corner='${color}']`);
      if (fighter.value == "") {
          fighter.value = color.charAt(0).toUpperCase() + color.slice(1);
          document.querySelector(".help-box").innerHTML = "You cannot leave the fighter's name blank. Resetting the name to the fighter's corner color."
      }
      labelTarget.innerHTML = fighter.value;
      inputTarget.value = fighter.value;

    }


function addScoreEvent() {
    var allRounds = document.querySelectorAll('[class^="round-score-box"]');
    allRounds.forEach(
        function(scoreBox) {
              scoreBox.addEventListener('change', (event) => {
                console.log(event.target);
                if (checkScoresFilled(event.target)) {
                    checkScoreRange(event.target);
                    calculateScoreCard(event.target);
                }
              });
        }
      );
}

function addInputEvents() {
    var modalKo = document.querySelector(".modal-ko");
    var koButton = document.querySelector(".ko-button");
    var koUpdateResult = document.querySelector(".fight-result");
    var fighterNames = document.querySelectorAll("[class^='corner-name']");
        koButton.addEventListener('click',function() {
            if (window.getComputedStyle(modalKo).display == "none") {
                modalKo.style.display = "block";
                window.scrollTo(0,document.body.scrollHeight);
            }
        });

    var koCloseButton = document.querySelector(".close");
    koCloseButton.addEventListener('click', function() {
        if (window.getComputedStyle(modalKo).display == "block") modalKo.style.display = "none";
    });
    koUpdateResult.addEventListener('click', function() {
        errorRadioButton = document.querySelector('.error-radio-button');
        var radioButtonsChecked = (!!document.querySelector("input[name='ko-winner']:checked") && !!document.querySelector("input[name='ko-type']:checked"));
        if (radioButtonsChecked) {
            if (window.getComputedStyle(errorRadioButton).display == "block") errorRadioButton.style.display = "none";
            var winner = document.querySelector('input[name="ko-winner"]:checked').value;
            var koType = document.querySelector('input[name="ko-type"]:checked').value;
            var result = document.querySelector(".result");
            result.innerHTML = `${winner} won, ${koType}${calculateKORound()}`;
        } else {
            errorRadioButton.style.display = "block";
        }
    });
    fighterNames.forEach( // Adjusts the name in "Who won by KO?"
        function(fighter) {
              fighter.addEventListener('change', (event) => {
                updateFighterName(fighter);
              });
        }
      );
}

window.onload = function() {
    
    initialFighterName("red");
    initialFighterName("blue");
    addScoreEvent();
    addInputEvents();
}