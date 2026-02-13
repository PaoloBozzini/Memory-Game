// =============================
//  One Card TestLogic
// =============================
const testCard = document.getElementById("testCard");
const revealsEl = document.getElementById("reveals");
const timerEl = document.getElementById("timer");
const flipSound = new Audio("assets/flip.mp3");

let reveals = 0; // Count of revealed cards
let timer = 0; // Timer in seconds
let timerInterval = null;
let startTime = null; // Timestamp when timer starts

// Flip the card
testCard.addEventListener("click", () => {
  if (testCard.classList.contains("flipped")) return;

  testCard.classList.add("flipped");

  // Play flip sound
  flipSound.currentTime = 0;
  flipSound.play();

  // Increment reveals counter
  reveals++;
  revealsEl.textContent = reveals;

  // Start timer on first reveal
  if (reveals === 1) startTimer();

  // Flip back after 1 second for repeated testing
  setTimeout(() => {
    testCard.classList.remove("flipped");
  }, 1000);
});

// =============================
// Timer Functions
// =============================
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

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

//restart game function

const restartButton = document.getElementById("restartButton");

restartButton.addEventListener("click", () => {
  testCard.classList.remove("flipped"); // Reset card
  reveals = 0;
  revealsEl.textContent = reveals;
  resetTimer();
});
