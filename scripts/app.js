/*jshint esversion: 6 */
/*
 * Create a list that holds all of your cards
 */
const cards = ["ion-ios-bicycle", "ion-logo-snapchat", "ion-logo-model-s", "ion-logo-octocat", "ion-ios-basketball", "ion-ios-infinite", "ion-ios-paper-plane", "ion-logo-reddit", "ion-ios-bicycle", "ion-logo-snapchat", "ion-logo-model-s", "ion-logo-octocat", "ion-ios-basketball", "ion-ios-infinite", "ion-ios-paper-plane", "ion-logo-reddit"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const cardDeck = document.querySelector(".deck");
const modal = document.querySelector(".modal__overlay");
const modalIcon = document.querySelector(".modal__icon");
const time = document.querySelector(".time");
const modalBody = document.querySelector(".modal__body");
const modalButton = document.querySelector(".modal__button");
const resetBtn = document.querySelector(".restart");

const totalPaired = 8;
let openedCards = [];
let moves = 0;
let timerOff = true;
let timeId;
let mins = 0;
let sec = 0;
let hrs = 0;
let matched = 0;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// function for creating the cards for the deck
function buildDeckOfCards() {
    resetCards();

    let newCards = shuffle(cards);

    for (const newCard of newCards) {
        let li = document.createElement("li");
        li.classList.add("card");
        li.innerHTML = `<i class = "${newCard}"></i>`;
        cardDeck.appendChild(li);
    }
}

// function to push cards into openedCards array
function addToOpenedCards(item) {
    openedCards.push(item);
}

// function for toggling cards
function toggleCards(card) {
    card.classList.toggle("open");
    card.classList.toggle("show");
}

// function to check whether openedCards array already has a card with class match and if there is a duplicate card
function isCardValid(card) {
    return (card.classList.contains("card") && !card.classList.contains("match") && openedCards.length < 2 && !openedCards.includes(card));
}

// function for incrementing the number of moves
function movesCounter() {
    const movesEle = document.querySelector("span.moves");
    moves += 1;
    movesEle.textContent = moves;
}

// function for checking the number of moves made by player and awarding stars
function checkMoves() {
    if (moves === 8 || moves === (8 * 2)) {
        reduceStars();
    }
}

// function for reducing the number of stars depending on the number of moves player has made
function reduceStars() {
    const stars = document.querySelectorAll(".stars li");
    for (const star of stars) {
        if (star.style.display !== "none") {
            star.style.display = "none";
            break;
        }
    }
}

// function to display time within the DOM
function displayTime() {
    time.textContent = (hrs ? (hrs > 9 ? hrs : "0" + hrs) : "00") + ":" + (mins ? (mins > 9 ? mins : "0" + mins) : "00") + ":" + (sec > 9 ? sec : "0" + sec);

}

// function to start timer and display time every second
function startWatch() {
    timeId = setInterval(() => {
        timer();
        displayTime();
    }, 1000);
}

// function to stop the timer
function stopWatch() {
    clearInterval(timeId);
}

// function to help setup time format
function timer() {
    sec += 1;

    if (sec >= 60) {
        sec = 0;
        mins += 1;

        if (mins >= 60) {
            mins = 0;
            hrs += 1;
        }
    }
}

// function for resetting the game
function resetGame() {
    resetWatchAndTimer();
    resetMoves();
    resetStars();
    buildDeckOfCards();
}

// function to reset the deck
function resetCards() {
    while (cardDeck.firstElementChild) {
        cardDeck.removeChild(cardDeck.firstElementChild);
    }
}

// function for resetting the number of moves
function resetMoves() {
    moves = 0;
    openedCards = [];
    matched = 0;
    document.querySelector("span.moves").textContent = moves;
}

// function for resetting the number of stars awarded to the player
function resetStars() {
    const stars = document.querySelectorAll(".stars li");
    for (const star of stars) {
        star.style.display = "inline";
    }
}

// function for resetting the timer
function resetWatchAndTimer() {
    stopWatch();
    timerOff = true;
    sec = 0;
    mins = 0;
    hrs = 0;
    displayTime();
}

// function for toggling the modal window
function toggleModal() {
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }

    modal.classList.add("animated", "slideInDown");

    setTimeout(() => {
        modalIcon.classList.add("animated", "fadeInDown");
    }, 1500);

    setTimeout(() => {
        modal.classList.remove("animated", "slideInDown");
        modalIcon.classList.remove("animated", "fadeInDown");
    }, 2000);
}

// function to show the stats on the modal window
function showModalStats() {
    const modalMessage = document.querySelector(".modal__message");
    const moves = document.querySelector(".moves").textContent;
    const numOfStars = getNumOfStars();

    modalMessage.textContent = `With ${moves} Move(s) and ${numOfStars} Star(s)`;
}

// function to get the number of stars left after the game has ended
function getNumOfStars() {
    let stars = document.querySelectorAll(".stars li");
    let countStars = 0;

    for (const star of stars) {
        if (star.style.display !== "none") {
            countStars += 1;
        }
    }

    return countStars;
}

// function to play the game one more time
function replayGame() {
    resetGame();
    toggleModal();
}

// funtion that runs when all cards have been matched and ends the game
function gameOver() {
    stopWatch();
    toggleModal();
    showModalStats();
}

// function for checking if there's a match in openedCards array
function checkForMatch() {
    let firstCard = openedCards[0];
    let secondCard = openedCards[1];

    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {

        setTimeout(() => {
            firstCard.classList.remove("open", "show");
            secondCard.classList.remove("open", "show");

            firstCard.classList.add("animated", "rubberBand");
            secondCard.classList.add("animated", "rubberBand");

            firstCard.classList.toggle("match");
            secondCard.classList.toggle("match");
        }, 400);

        openedCards = [];
        matched += 1;

        if (matched === totalPaired) {
            gameOver();
        }

    } else {
        /* A mismatched pair is correctly toggled off but we don't actually see the second card that is clicked
         because it toggles off the moment the code reaches the else condition 
         so to be able to see the second card we going to delay the toggleCards function for 1 second using the 
         setTimeout function.

        toggleCards(firstCard);
        toggleCards(secondCard);
        openedCards = []; */
        firstCard.classList.add("misMatch");
        secondCard.classList.add("misMatch");
        firstCard.classList.add("animated", "shake");
        secondCard.classList.add("animated", "shake");

        setTimeout(() => {
            firstCard.setAttribute("class", "card");
            secondCard.setAttribute("class", "card");
            openedCards = [];
        }, 1000);
    }
}

// Event delegation for cards
cardDeck.addEventListener("click", (event) => {
    const clickTarget = event.target;

    /* If event target is a card and openedCards array is less than 2
     then we toggle cards and add them to the array
     this also makes sure that we are able to open two cards at a time */

    if (isCardValid(clickTarget)) {
        toggleCards(clickTarget);
        addToOpenedCards(clickTarget);

        if (timerOff) {
            startWatch();
            timerOff = false;
        }

        if (openedCards.length === 2) {
            movesCounter();
            checkMoves();
            checkForMatch();
        }
    }
});

resetBtn.addEventListener("click", resetGame);
modalButton.addEventListener("click", replayGame);

buildDeckOfCards();
displayTime();





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */