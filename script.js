/* break-reminder-new / 21.9.2025 */

// --- DOM ELEMENT REFERENCES ---
const mainCard = document.getElementById('mainCard');
const countdownEl = document.getElementById('countdown');
const progressCircle = document.getElementById('progressCircle');
const statusText = document.getElementById('status');
const alertSound = document.getElementById('alertSound');

const setTimerBtn = document.getElementById('setTimerBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const toggleCountdownBtn = document.getElementById('toggleCountdownBtn');
const eyeSlash = document.getElementById('eyeSlash');

const breakModal = document.getElementById('breakModal');
const closeModal = document.getElementById('closeModal');

const setTimerModal = document.getElementById('setTimerModal');
const timerInput = document.getElementById('timerInput');
const backTimer = document.getElementById('backTimer');
const okTimer = document.getElementById('okTimer');
const presetBtns = document.querySelectorAll('.preset-btn');

const backgroundBtn = document.getElementById('backgroundBtn');
const backgroundModal = document.getElementById('backgroundModal');
const backgroundOptions = document.querySelectorAll('.background-option');
const okBg = document.getElementById('okBg');

// --- INITIAL STATE SETUP ---

// State variables
let countdownVisible = true;
let timerMinutes = 30;
let timerInterval;
let timeLeft;
let endTime;
let isPaused = false;

// Load saved background from localStorage or fallback to default
let selectedBackground = localStorage.getItem('background') || 'images/background.jpg';

////
// ページロード時に通知権限をリクエスト（オプション）
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    console.log('Notification permission:', permission);
  });
}

// Function: apply selected background image to body
function applyBackground(bg) {
  document.body.style.backgroundImage = `url('${bg}')`;
}
applyBackground(selectedBackground);

// --- INITIAL BUTTON STATES ---
// Disable timer controls until timer is started
toggleCountdownBtn.disabled = true;
pauseBtn.disabled = true;
stopBtn.disabled = true;
setTimerBtn.disabled = false; // allow setting timer at start

// --- TIMER MODAL HANDLING ---
// Open timer modal
function openTimerModal() {
  setTimerModal.style.display = "flex";
  timerInput.value = timerMinutes; // pre-fill with current minutes
}

// Close timer modal
function closeTimerModal() {
  setTimerModal.style.display = "none";
}

setTimerBtn.addEventListener('click', openTimerModal);
backTimer.addEventListener('click', closeTimerModal);

// Confirm & start timer from modal
okTimer.addEventListener('click', () => {
  const val = parseInt(timerInput.value);

  // Validate input (must be between 5 and 120 minutes)
  if (!isNaN(val) && val >= 5 && val <= 120) {
    timerMinutes = val;
    timeLeft = timerMinutes * 60;
    isPaused = false;

    startTimer();

    statusText.textContent = `Timer is set for ${timerMinutes} minutes.`;

    // Enable controls
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    toggleCountdownBtn.disabled = false;
    backgroundBtn.disabled = false;
    setTimerBtn.disabled = true;
  }
  closeTimerModal();
});

// Preset buttons quickly set timer value
presetBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    timerInput.value = btn.dataset.min;
  })
);

// --- TIMER FUNCTIONALITY ---
const WARNING_THRESHOLD = 60; // seconds left to switch color

function startTimer() {
  clearInterval(timerInterval);

  if (timeLeft === undefined) {
    timeLeft = timerMinutes * 60;
  }

  // Calculate absolute end time based on now
  endTime = Date.now() + timeLeft * 1000;

  statusText.textContent = `Timer is set for ${timerMinutes} minutes.`;

  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeLeft = 0;
        showBreakModal();
      }

      const progressPercent = ((timerMinutes * 60 - timeLeft) / (timerMinutes * 60)) * 100;
      const progressDegrees = progressPercent * 3.6;
      const progressColor = timeLeft <= WARNING_THRESHOLD ? "#ff9800" : "#4caf50";

      progressCircle.style.background = `conic-gradient(${progressColor} ${progressDegrees}deg, #555 ${progressDegrees}deg)`;
      progressCircle.ariaValueNow = String(Math.floor(progressPercent));

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }, 1000);
}

// Pause / resume button handler
pauseBtn.addEventListener("click", () => {
  if (!isPaused) {
    // Pause timer
    isPaused = true;
    timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));

    pauseBtn.title = "Resume Timer";
    pauseBtn.setAttribute("aria-label", "Resume Timer");
    pauseBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="6,5 14,12 6,19" fill="white"/>
        <rect x="16" y="5" width="2" height="14" fill="white"/>
      </svg>`;
    statusText.textContent = "Timer paused";

  } else {
    // Resume timer
    isPaused = false;
    endTime = Date.now() + timeLeft * 1000;

    pauseBtn.title = "Pause Timer";
    pauseBtn.setAttribute("aria-label", "Pause Timer");
    pauseBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="5" width="4" height="14" fill="white"/>
        <rect x="14" y="5" width="4" height="14" fill="white"/>
      </svg>`;
    statusText.textContent = `Timer is set for ${timerMinutes} minutes. (Resumed)`;
  }
});

// Stop & reset timer
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = undefined;
  endTime = undefined;
  isPaused = false;

  countdownEl.textContent = "--:--";
  progressCircle.style.background = `conic-gradient(#555 0deg, #555 0deg)`;
  progressCircle.ariaValueNow = "0";
  statusText.textContent = "The timer is not running yet.";

  pauseBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="5" width="4" height="14" fill="white"/>
      <rect x="14" y="5" width="4" height="14" fill="white"/>
    </svg>`;
  pauseBtn.title = "Pause Timer";
  pauseBtn.setAttribute("aria-label", "Pause Timer");

  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  toggleCountdownBtn.disabled = true;
  setTimerBtn.disabled = false;

  countdownVisible = true;
  updateCountdownVisibility();
  localStorage.setItem("countdownVisible", countdownVisible);
}
////
async function showBreakNotification() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification("Break Reminder", {
      body: "Time for a break! ✨",
      icon: "icons/icon-192.png"
    });
  }
}
// Show break modal with sound + vibration
/*
function showBreakModal() {
  breakModal.style.display = "flex";
  alertSound.currentTime = 0;
  alertSound.play();

  if (navigator.vibrate) {
    navigator.vibrate([500, 200, 500]);
  }
}
*/
////
async function showBreakModal() {
  breakModal.style.display = "flex";
  alertSound.currentTime = 0;
  alertSound.play();

  if (navigator.vibrate) {
    navigator.vibrate([500, 200, 500]);
  }

  await showBreakNotification();  // ← ここで通知を表示
}

// Stop button handler
stopBtn.addEventListener("click", resetTimer);

// Break modal close handler
closeModal.addEventListener("click", () => {
  breakModal.style.display = "none";
  resetTimer();
  alertSound.pause();
  alertSound.currentTime = 0;
});

// --- COUNTDOWN VISIBILITY TOGGLE ---
function updateCountdownVisibility() {
  countdownEl.style.display = countdownVisible ? "block" : "none";
  eyeSlash.style.display = countdownVisible ? "none" : "block";
}
updateCountdownVisibility();

toggleCountdownBtn.addEventListener("click", () => {
  countdownVisible = !countdownVisible;
  updateCountdownVisibility();
});

// --- DRAGGABLE CARD ---
const defaultPos = { x: 100, y: 100 };
let isDragging = false, offsetX = 0, offsetY = 0;

function startDrag(x, y) {
  isDragging = true;
  const rect = mainCard.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
}

function moveDrag(x, y) {
  if (!isDragging) return;
  mainCard.style.left = `${x - offsetX}px`;
  mainCard.style.top = `${y - offsetY}px`;
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;

  const rect = mainCard.getBoundingClientRect();
  const margin = 50;
  if (
    rect.right < margin ||
    rect.left > window.innerWidth - margin ||
    rect.bottom < margin ||
    rect.top > window.innerHeight - margin
  ) {
    mainCard.style.left = `${defaultPos.x}px`;
    mainCard.style.top = `${defaultPos.y}px`;
    console.log("Card reset to default position");
  }
}

// Add drag listeners (mouse + touch)
function addDragListeners() {
  mainCard.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", stopDrag);

  mainCard.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  });
  document.addEventListener("touchmove", e => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  });
  document.addEventListener("touchend", stopDrag);
}
addDragListeners();

// --- BACKGROUND SELECTION MODAL ---
backgroundBtn.addEventListener('click', ()=>{
  backgroundModal.style.display="flex";
  const currentBg = localStorage.getItem('background');
  backgroundOptions.forEach(o => {
    o.classList.remove('selected');
    if (o.dataset.bg === currentBg) o.classList.add('selected');
  });
});
okBg.addEventListener('click', ()=>{
  const selected = document.querySelector('.background-option.selected');
  if(selected){
    const bg = selected.dataset.bg;
    document.body.style.backgroundImage = `url('${bg}')`;
    localStorage.setItem('background', bg);
  }
  backgroundModal.style.display="none";
});
backgroundOptions.forEach(opt=>{
  opt.addEventListener('click', ()=>{
    backgroundOptions.forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
  });
});

// --- PWA: Register Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered.', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}





