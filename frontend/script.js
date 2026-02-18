//********************************************* Java Script for Grid ***********************/
const revealsEl = document.getElementById("reveals");
const timerEl = document.getElementById("timer");
const flipSound = new Audio("assets/flip.mp3");
const TOTAL_PAIRS = 8;

// Game state
const gameState={
timer : 0,// Timer in seconds
timerInterval : null,
startTime : null, // Timestamp when timer starts
flippedCards : [],
counter : 0,
canClick : true,
matchedPairs : 0,
gameCards : [],
cardData : [], // Will be populated from API
}


// Update displays
function updateCounter(state) {
  document.getElementById("reveals").textContent = state.counter;
}

// Flip card function
function flipCard(cardElement,state) {
  if (!state.canClick) return;
  if (cardElement.classList.contains("flipped")) return;

  if (state.counter === 0) {
    startTimer(state);
  }

  cardElement.classList.add("flipped");
  state.flippedCards.push(cardElement);
  state.counter++;
  updateCounter(state);

  if (state.flippedCards.length === 2) {
    state.canClick = false;

    // Get two CardElement Id
    const card1Id = state.flippedCards[0].getAttribute("data-card-id");
    const card2Id = state.flippedCards[1].getAttribute("data-card-id");

    if (card1Id === card2Id) {
      handleMatch(state);
    } else {
      handleMismatch(state);
    }
  }
}
//Match Handle
function handleMatch(state) {
  // Add matched class to both cards
  state.flippedCards[0].classList.add("matched");
  state.flippedCards[1].classList.add("matched");

  // Increase match paired counter
  state.matchedPairs++;

  // Empty flippedCards
  state.flippedCards = [];

  //Unlock the board
  state.canClick = true;

  //check win condition
  checkWinCondition(state);
}

// handle mis match condition
function handleMismatch(state) {
  setTimeout(() => {
    // remove class flipped from cards.
    state.flippedCards[0].classList.remove("flipped");
    state.flippedCards[1].classList.remove("flipped");
    // empty flipped card array
    state.flippedCards = [];

    //unlook the board
    state.canClick = true;
  }, 1500);
}
//check win condition
function checkWinCondition(state) {
  if (state.matchedPairs === TOTAL_PAIRS) {
    // Player won!
    stopTimer(state);
    // delay for the last card seen by player
    setTimeout(function () {
      showWinMessage(state);
    }, 500);
  }
}

// Show Win Message
function showWinMessage(state) {
  // show a message for test
  alert("You Win \nTime: " + formatTime(state.timer) + "\nReveals: " + state.counter);
}




// Fetch card data from API
function fetchCardData(limit = 8,state) {
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
      state.cardData=data.map((card) => ({
        id: card.id,
        name: card.card_name,
        image: card.image_path,
      }));
      createCards(state);
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
function createCards(state) {
  const gridContainer = document.getElementById("card-grid");
  gridContainer.innerHTML = ""; // Clear any existing cards

  // Fetch the card data (returns a Promise)
  //fetchCardData(8).then((cardData) => {
   // if (!cardData.length) return; // already alerted in fetchCardData

    // Initialize game cards
    state.gameCards = shuffleCards(duplicateCards(state.cardData));

    state.gameCards.forEach((card, index) => {
      // Create card HTML
      const cardDiv = document.createElement("div");
      cardDiv.className = "flip-card";
      cardDiv.id = `card-${index}`;
      cardDiv.setAttribute("data-card-id", card.id);

      cardDiv.addEventListener("click", () => {
        flipCard(cardDiv,state);
      });

      cardDiv.innerHTML = `
    <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-back">
          <img src="assets/back-card.png" alt="card back" />
      </div>
      <div class="flip-card-front">
          <img src="${card.image}" alt="${card.name}" />
      </div>

    </div>
    </div>
    `;

      gridContainer.appendChild(cardDiv);
    });
 // });
}



//*************************************** End of Grid  */

// Timer Functions

function startTimer(state) {
  if (state.timerInterval) return; // Prevent multiple intervals
  state.startTime = Date.now() - state.timer * 1000; // Resume correctly if paused
  state.timerInterval = setInterval(() => {
    state.timer = Math.floor((Date.now() - state.startTime) / 1000);
    timerEl.textContent = formatTime(state.timer);
  }, 1000);
}

function stopTimer(state) {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function resetTimer(state) {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.timer = 0;
  state.startTime = null;
  timerEl.textContent = formatTime(state.statetimer);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}


function restartGame(state){
  // Hide Win Message

  // restart Timer
  resetTimer(state);
  
  // Reset All the game state
  state.matchedPairs=0;
  state.counter = 0;
  state.flippedCards = [];
  state.canClick = true;

  //update display
  updateCounter(state);

  // remove all class ("matched")


  // Recreate grid
  createCards(state);

}

//Start game when page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchCardData(TOTAL_PAIRS,gameState);
});
