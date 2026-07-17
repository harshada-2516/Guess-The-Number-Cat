/**
 * Guess the Number - Cat Reaction Game
 * Core JavaScript Logic & Synthesis Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // STATE VARIABLES
    // ==========================================================================
    let targetNumber = 0;
    let attemptsCount = 0;
    let isGameOver = false;
    let gamesWonCount = parseInt(localStorage.getItem("guess_cat_games_won")) || 0;
    
    // Best score is represented by the minimum number of attempts to win
    let bestScoreValue = localStorage.getItem("guess_cat_best_score") 
        ? parseInt(localStorage.getItem("guess_cat_best_score")) 
        : null;

    // Web Audio Context definition for synthesized sounds fallback
    let audioContext = null;

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const guessInput = document.getElementById("guessInput");
    const guessBtn = document.getElementById("guessBtn");
    const restartBtn = document.getElementById("restartBtn");
    const loadingOverlay = document.getElementById("loadingOverlay");
    
    const catSprite = document.getElementById("catSprite");
    const catWrapper = document.getElementById("catWrapper");
    const speechBubble = document.getElementById("speechBubble");
    const speechText = document.getElementById("speechText");
    const gameMessage = document.getElementById("gameMessage");
    
    const hintPanel = document.getElementById("hintPanel");
    const hintText = document.getElementById("hintText");
    
    const attemptsCounter = document.getElementById("attemptsCounter");
    const bestScoreDisplay = document.getElementById("bestScore");
    const gamesWonDisplay = document.getElementById("gamesWon");
    
    const themeToggle = document.getElementById("themeToggle");

    // Audio Element Fallbacks
    const audioClick = document.getElementById("audioClick");
    const audioMeow = document.getElementById("audioMeow");
    const audioAngry = document.getElementById("audioAngry");
    const audioHappy = document.getElementById("audioHappy");

    // ==========================================================================
    // SOUND GENERATION & Fallback Engine
    // ==========================================================================
    
    /**
     * Initializes the AudioContext on user interaction
     */
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    }

    /**
     * Synthesises a crisp electronic click sound using Web Audio API
     */
    function synthClick() {
        try {
            initAudioContext();
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(800, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            
            osc.start();
            osc.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            console.warn("Audio synthesis failed:", e);
        }
    }

    /**
     * Synthesises a cute cat meow sound using Web Audio API frequency sweep
     * & formants simulation filters
     */
    function synthMeow(pitchMultiplier = 1.0, isAngry = false) {
        try {
            initAudioContext();
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();
            
            osc.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const duration = isAngry ? 0.5 : 0.4;
            
            // Set oscillator type
            // Triangle waves sound softer (cute meow), Sawtooth sounds raspy/irritated (angry meow)
            osc.type = isAngry ? "sawtooth" : "triangle";

            const now = audioContext.currentTime;

            // Pitch envelopes
            const baseFreq = (isAngry ? 380 : 440) * pitchMultiplier;
            const peakFreq = (isAngry ? 500 : 700) * pitchMultiplier;
            const endFreq = (isAngry ? 320 : 490) * pitchMultiplier;

            osc.frequency.setValueAtTime(baseFreq, now);
            // Rise to peak (me-...)
            osc.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.4);
            // Release to end (...-ow)
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

            // Filter configuration to simulate physical cat vocal tract
            filterNode.type = "bandpass";
            filterNode.Q.setValueAtTime(isAngry ? 1.5 : 2.5, now);
            filterNode.frequency.setValueAtTime(750, now);
            filterNode.frequency.exponentialRampToValueAtTime(1300, now + duration * 0.4);
            filterNode.frequency.exponentialRampToValueAtTime(850, now + duration);

            // Volume Envelope
            gainNode.gain.setValueAtTime(0.001, now);
            gainNode.gain.linearRampToValueAtTime(isAngry ? 0.35 : 0.3, now + 0.06);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.start(now);
            osc.stop(now + duration + 0.05);
        } catch (e) {
            console.warn("Audio meow synthesis failed:", e);
        }
    }

    /**
     * Synthesises a happy double chirp meow
     */
    function synthHappyMeow() {
        // High chirps spaced 160ms apart
        synthMeow(1.3, false);
        setTimeout(() => {
            synthMeow(1.5, false);
        }, 160);
    }

    /**
     * Master Play Sound controller. Plays physical files, falls back to real-time synth.
     * @param {string} soundType - 'click', 'low', 'high', 'win'
     */
    function playSound(soundType) {
        initAudioContext();
        
        if (soundType === "click") {
            audioClick.play().catch(() => synthClick());
        } 
        else if (soundType === "low") {
            // Low guess -> sad reaction -> soft meow
            audioMeow.play().catch(() => synthMeow(0.95, false));
        } 
        else if (soundType === "high") {
            // High guess -> angry reaction -> angry meow (pitch shifted down & rougher)
            audioAngry.play().catch(() => synthMeow(0.85, true));
        } 
        else if (soundType === "win") {
            // Win guess -> happy reaction -> happy chirpy meow
            audioHappy.play().catch(() => synthHappyMeow());
        }
    }

    // ==========================================================================
    // CONFETTI CELEBRATION ENGINE
    // ==========================================================================
    
    /**
     * Spawns physical CSS-animated confetti shapes over the viewport
     */
    function triggerConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ["#ff7171", "#ffd166", "#06d6a0", "#118ab2", "#a8dadc", "#e29578", "#ff007f", "#7209b7"];

        const interval = setInterval(() => {
            if (Date.now() > end) {
                return clearInterval(interval);
            }

            for (let i = 0; i < 6; i++) {
                const element = document.createElement("div");
                element.className = "confetti-piece";
                
                // Random position and attributes
                element.style.left = Math.random() * 100 + "vw";
                element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                element.style.width = Math.random() * 8 + 6 + "px";
                element.style.height = Math.random() * 16 + 8 + "px";
                element.style.animationDuration = Math.random() * 1.5 + 1.5 + "s";
                element.style.transform = `rotate(${Math.random() * 360}deg)`;

                document.body.appendChild(element);

                // Clean up DOM after animation completes
                setTimeout(() => {
                    element.remove();
                }, 3000);
            }
        }, 120);
    }

    // ==========================================================================
    // CORE GAME LOGIC
    // ==========================================================================

    /**
     * Initializes a new secret number and resets screen stats & elements
     */
    function initGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        window.secretTarget = targetNumber;
        attemptsCount = 0;
        isGameOver = false;

        // Reset visual interface
        attemptsCounter.textContent = "0";
        attemptsCounter.classList.remove("pop-grow");
        
        guessInput.value = "";
        guessInput.disabled = false;
        guessBtn.disabled = false;
        restartBtn.classList.add("hidden");
        
        // Hide Hints
        hintPanel.classList.add("collapsed");
        hintText.textContent = "";

        // Reset feedback container
        gameMessage.textContent = "Waiting for your first guess...";
        gameMessage.className = "feedback-msg info-msg";

        // Reset Cat graphic & bubble
        setCatState("thinking", "Hmm... Make a guess!");
        
        // Render stats from storage
        renderStats();

        // Auto focus input
        setTimeout(() => {
            guessInput.focus();
        }, 100);
    }

    /**
     * Updates visual state, layout classes and speech notifications of cat sprite
     * @param {string} state - 'thinking', 'sad', 'angry', 'happy'
     * @param {string} bubbleMsg - Text for speech bubble
     */
    function setCatState(state, bubbleMsg) {
        // Clear previous animation classes
        catSprite.className = "cat-image";
        
        // Remove and force reflow to allow re-trigger of entry animations
        void catSprite.offsetWidth;

        if (state === "thinking") {
            catSprite.src = "assets/images/thinking.png";
            catSprite.alt = "A thinking cartoon cat sitting with claw on chin";
            catSprite.classList.add("bounce");
        } 
        else if (state === "sad") {
            catSprite.src = "assets/images/sad.png";
            catSprite.alt = "A sad cartoon cat with floppy ears and drooped head";
            catSprite.classList.add("sad-bounce");
        } 
        else if (state === "angry") {
            catSprite.src = "assets/images/angry.png";
            catSprite.alt = "An angry cartoon cat frowning with tiny steam puffs";
            catSprite.classList.add("shake");
        } 
        else if (state === "happy") {
            catSprite.src = "assets/images/happy.png";
            catSprite.alt = "A happy cartoon cat jumping with paws in celebration";
            catSprite.classList.add("jump");
        }

        // Apply speech bubble texts
        speechText.textContent = bubbleMsg;
    }

    /**
     * Renders local storage stats to DOM dashboard
     */
    function renderStats() {
        gamesWonDisplay.textContent = gamesWonCount;
        bestScoreDisplay.textContent = bestScoreValue !== null ? bestScoreValue : "--";
    }

    /**
     * Trigger visual invalid input alerts on screen
     * @param {string} errorMsg - Friendly user prompt
     */
    function triggerInputError(errorMsg) {
        playSound("click");
        
        // Trigger haptic vibration simulation on input
        guessInput.classList.remove("shake-input");
        void guessInput.offsetWidth; // Reflow
        guessInput.classList.add("shake-input");
        
        // Temporarily change cat state to angry for validation errors
        const previousMsg = speechText.textContent;
        setCatState("angry", errorMsg);
        
        gameMessage.textContent = errorMsg;
        gameMessage.className = "feedback-msg error-msg";

        setTimeout(() => {
            guessInput.classList.remove("shake-input");
        }, 500);
        
        // Revert cat representation back to thinking if game still active
        setTimeout(() => {
            if (!isGameOver && speechText.textContent === errorMsg) {
                setCatState("thinking", "Try entering a number again.");
            }
        }, 2200);
    }

    /**
     * Triggers the Collapsible Hint reveal after 5 wrong attempts
     */
    function revealHint() {
        if (targetNumber > 50) {
            hintText.textContent = "🐾 Inside clue: The mystery number is greater than 50.";
        } else {
            hintText.textContent = "🐾 Inside clue: The mystery number is less than or equal to 50.";
        }
        hintPanel.classList.remove("collapsed");
    }

    /**
     * Processes guess and operates game status loops
     */
    function submitGuess() {
        if (isGameOver) return;

        const inputVal = guessInput.value.trim();

        // 1. Validation Checks
        if (inputVal === "") {
            triggerInputError("Meow! Please enter a number.");
            return;
        }

        const numericGuess = Number(inputVal);

        if (isNaN(numericGuess) || !Number.isInteger(numericGuess)) {
            triggerInputError("Hiss! Whole numbers only!");
            return;
        }

        if (numericGuess < 1 || numericGuess > 100) {
            triggerInputError("Oops! Keep it between 1 and 100!");
            return;
        }

        // Increment attempts on valid choice
        attemptsCount++;
        attemptsCounter.textContent = attemptsCount;
        
        // Trigger click/pop sfx
        playSound("click");

        // 2. Main Choice Branches
        if (numericGuess === targetNumber) {
            // Winning Condition
            isGameOver = true;
            gamesWonCount++;
            localStorage.setItem("guess_cat_games_won", gamesWonCount);

            // Check and update best score
            if (bestScoreValue === null || attemptsCount < bestScoreValue) {
                bestScoreValue = attemptsCount;
                localStorage.setItem("guess_cat_best_score", bestScoreValue);
            }

            // Update stats
            renderStats();
            
            // Cat Reaction
            setCatState("happy", "Purr-fect! You got it! 🎉");
            playSound("win");
            triggerConfetti();

            // Message box
            gameMessage.textContent = `Correct! It took you ${attemptsCount} attempts. Play again!`;
            gameMessage.className = "feedback-msg success-msg";

            // Controls Shift
            guessInput.disabled = true;
            guessBtn.disabled = true;
            restartBtn.classList.remove("hidden");
        } 
        else if (numericGuess < targetNumber) {
            // Guess too Low
            setCatState("sad", "Purr... Too Low! 😿");
            playSound("low");

            gameMessage.textContent = `${numericGuess} is too low. Try a larger number!`;
            gameMessage.className = "feedback-msg warning-msg";
        } 
        else {
            // Guess too High
            setCatState("angry", "Hiss... Too High! 🙀");
            playSound("high");

            gameMessage.textContent = `${numericGuess} is too high. Try a smaller number!`;
            gameMessage.className = "feedback-msg warning-msg";
        }

        // Show hints after exactly 5 wrong guesses
        if (!isGameOver && attemptsCount === 5) {
            revealHint();
        }

        // Auto clear and keep focused
        if (!isGameOver) {
            guessInput.value = "";
            guessInput.focus();
        }
    }

    // ==========================================================================
    // INTERACTIVE DECORATION & LAYOUT EVENTS
    // ==========================================================================

    // Submit Action Triggers
    guessBtn.addEventListener("click", (e) => {
        createRippleEffect(e, guessBtn);
        submitGuess();
    });
    
    guessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            submitGuess();
        }
    });

    // Play Again button handler
    restartBtn.addEventListener("click", (e) => {
        createRippleEffect(e, restartBtn);
        
        // Show loading overlap briefly representing game restart animations
        loadingOverlay.textContent = "";
        loadingOverlay.classList.remove("hidden");
        
        const loader = document.createElement("div");
        loader.className = "loader-content";
        loader.innerHTML = `
            <span class="paws">🐾</span>
            <span class="loader-text">Shuffling numbers...</span>
        `;
        loadingOverlay.appendChild(loader);

        setTimeout(() => {
            initGame();
            loadingOverlay.classList.add("hidden");
        }, 900);
    });

    /**
     * Button click expanding ripple animation helper
     */
    function createRippleEffect(event, buttonElement) {
        const rippleContainer = buttonElement.querySelector(".btn-ripple-container");
        if (!rippleContainer) return;

        const circle = document.createElement("span");
        const rect = buttonElement.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.classList.add("ripple-span");

        // Remove previous ripple
        const prevCircle = rippleContainer.querySelector(".ripple-span");
        if (prevCircle) prevCircle.remove();

        rippleContainer.appendChild(circle);
    }

    // ==========================================================================
    // THEME HANDLING & INITIALIZATION
    // ==========================================================================

    // Initialize Theme State
    const savedTheme = localStorage.getItem("guess_cat_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("guess_cat_theme", nextTheme);
        playSound("click");
    });

    // Initial page load screen exit
    setTimeout(() => {
        loadingOverlay.classList.add("hidden");
        initGame();
    }, 1100);
});
