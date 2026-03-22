/**
 * Odhis Typing Lab v3.3 (MULTI-MODE + HINTS)
 * Status: STABLE - Supports K8s and Regular practice modes.
 */

let practiceLibrary = [];
let currentTarget = "";
let charIndex = 0;
let startTime = null;
let errors = 0;
let totalTyped = 0;
let timeLeft = 3600; // Adjusted to your preferred hour-long session
let timerInterval = null;
let isTyping = false;

const display = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const wpmDisplay = document.getElementById('wpm');
const accDisplay = document.getElementById('accuracy');
const highScoreDisplay = document.getElementById('high-score');
const nextBtn = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');

/**
 * 1. INITIALIZATION & MODE SWITCHING
 */

// 1a. The "Worker" - Handles fetching data from the selected JSON
async function loadData() {
    const selector = document.getElementById('mode-selector');
    const targetFile = selector ? selector.value : 'practice_data.json';

    try {
        const response = await fetch(targetFile);
        if (!response.ok) throw new Error(`Could not find ${targetFile}`);
        
        const data = await response.json();
        
        // Supports both "sentences" key and flat array formats
        practiceLibrary = data.sentences || data; 
        
        renderHighScore();
        loadNew();
        inputField.focus();
    } catch (e) { 
        display.innerHTML = `<span style="color:red">SYSTEM_HALT: ${e.message}</span>`;
        console.error("Load Error:", e);
    }
}

// 1b. The "Manager" - Sets up listeners once
function init() {
    const selector = document.getElementById('mode-selector');

    if (selector) {
        // Use onchange to ensure only one listener exists
        selector.onchange = () => {
            loadData();
        };
    }

    // Global click listener to keep focus on the terminal
    document.addEventListener('click', () => inputField.focus());

    // Run initial data load
    loadData();
}

/**
 * 2. KEYBOARD HINT LOGIC
 */
function getIDFromChar(char) {
    if (char === " " || char === undefined) return "key-space";
    if (char === ";") return "key-semicolon";
    if (char === "-") return "key-dash";
    if (char === ".") return "key-dot";
    return `key-${char.toLowerCase()}`;
}

function updateKeyboardVisuals() {
    document.querySelectorAll('.key').forEach(k => k.classList.remove('hint-key'));
    
    const nextChar = currentTarget[charIndex];
    const keyId = getIDFromChar(nextChar);
    const keyElement = document.getElementById(keyId);
    
    if (keyElement) {
        keyElement.classList.add('hint-key');
    }
}

/**
 * 3. TIMER & FINISH
 */
function startTimer() {
    if (isTyping) return;
    isTyping = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTest();
        }
    }, 1000);
}

function finishTest() {
    isTyping = false;
    inputField.disabled = true;
    saveScore();
    alert("SESSION_COMPLETE: Time Expired.");
}

/**
 * 4. TYPING LOGIC
 */
inputField.addEventListener('input', (e) => {
    if (!isTyping && e.target.value.length > 0) {
        startTimer();
        startTime = new Date();
    }
    
    const typed = e.target.value;
    const spans = display.querySelectorAll('span');
    
    if (typed.length < charIndex) {
        charIndex = Math.max(0, typed.length);
    } else if (charIndex < currentTarget.length) {
        const isCorrect = typed[charIndex] === currentTarget[charIndex];
        spans[charIndex].className = isCorrect ? 'correct' : 'incorrect';
        if (!isCorrect) errors++;
        charIndex++;
        totalTyped++;
    }

    updateMetrics();
    updateKeyboardVisuals();

    if (typed === currentTarget) {
        saveScore();
        setTimeout(loadNew, 500);
    }
});

/**
 * 5. METRICS & UI
 */
function updateMetrics() {
    if (!startTime) return;
    const mins = (new Date() - startTime) / 60000;
    if (mins > 0.01) {
        const wpm = Math.round((totalTyped / 5) / mins);
        wpmDisplay.innerText = wpm;
    }
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    accDisplay.innerText = `${Math.max(0, accuracy)}%`;
}

function loadNew() {
    charIndex = 0; 
    startTime = null; 
    errors = 0; 
    totalTyped = 0; 
    isTyping = false;
    clearInterval(timerInterval);
    
    // Reset timer to your preferred session length (3600 for 1 hour)
    timeLeft = 3600; 
    if (timerDisplay) timerDisplay.innerText = timeLeft;
    
    inputField.value = "";
    inputField.disabled = false;
    
    if (practiceLibrary.length > 0) {
        currentTarget = practiceLibrary[Math.floor(Math.random() * practiceLibrary.length)];
        display.innerHTML = currentTarget.split('').map((c, i) => 
            `<span class="${i === 0 ? 'current' : ''}">${c}</span>`
        ).join('');
        updateKeyboardVisuals();
    }
}

/**
 * 6. LEADERBOARD
 */
function saveScore() {
    const currentWPM = parseInt(wpmDisplay.innerText) || 0;
    const currentAcc = accDisplay.innerText;
    if (currentWPM === 0) return;

    let leaderboard = JSON.parse(localStorage.getItem('odhis_leaderboard')) || [];
    leaderboard.push({
        wpm: currentWPM, 
        accuracy: currentAcc, 
        date: new Date().toLocaleDateString()
    });
    
    leaderboard.sort((a, b) => b.wpm - a.wpm);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('odhis_leaderboard', JSON.stringify(leaderboard));
    renderHighScore();
}

function renderHighScore() {
    const leaderboard = JSON.parse(localStorage.getItem('odhis_leaderboard')) || [];
    const tableBody = document.getElementById('leaderboard-body');
    if (leaderboard.length > 0) highScoreDisplay.innerText = `System Record: ${leaderboard[0].wpm} WPM`;
    if (tableBody) {
        tableBody.innerHTML = leaderboard.map((entry, index) => `
            <tr><td>#${index + 1}</td><td>${entry.wpm}</td><td>${entry.accuracy}</td><td>${entry.date}</td></tr>
        `).join('');
    }
}

// Button Hooks
nextBtn.onclick = loadNew;
document.getElementById('reset-btn').onclick = () => {
    if(confirm("SYSTEM_WARNING: Wipe all leaderboard data?")) {
        localStorage.removeItem('odhis_leaderboard');
        location.reload(); 
    }
};

// Launch
init();