# Guess The Number - Cat Reaction Game 🐾

A complete, professional, portfolio-ready web application where players guess a secret number between 1 and 100 while an interactive, animated cat reacts based on the player's performance. The cat uses animations, dialog, and meow audio signals to guide choices.

Designed with clean semantics, highly responsive interfaces, custom light/dark theme settings with Local Storage memory, input validation, and a bulletproof Web Audio API synthesis fallback that works perfectly even if local audio files don't resolve.

---

## 🎨 Design Features

- **Glassmorphism UI**: High-blur frosted glass overlays featuring thin translucent borders, neon accents, and soft drop shadows.
- **Dynamic Cat Reactions**:
  - **Thinking (Idle)**: Gentle vertical bouncing.
  - **Too High (Wrong choice)**: The cat turns angry, frowns, shakes its head, and triggers aggressive meowing.
  - **Too Low (Wrong choice)**: The cat turns sad, droops its ears, performs a confused vertical bobbing, and releases soft meow chirps.
  - **Correct (Winner!)**: The cat jumps excitedly, triggers joyful chirps, and throws colourful falling confetti particles across the viewport.
- **Responsive Layout**: Designed-first for all dimensions: Mobile web, iPad tablets, laptops, and massive widescreen layouts.
- **Accessibilities**: Screen-reader ready with explicit semantic DOM containers, descriptive `aria-label` elements, keyboard accessibility, and a smart, high-contrast dark theme.
- **State Memory**: Stores players' highest achievements (Best score based on minimum attempts) and total matches won inside the browser using Local Storage persistent keys.
- **Smart Audio Engine**: Auto-detects audio playback policy. If physical MP3 files return a block or 404, it launches custom Web Audio API oscillator nodes to synthesize clicks and vocal cat sounds in real time.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags structure (`<header>`, `<main>`, `<section>`, `<footer>`, `<dialog>`).
- **CSS3 Custom Properties**: Customized variables for dark mode and transitions. Built-in interactive keyframe key animations (Floating shapes, and cat states). No CSS frameworks (Clean vanilla CSS).
- **Vanilla JavaScript (ES6+)**: Custom game state machines, validation filters, DOM fragment confetti generators, responsive touch interactions, audio fallbacks. No external JS libraries.

---

## 📁 Folder Structure

```text
Guess-The-Number-Cat/
│
├── index.html          # Semantic HTML markup
├── style.css           # Styling styles, transitions, and keyframe animations
├── script.js           # Core physics, validation, audio synths, and state
├── .gitignore          # Build ignore configurations
└── README.md           # Documentation guide
│
└── assets/
    ├── images/
    │   ├── thinking.png # Default/idle cat state
    │   ├── sad.png      # Guess too low reaction
    │   ├── angry.png    # Guess too high reaction
    │   └── happy.png    # Correct guess celebration
    │
    └── sounds/
        ├── click.mp3    # Button tap pop tone (CodeSkulptor asset copy)
        ├── meow.mp3     # Soft meow (MIT App Inventor asset)
        ├── angry.mp3    # Angry meow
        └── happy.mp3    # Joyful/chirpy meow
```

---

## ⚙️ How to Install & Run

Since the application is 100% serverless, it does not require node installations or compilers.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Guess-The-Number-Cat.git
   ```
2. **Navigate into the directory**:
   ```bash
   cd Guess-The-Number-Cat
   ```
3. **Launch the game**:
   - Double-click `index.html` to open it in your browser.
   - Alternatively, serve it locally using VS Code's "Live Server" extension, Python's server command (`python -m http.server`), or Node's `npx serve`.

---

## 💡 Gameplay Instructions

1. Upon startup, a random secret target integer between **1 and 100** is generated. The cat starts in its **Thinking** state.
2. Enter your guess value into the input field and click **Guess!** or press your keyboard's **Enter** key.
3. The game sanitizes inputs to reject values outside boundary levels, letters, or special characters.
4. Based on the value, the cat reacts with animations, changes shapes, and outputs meowing sounds.
5. If you fail to get it correct within **5 attempts**, a dynamic, helpful hint will slide open at the bottom.
6. Once guessed correctly, the confetti triggers, your attempts score compares against the record best score, and the **Play Again** button appears. Click it to reset the game and start fresh!

---

## 🎁 Bonus: Free Asset Resources

For future iterations, customization, or replacement of icons, sounds, and media assets, these recommended repositories are completely free of charge:

- **Cat Illustrations / Vector Drawings**:
  - [Freepik (Vectors Category)](https://www.freepik.com/) - High-quality vector illustrations (requires attribution).
  - [Icons8 / Ouch](https://icons8.com/illustrations) - Playful character graphics for UI cards.
  - [unDraw](https://undraw.co/) - Elegant SVG illustrations with color adjustments.
- **Animated Cat GIFs & Lotties**:
  - [LottieFiles](https://lottiefiles.com/) - Lightweight json-based vector animations for web interfaces.
  - [Giphy](https://giphy.com/) & [Tenor](https://tenor.com/) - Cat expressions and GIFs.
- **Meow Sounds & General sound effects**:
  - [Freesound.org](https://freesound.org/) - Massive catalogue of CC-0 public domain sounds (search "meow").
  - [Orange Free Sounds](https://orangefreesounds.com/) - Direct download MP3 loops and short animal clips.
- **Sleek Fonts & UI Icons**:
  - [Google Fonts](https://fonts.google.com/) - Free web fonts. Playful fonts: `Quicksand`, `Fredoka`, `Comic Neue`.
  - [Boxicons](https://boxicons.com/) or [FontAwesome](https://fontawesome.com/) - Simple SVG icon libraries.

---

## 🚀 Future Improvements

- Add a difficulty setting dropdown (`Easy`: 1-50, `Medium`: 1-100, `Hard`: 1-250).
- Integrate an interactive scoreboard log keeping track of the last 5 game speeds/attempts.
- Add audio volume sliding adjustment components on the screen.
- Set up a customized meow voice changer (Pitched speed sliders).

---

## 📄 License & Release Notes

- **Version**: `Release 1.0` - Fully operational portfoli-ready launch.
- **License**: Distributed under the standard **MIT License**. Free to copy, alter, and republish.
