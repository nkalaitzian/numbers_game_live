// This is where it all goes :)

window.onload = function () {
  init();
};

let titleParagraph = null;
let rngText = null;
let rngLabel = null;
let spotButtons = [];
let maxValueFilled = "-1";
let minValueFilled = "1001";
let assignedNumbers = [];
let score = 0;
let lost = false;
let darkModeButton = null;

function init() {
  rngText = document.getElementById("rngText");
  rngLabel = document.getElementById("rngLabel");
  titleParagraph = document.getElementById("titleParagraph");
  darkModeButton = document.getElementById('darkModeToggleButton');
  darkModeButton.addEventListener('click', darkModeToggle);
  titleParagraph.innerHTML = "Numbers Game";
  spotButtons = Array.prototype.slice.call(
    document.getElementsByClassName("spotButton"),
  );
  spotButtons.forEach((spotButton) => {
    spotButton.addEventListener("click", (sB) => assignNumber(sB));
  });
  toggleSpotButtons(false);
  document.getElementById("newGameButton").addEventListener("click", newGame);
}

function toggleSpotButtons(toggleState) {
  spotButtons.forEach((spotButton) => {
    if (toggleState) {
      enableSpotButton(spotButton);
    } else {
      disableSpotButton(spotButton);
    }
  });
}

function enableSpotButtons(rngValue) {
  eligibleButtons = [];
  if (minValueFilled == '1001' && maxValueFilled == '-1') {
    eligibleButtons = spotButtons;
  } else {
    indexSmallerThanRng = 0;
    indexBiggerThanRng = 0;
    for (let i = 0; i < spotButtons.length; i++) {
      currentButton = spotButtons[i];
      currentText = buttonSpotText(currentButton);
      if (currentText != '') {
        currentCellNumber = parseInt(currentText);
        if (rngValue < currentCellNumber && indexSmallerThanRng == 0) {
          indexSmallerThanRng = i;
        } else if (rngValue > currentCellNumber) {
          indexBiggerThanRng = i;
        }
      }
    }
    if (indexSmallerThanRng == 0) {
      indexSmallerThanRng = 20;
    }
    console.log(`Smaller than index: ${indexSmallerThanRng}`);
    console.log(`Bigger than index: ${indexBiggerThanRng}`);
    for (let y = indexBiggerThanRng; y < indexSmallerThanRng; y++) {
      currentButton = spotButtons[y];
      if (!Array.prototype.slice.call(currentButton.classList).includes('hidden')) {
        eligibleButtons.push(currentButton);
      }
    }
  }

  if (eligibleButtons.length == 0) {
    lost = true;
    toggleSpotButtons(false);
    return;
  }
  eligibleButtons.forEach((spotButton) => {
    enableSpotButton(spotButton);
  });
}

function buttonSpotText(spotButton) {
  if (spotButton == null) {
    return "";
  }
  targetTextId = spotButton.dataset["textTarget"];
  textTarget = document.getElementById(targetTextId);
  return textTarget.innerHTML;
}

function enableSpotButton(spotButton) {
  targetTextId = spotButton.dataset["textTarget"];
  textTarget = document.getElementById(targetTextId);
  if (textTarget.innerHTML == "") {
    spotButton.disabled = false;
  }
}

function disableSpotButton(spotButton) {
  spotButton.disabled = true;
}

function rng() {
  newRng = Math.floor(Math.random() * 1000) + 1;
  while (assignedNumbers.includes(newRng)) {
    newRng = Math.floor(Math.random() * 1000) + 1;
  }
  return newRng;
}

function generateRng() {
  rngValue = rng();
  rngText.innerHTML = rngValue;
  enableSpotButtons(rngValue);
}

function assignNumber(spotButton) {
  targetTextId = spotButton.target.dataset["textTarget"];
  textTarget = document.getElementById(targetTextId);
  textTarget.innerHTML = rngText.innerHTML;
  assignedNumbers.push(parseInt(rngText.innerHTML));
  toggleSpotButtons(false);
  spotButton.target.classList.add("hidden");
  if (rngText.innerHTML > maxValueFilled) {
    maxValueFilled = rngText.innerHTML;
  }
  if (rngText.innerHTML < minValueFilled) {
    minValueFilled = rngText.innerHTML;
  }
  generateRng();
  updateScore(score + 1);
}

function updateScore(newScore) {
  score = newScore;
  scoreLabel = document.getElementById("scoreLabel");
  scoreLabel.innerHTML = "Score <strong>" + score + "</strong>/20";
  if (lost) {
    rngLabel.innerHTML = "<strong>No available moves.</br>You lost :(</strong>";
  } else if (score == 5) {
    rngLabel.innerHTML = "<strong>Keep at it!</strong";
  } else if (score == 10) {
    rngLabel.innerHTML = "<strong>Halfway point!</strong";
  } else if (score == 15) {
    rngLabel.innerHTML = "<strong>You're almost there!</strong";
  } else if (score == 20) {
    rngLabel.innerHTML = "<strong>You Won! Here's a star: ⭐</strong";
  } else {
    rngLabel.innerHTML = "";
  }
}

function darkModeToggle() {
  var element = document.body;
  element.classList.toggle("dark-mode");
  if (Array.prototype.slice.call(element.classList).includes('dark-mode')) {
    darkModeButton.innerHTML = 'Light Mode';
  } else {
    darkModeButton.innerHTML = 'Dark Mode';
  }
}

function newGame() {
  toggleSpotButtons(false);
  spotButtons.forEach((spotButton) => {
    spotButton.classList.remove("hidden");
    targetTextId = spotButton.dataset["textTarget"];
    textTarget = document.getElementById(targetTextId);
    textTarget.innerHTML = "";
  });
  rngText.innerHTML = "";
  maxValueFilled = "-1";
  minValueFilled = "1001";
  titleParagraph.innerHTML = "Numbers Game";
  assignedNumbers = [];
  lost = false;
  generateRng();
  updateScore(0);
}
