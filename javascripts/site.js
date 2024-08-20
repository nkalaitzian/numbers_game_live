// This is where it all goes :)

window.onload = function(){
  init();
};

titleParagraph = null;
rngText = null;
spotButtons = [];
maxValueFilled = '-1';
minValueFilled = '1001';
score = 0;

function init() {
  rngText = document.getElementById('rngText');
  titleParagraph = document.getElementById('titleParagraph');
  titleParagraph.innerHTML = 'Numbers Game';
  spotButtons = Array.prototype.slice.call(document.getElementsByClassName('spotButton'));
  spotButtons.forEach((spotButton) => {
    spotButton.addEventListener("click", (sB) => assignNumber(sB));
  });
  toggleSpotButtons(false);
  document.getElementById('newGameButton').addEventListener('click', newGame);
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
  eligibleButtons = spotButtons;
  // if (minValueFilled == '1001' && maxValueFilled == '-1') {
  //   eligibleButtons = spotButtons;
  // } else {
  //   for (let i = 0; i < spotButtons.length; i++) {
  //     currentButton = spotButtons[i];
  //     currentText = buttonSpotText(currentButton);
  //     previousButton = spotButtons[i-1];
  //     previousText = buttonSpotText(previousButton);
  //     if (currentText != '') {
  //       if (rngValue < minValueFilled) {
  //         eligibleButtons.push(currentButton);
  //       } else if (rngValue > minValueFilled && rngValue < maxValueFilled) {
  //         eligibleButtons.push(currentButton);
  //       } else if (rngValue > maxValueFilled) {
  //         eligibleButtons.push(currentButton);
  //       }
  //     }
  //   }
  // }

  // if (eligibleButtons.length == 0) {
  //   titleParagraph.innerHTML = 'You lost :(';
  //   toggleSpotButtons(false);
  //   return;
  // }
  eligibleButtons.forEach((spotButton) => { enableSpotButton(spotButton) });
}

function buttonSpotText(spotButton) {
  if (spotButton == null) {
    return '';
  }
  targetTextId = spotButton.dataset['textTarget'];
  textTarget = document.getElementById(targetTextId);
  return textTarget.innerHTML;
}

function enableSpotButton(spotButton) {
  targetTextId = spotButton.dataset['textTarget'];
  textTarget = document.getElementById(targetTextId);
  if (textTarget.innerHTML == '') {
    spotButton.disabled = false;
  }
}

function disableSpotButton(spotButton) {
  spotButton.disabled = true;
}

function generateRng() {
  rngValue = Math.floor(Math.random() * 1000) + 1;
  rngText.innerHTML = rngValue;
  enableSpotButtons(rngValue);
}

function assignNumber(spotButton) {
  targetTextId = spotButton.target.dataset['textTarget'];
  textTarget = document.getElementById(targetTextId);
  textTarget.innerHTML = rngText.innerHTML;
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
  scoreLabel = document.getElementById('scoreLabel');
  scoreLabel.innerHTML = 'Score <strong>' + score + '</strong>/20';
}

function newGame() {
  toggleSpotButtons(false);
  spotButtons.forEach((spotButton) => {
    spotButton.classList.remove('hidden');
    targetTextId = spotButton.dataset['textTarget'];
    textTarget = document.getElementById(targetTextId);
    textTarget.innerHTML = '';
  });
  rngText.innerHTML = '';
  maxValueFilled = '-1';
  minValueFilled = '1001';
  titleParagraph.innerHTML = 'Numbers Game';
  generateRng();
  updateScore(0);
}
