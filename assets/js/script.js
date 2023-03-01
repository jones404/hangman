// Win streak with localstorage

// async function, async because we need to get data from api
async function start() {

  // SETUP (define varibles, for entirety of code)
  let secret = await getRandomWord()
  let secretArr = secret.split("")
  let streakEl = document.querySelector('#streak');
  let hs = document.querySelector('#hs');
  let winstreak;
  // define guesses array
  let guesses = []
  // set to image one 
  let imageIndex = 0;
  // define blank array
  let blankArr = []
  // for loop.. place dashes for the amount of letters the secret is.
  for (let i = 0; i < secretArr.length; i++) {
    blankArr[i] = "_"
  }

  // highscore init \\

  // check our localstorage if high score is set
  if (localStorage.getItem("highscore") === null) {
    // set it
    localStorage.setItem('highscore', '0');
    // write our inital high score of 0
    hs.innerHTML = "High Score: 0";
  } else {
    // if has a highscore above 0 or null, then, get it, and set it
    winstreak = localStorage.getItem('highscore');
    // and write our highscore with innerHTML
    hs.innerHTML = "High Score: " + localStorage.getItem('highscore');
  }

  // win streak init \\

  // check out localstorage  if winstreak is set
  if (localStorage.getItem("streak") === null) {
    // set var to 0  
    winstreak = 0;
    // set inital streak to 0
    localStorage.setItem('streak', winstreak);
    // write our inital win streak of 0 
    streakEl.innerHTML = "Win Streak: 0";
  } else {
    // if has a winstreak above 0 or null, then, get it, and set it
    winstreak = localStorage.getItem('streak');
    // write the current winsreak with innerHTML
    streakEl.innerHTML = "Win Streak: " + localStorage.getItem('streak');
  }
  // PLAY GAME

  // define a few more vars 
  let playfield = document.querySelector("#playfield")
  let end = document.querySelector("#end")
  playfield.innerHTML = blankArr.join(" ");
  let letterElem = document.querySelector("#letter")

  // after the user puts in a value to the letter element, we add a event listener. we listen for a keydown 
  letterElem.addEventListener('keydown', (event) => {
    // if statement for the enter key
    if (event.key == "Enter") {
      // if it includes value from the secret array
      if (secretArr.includes(letterElem.value)) {
        // check our guesses. if it includes an already guessed vlaue, then..
        if (guesses.includes(letterElem.value)) {
          // show already guessed message in the console. with further production, we can maybe add a slick message that pops up
          console.log("Already guessed!");
          // else, meaning correct word
        } else {
          // CORRECT WORD

          // push the current letter to the guesses
          guesses.push(letterElem.value);
          // set var for our guesses list
          let guessEl = document.querySelector("#guess")
          // join each guess inside of var's using innerHTML
          guessEl.innerHTML = "Guesses: " + guesses.join(", ");
          // add a fun sound effect.. grab audio
          let correctmp3 = new Audio('./assets/audio/correct.mp3');
          // find the var.. then play it!
          correctmp3.play();
        }
        // for loop 0 -> the secret array's length, adding by +1
        for (let i = 0; i < secretArr.length; i++) {
          // if our secret array (number) is equal to the current letter then...
          if (secretArr[i] == letterElem.value) {
            // the blank array (number) is equal to the secret array (number)
            blankArr[i] = secretArr[i]
          }
        }
        // When .. user guesses all correctly, set WIN with if statement if then, both arrays are equal, (completed) then...
        if (blankArr.join("") == secretArr.join("")) {
          // grab elements by its id.. then set some css style to display none... (hiding it)
          document.getElementById('left').style.display = 'none';
          document.getElementById('hangman_img').style.display = 'none';
          document.getElementById('letter').style.display = 'none';
          document.getElementById('guess').style.display = 'none';
          // show text with innerHTML
          end.innerHTML = "😍 Congratulations, you won!";
          // add 1 to our win streak... to fix the error of 1+1 = 11... you have to define the vars as numbers ... put a + infront of it 
          winstreak = +winstreak + +1;
          // set the current winstreak...
          localStorage.setItem('streak', winstreak)
          // auto-update the text!, get the win streak we just set and output it with innerHTML
          streakEl.innerHTML = "Win Streak: " + localStorage.getItem('streak');
          // if current streak is higher than high score, set new value!
          if (localStorage.getItem('streak') > localStorage.getItem('highscore')) {
            // get our current winstreak.. set it as a var
            let currStreak = localStorage.getItem('streak');
            // then set that var as our highscore
            localStorage.setItem('highscore', currStreak);
            // output that high score with innerHTML.. (real time updating)
            hs.innerHTML = "High Score: " + localStorage.getItem('highscore');
          }
          // play agin text show, replace display none with INLINE (to keep centered) block
          document.getElementById('again').style.display = 'inline-block';

        }
        // join the blank array.. in our playfield 
        playfield.innerHTML = blankArr.join(" ");
      }

      // WRONG WORD
      else {
        // already guessed wrong letter
        if (guesses.includes(letterElem.value)) {
          console.log("Already guessed!");
        } else { // new wrong letter
          imageIndex++
          // add new letter guess
          guesses.push(letterElem.value);
          let guessEl = document.querySelector("#guess")
          guessEl.innerHTML = "Guesses: " + guesses.join(", ");
          // update our hangman image.. using the image index. updated the url, replacing the image. 
          let hangmanImageElem = document.querySelector("#hangman_img");
          hangmanImageElem.src = "assets/images/hangman" + imageIndex + ".png";
          // guesses left
          let guessesLeft = document.querySelector("#left");
          // find the guesses left by subtracting it by 7, by the image index.. 
          guessesLeft.innerHTML = "Guesses left: " + (7 - imageIndex);
          // play wrong audio
          // set the var
          let wrongmp3 = new Audio('./assets/audio/wrong.mp3');
          // play the var 
          wrongmp3.play();
        }
      }
      // remove value after guessed.. so the user doesn't have to manually delete it!
      letterElem.value = "";
    }
    // Loose if statement, if imageIndex is >= to 7. 
    if (imageIndex >= 7) {
      // hide elements, by finding the id, and then setting the css to display:none; ulimately hiding it
      document.getElementById('left').style.display = 'none';
      document.getElementById('hangman_img').style.display = 'none';
      document.getElementById('letter').style.display = 'none';
      document.getElementById('guess').style.display = 'none';
      // show text with the correct answer, saying you lost
      end.innerHTML = "😪 You lost! The word was.. " + secret;
      // if current streak is higher than high score, set new value!
      if (localStorage.getItem('streak') > localStorage.getItem('highscore')) {
        // set the current streak to a var
        let currStreak = localStorage.getItem('streak');
        // place it in the localstorage highscore
        localStorage.setItem('highscore', currStreak);
        // update the text, so its realtime updating
        hs.innerHTML = "High Score: " + localStorage.getItem('highscore');
      }
      // remove the localstorage of our current streak, because we lost
      localStorage.removeItem('streak');
      // update the streak text, setting it back to 0
      streakEl.innerHTML = "Win Streak: 0";
      // play agin text show, replace display none with INLINE (to keep centered) block
      document.getElementById('again').style.display = 'inline-block';
    }

  })
}
// fetch a random word... we waited with async, now we can call it
async function getRandomWord() {
  // fetch the random words
  const wordsGit = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt")
  // get it
  const wordsTxt = await wordsGit.text()
  // split each one with a line break.. \n is braking the line
  const wordsList = wordsTxt.split("\n")
  // set array
  let filteredWords = []
  // for loop.. 0 < than the wordslist length. add by +1
  for (let i = 0; i < wordsList.length; i++) {
    // grab a word!!!!
    let word = wordsList[i]
    // only push words that are are between 5-8 letters
    if (word.length >= 5 && word.length <= 8) {
      // push it!
      filteredWords.push(word)
    }
  }
  // return it
  // get a random number... 
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

// Get current year .. get the id, and then set the innerhtml.get a new, date, which is the full current year.
document.getElementById("yr").innerHTML = (new Date().getFullYear());