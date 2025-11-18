class keyboard {
    constructor() {
        this.keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }

    getKeys(index) {
        return this.keys[index];
    }
}

// JSON file location, generated file with word and hint pairs
const fetch_file_location = "data/words.json";

async function getRandomHangmanWord() {
    return fetch(fetch_file_location)
        .then(function(response){
            if(response.ok){
                return response.json(); // Parse JSON
            } else {
                console.log("HTTP-Error: " + response.status);
            }
        })
        .then(function(data){
            // Access array
            const randomIndex = Math.floor(Math.random() * data.words.length);
            return data.words[randomIndex];
        })
        .catch(function(error){
            console.log(`Error: ${error}. Please try again.`);
        });
}

const keyboardDisplay = document.getElementById('keyboard');
keyboardDisplay.innerHTML = '';
const kb = new keyboard();

for (let i = 0; i < 26; i++) {
    let keyboardOut = '';
    const key = kb.getKeys(i);
    
    keyboardOut += `<button id="key-${key}"> ${key} </button>`;
    if (i === 12){
        keyboardOut += `<br>`;
    }

    keyboardDisplay.innerHTML += keyboardOut;
}

const wordDisplay = document.getElementById('word');
const hintDisplay = document.getElementById('hint');
const guessRemain = document.getElementById('guess-remain');
const $hangmanImage = $('#hangman');
const guessedLetters = [];
const maxWrongGuesses = 6;
const guessRemainTrigger = 3;
let wrongGuesses = 0;
let hangmanWord = '';
let hangmanHint = '';

getRandomHangmanWord().then(function(wordData) {
    hangmanWord = wordData.word;
    hangmanHint = wordData.hint;
    console.log(hangmanWord);
    console.log(hangmanHint);

    // Set up the word display with underscores
    let wordOut = '';
    for (let i = 0; i < hangmanWord.split("").length; i++) {
        console.log('adding underscore');
        wordOut += '_ ';
    }

    wordDisplay.textContent = wordOut.trim();
    hintDisplay.textContent = `Hint: ${hangmanHint}`;

    eventListenerSetup();
});

function eventListenerSetup() {
    keyboardDisplay.addEventListener('click', function(event) {
        
        const button = event.target;
        if (!button.matches('button')) {
            return;
        }

        const guessedLetter = button.textContent.trim();  
        const allButtons = keyboardDisplay.getElementsByTagName('button');  
        console.log(`You guessed: ${guessedLetter}`);
        
        console.log(hangmanWord.toUpperCase());
        if (!hangmanWord.toUpperCase().includes(guessedLetter)) {
            console.log('Incorrect guess.');
            wrongGuesses++;
            $hangmanImage.attr('src', `img/hangman-${wrongGuesses}.png`);
            if (maxWrongGuesses - wrongGuesses <= guessRemainTrigger) {
                guessRemain.textContent = `${maxWrongGuesses - wrongGuesses} GUESSES REMAINING!!!`;
                guessRemain.classList.add('is-visible');
            }

            if (wrongGuesses === maxWrongGuesses) {
                guessRemain.textContent = `YOU KILLED HIM!!!`;
                guessRemain.classList.add('is-visible');
                $hangmanImage.attr('src', `img/hangman-${wrongGuesses}.png`);
                // Disable all buttons
                for (let btn of allButtons) {
                    btn.disabled = true;
                    btn.classList.add("disabled-button");
                }
                setTimeout(() => {
                    alert(`Game Over! The word was: ${hangmanWord.toUpperCase()}\nPlay Again?`);
                    location.reload();
                }, 1500);
            }
        } else {
            console.log('Correct guess!');
        
            guessedLetters.push(guessedLetter);
            
            wordDisplay.innerHTML = '';
            for (let j = 0; j < hangmanWord.length; j++) {
                if (guessedLetters.includes(hangmanWord[j].toUpperCase())) {
                    wordDisplay.innerHTML += `${hangmanWord[j].toUpperCase()} `;
                } else {
                    wordDisplay.innerHTML += '_ ';
                }
            }
            
            // Remove all spaces global
            if (wordDisplay.textContent.replace(/ /g, '') === hangmanWord.toUpperCase()) {
                guessRemain.textContent = `YOU SAVED HIM!!!`;
                guessRemain.classList.add('is-visible');
                $hangmanImage.attr('src', `img/win.gif`);
                // Disable all buttons
                for (let btn of allButtons) {
                    btn.disabled = true;
                    btn.classList.add("disabled-button");
                }
                setTimeout(() => {
                    alert(`You won! The word was: ${hangmanWord.toUpperCase()}\nPlay Again?`);
                    location.reload();
                }, 1500);}
            }
        
        // Disable the clicked button
        button.disabled = true;
        button.classList.add("disabled-button");
        }
    );
}
