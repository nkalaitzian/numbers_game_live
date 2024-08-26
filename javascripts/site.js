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

// Massively enable all assign buttons
function toggleSpotButtons(toggleState) {
  spotButtons.forEach((spotButton) => {
    if (toggleState) {
      enableSpotButton(spotButton);
    } else {
      disableSpotButton(spotButton);
    }
  });
}

// Check if the RNG is inside the bounds of the already assigned numbers
function canAssignRngValue(rngValue) {
  firstButtonText = buttonSpotText(spotButtons[0]);
  lastButtonText = buttonSpotText(spotButtons[19]);

  if (firstButtonText != '' && parseInt(firstButtonText) > rngValue) {
    return false;
  } else if (lastButtonText != '' && parseInt(lastButtonText) < rngValue) {
    return false;
  }
  return true;
}

// Check which buttons are eligible to be enabled
function enableSpotButtons(rngValue) {
  eligibleButtons = [];
  if (minValueFilled == '1001' && maxValueFilled == '-1') {
    eligibleButtons = spotButtons;
  } else if (!canAssignRngValue(rngValue)) {
    eligibleButtons = [];
  } else {
    startIndex = -1;
    endIndex = -1;
    for (let i = 0; i < spotButtons.length; i++) {
      currentButton = spotButtons[i];
      currentText = buttonSpotText(currentButton);
      if (currentText != '') {
        currentCellNumber = parseInt(currentText);
        if (rngValue < currentCellNumber) {
          endIndex = i-1;
          break;
        }
      }
    }
    for (let i = (spotButtons.length - 1); i > 0; i--) {
      currentButton = spotButtons[i];
      currentText = buttonSpotText(currentButton);
      if (currentText != '') {
        currentCellNumber = parseInt(currentText);
        if (rngValue > currentCellNumber) {
          console.log(`Compared rngValue: ${rngValue} with cell value: ${currentCellNumber}`);
          startIndex = i+1;
          break;
        }
      }
    }
    if (endIndex == -1) {
      endIndex = 20;
    }
    if (startIndex == -1) {
      startIndex = 0;
    }

    // console.log(`RngValue: ${rngValue}, startIndex: ${startIndex}, endIndex: ${endIndex}`);
    for (let y = startIndex; y <= endIndex; y++) {
      currentButton = spotButtons[y];
      if (currentButton != null && !Array.prototype.slice.call(currentButton.classList).includes('hidden')) {
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
  if (textTarget.innerHTML == '') {
    spotButton.disabled = false;
  }
}

function disableSpotButton(spotButton) {
  spotButton.disabled = true;
}

// Generate the RNG whilst checking that the generate number was not already generated.
function generateRng() {
  newRng = Math.floor(Math.random() * 1000) + 1;
  while (assignedNumbers.includes(newRng)) {
    newRng = Math.floor(Math.random() * 1000) + 1;
  }
  return newRng;
}

// Assign the RNG to the Label & enable the appropriate buttons
function generateAndAssignRng() {
  rngValue = generateRng();
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
  generateAndAssignRng();
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
  generateAndAssignRng();
  updateScore(0);
}
