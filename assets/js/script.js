async function start() {

  // SETUP
  let secret = await getRandomWord()
  let secretArr = secret.split("")
  let streakEl = document.querySelector('#streak');
  let winstreak;
  // console.log answer.. remove after development
  console.log(secretArr.join(""));
  let guesses = []
  let imageIndex = 0;
  let blankArr = []
  for (let i = 0; i < secretArr.length; i++) {
    blankArr[i] = "_"
  }

  // win streak init
  if (localStorage.getItem("streak") === null) {
    winstreak = 0;
    localStorage.setItem('streak', winstreak);
    streakEl.innerHTML = "Win Streak: 0";
  } else {
    winstreak = localStorage.getItem('streak');
    streakEl.innerHTML = "Win Streak: " + localStorage.getItem('streak');
  }
  // PLAY GAME
  let playfield = document.querySelector("#playfield")
  let end = document.querySelector("#end")
  playfield.innerHTML = blankArr.join(" ");

  let letterElem = document.querySelector("#letter")
  letterElem.addEventListener('keydown', (event) => {
    if (event.key == "Enter") {
      if (secretArr.includes(letterElem.value)) {
        if (guesses.includes(letterElem.value)) {
          console.log("Already guessed!");
        } else {
          // CORRECT WORD
          guesses.push(letterElem.value);
          let guessEl = document.querySelector("#guess")
          guessEl.innerHTML = "Guesses: " + guesses.join(", ");
          // correct audio
          var correctmp3 = new Audio('./assets/audio/correct.mp3');
          correctmp3.play();
        }
        for (let i = 0; i < secretArr.length; i++) {
          if (secretArr[i] == letterElem.value) {
            blankArr[i] = secretArr[i]
          }
        }
        // win
        if (blankArr.join("") == secretArr.join("")) {
          // hide elements 
          document.getElementById('left').style.display = 'none';
          document.getElementById('hangman_img').style.display = 'none';
          document.getElementById('letter').style.display = 'none';
          document.getElementById('guess').style.display = 'none';
          // show text
          end.innerHTML = "😍 Congratulations, you won!";
          winstreak = +winstreak + +1;
          localStorage.setItem('streak', winstreak)
          streakEl.innerHTML = "Win Streak: " + localStorage.getItem('streak');
          // play agin text show, replace display none with INLINE (to keep centered) block
          document.getElementById('again').style.display = 'inline-block';

        }

        let playfield = document.querySelector("#playfield")
        playfield.innerHTML = blankArr.join(" ");
      }

      // WRONG WORD
      else {
        // already guessed wrong letter
        if (guesses.includes(letterElem.value)) {
          console.log("already guessed");
        } else { // new wrong letter
          imageIndex++
          // add new letter guess
          guesses.push(letterElem.value);
          let guessEl = document.querySelector("#guess")
          guessEl.innerHTML = "Guesses: " + guesses.join(", ");
          // update image
          let hangmanImageElem = document.querySelector("#hangman_img");
          hangmanImageElem.src = "assets/images/hangman" + imageIndex + ".png";
          // guesses left
          let guessesLeft = document.querySelector("#left");
          guessesLeft.innerHTML = "Guesses left: " + (7 - imageIndex);
          // play wrong audio
          var wrongmp3 = new Audio('./assets/audio/wrong.mp3');
          wrongmp3.play();
        }
      }
      // remove value after guessed
      letterElem.value = "";
    }
    // Loose if statement, if imageIndex is >= to 7. 
    if (imageIndex >= 7) {
      // hide elements 
      document.getElementById('left').style.display = 'none';
      document.getElementById('hangman_img').style.display = 'none';
      document.getElementById('letter').style.display = 'none';
      document.getElementById('guess').style.display = 'none';
      // show text
      end.innerHTML = "😪 You lost! The word was.. " + secret;
      localStorage.removeItem('streak');
      streakEl.innerHTML = "Win Streak: 0";
      // play agin text show, replace display none with INLINE (to keep centered) block
      document.getElementById('again').style.display = 'inline-block';
    }

  })
}
// fetch a random word
async function getRandomWord() {
  const wordsGit = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt")
  const wordsTxt = await wordsGit.text()
  const wordsList = wordsTxt.split("\n")

  let filteredWords = []
  for (let i = 0; i < wordsList.length; i++) {
    let word = wordsList[i]
    // only push words that are are between 5-8 letters
    if (word.length >= 5 && word.length <= 8) {
      filteredWords.push(word)
    }
  }
  // return it
  const randomNum = Math.floor(Math.random() * filteredWords.length)
  const randomWord = filteredWords[randomNum]
  return randomWord
}
// call start function 
start()

// refresh page, 'play again'
function refresh() {
  location.reload();
}

// Get current year 
document.getElementById("yr").innerHTML = (new Date().getFullYear());