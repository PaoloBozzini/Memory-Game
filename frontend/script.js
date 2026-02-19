
//********************************************* Variables ***********************/
const revealsEl = document.getElementById("reveals");
const timerEl = document.getElementById("timer");
const winMessage = document.getElementById("win-message");
const finalScore = document.getElementById("finalScore");
const finalReveals = document.getElementById("finalReveals");
const playAgainBtn = document.getElementById("play-again-btn");
const restartButton = document.getElementById("restartButton");
const flipSound = new Audio("assets/flip.mp3");

const TOTAL_PAIRS = 8;

// Game state
let counter = 0;
let timer = 0; // Timer in seconds
let timerInterval = null;
let startTime = null; // Timestamp when timer starts
let flippedCards = [];
let matchedPairs = 0;
let canClick = true;
let cardData = [];         // Will be populated from API
let gameCards = [];        // Duplicate + shuffled cards

//********************************************* Card functions ***********************/

// Flip card function
function flipCard(cardElement) {
  if (!canClick) return;
  if (cardElement.classList.contains("flipped")) return;

  if (counter === 0) {
    startTimer();
  }

  cardElement.classList.add("flipped");
  flippedCards.push(cardElement);
  counter++;
  updateCounter();

  if (flippedCards.length === 2) {
    canClick = false;

    // Get two CardElement Id
    const card1Id = flippedCards[0].getAttribute("data-card-id");
    const card2Id = flippedCards[1].getAttribute("data-card-id");

    if (card1Id === card2Id) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }
}
//Match Handle
function handleMatch() {
  // Add matched class to both cards
  flippedCards[0].classList.add("matched");
  flippedCards[1].classList.add("matched");

  // Increase match paired counter
  matchedPairs++;

  // Empty flippedCards
  flippedCards = [];

  //Unlook the board
  canClick = true;

  //check win condition
  checkWinCondition();
}

// handle mis match condition
function handleMismatch() {
  setTimeout(() => {
    // remove class flipped from cards.
    flippedCards[0].classList.remove("flipped");
    flippedCards[1].classList.remove("flipped");
    // empty flipped card array
    flippedCards = [];

    //unlook the board
    canClick = true;
  }, 1500);
}
//check win condition
function checkWinCondition() {
  if (matchedPairs === TOTAL_PAIRS) {
    // Player won!
    stopTimer();
    // delay for the last card seen by player
    setTimeout(function () {
      showWinMessage();
    }, 500);
  }
}

// Fetch card data from API
function fetchCardData(limit = 8) {
  return fetch(`http://localhost:3000/cards/all-cards/${limit}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json(); // parse JSON
    })
    .then((data) => {

      if (!data.length) {
        alert("Failed to load cards");
        return [];
      }
      // Map API data to game format
      return data.map((card) => ({
        id: card.id,
        name: card.card_name,
        image: card.image_path,
      }));
    })
    .catch((error) => {
      console.error("Error fetching cards:", error);
      return [];
    });
}

// Duplicate cards so each appears twice
function duplicateCards(cards) {
  return cards.flatMap((card) => [{ ...card }, { ...card }]);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleCards(cards) {
  const shuffled = JSON.parse(JSON.stringify(cards)); // DEEP Copy. Make a copy

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Generate all cards and add to grid
function createCards() {
  const gridContainer = document.getElementById("card-grid");
  gridContainer.innerHTML = ""; // Clear any existing cards

  // Fetch the card data (returns a Promise)
  fetchCardData(8).then((cardData) => {
    if (!cardData.length) return; // already alerted in fetchCardData

    // Initialize game cards
    gameCards = shuffleCards(duplicateCards(cardData));

    gameCards.forEach((card, index) => {
      // Create card HTML
      const cardDiv = document.createElement("div");
      cardDiv.className = "flip-card";
      cardDiv.id = `card-${index}`;
      cardDiv.setAttribute("data-card-id", card.id);

      cardDiv.addEventListener("click", () => {
        flipCard(cardDiv);
      });

      cardDiv.innerHTML = `
   
    <div class="flip-card-inner">
      <div class="flip-card-back">
          <img src="assets/back-card.png" alt="card back" />
      </div>
      <div class="flip-card-front">
          <img src="${card.image}" alt="${card.name}" />
      </div>
    </div>
    `;

      gridContainer.appendChild(cardDiv);
    });
  });
}

document.addEventListener("DOMContentLoaded", createCards);

//********************************************* Win message ***********************/

// Show Win Message
function showWinMessage() {
   // Stop timer 
 stopTimer();

  // 🎉 CONFETTI BURST
  confetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0.6 }
  });

  // Set final values
  finalScore.textContent = document.getElementById("timer").textContent;
  finalReveals.textContent = document.getElementById("reveals").textContent;

  // Show overlay
  winMessage.classList.remove("hidden");
}




function hideWinMessage() {
  winMessage.classList.add("hidden");
}

playAgainBtn.addEventListener("click", restartGame);
  


//********************************************* Timer Functions ***********************/

// Timer Functions

function startTimer() {
  if (timerInterval) return; // Prevent multiple intervals
  startTime = Date.now() - timer * 1000; // Resume correctly if paused
  timerInterval = setInterval(() => {
    timer = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = formatTime(timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timer = 0;
  startTime = null;
  timerEl.textContent = formatTime(timer);
}

//Format time in mm:ss
function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
// Update revealsCounter
function updateCounter() {
  document.getElementById("reveals").textContent = counter;
}
//********************************************* Restart Game Functions ***********************/
//Restart game function

restartButton.addEventListener("click", restartGame);
  // Reset game state
  function restartGame() {
  counter = 0;
  matchedPairs = 0;
  flippedCards = [];
  canClick = true;

  updateCounter();
  resetTimer();
hideWinMessage(); // ensure modal disappears

  createCards();
}

 

