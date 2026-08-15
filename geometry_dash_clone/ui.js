class UI {
    constructor(game) {
        this.game = game;
        this.screens = document.querySelectorAll('.screen');

        // Buttons
        this.btnIconKit = document.getElementById('btn-icon-kit');
        this.btnPlayMain = document.getElementById('btn-play-main');
        this.btnConstruct = document.getElementById('btn-construct');

        this.btnRandomTab = document.getElementById('btn-random-tab');

        this.btnMakeLevel = document.getElementById('btn-make-level');
        this.btnPublicLevels = document.getElementById('btn-public-levels');

        this.btnRestart = document.getElementById('btn-restart');
        this.btnResume = document.getElementById('btn-resume');

        this.btnBacks = document.querySelectorAll('.btn-back');
        this.btnQuits = document.querySelectorAll('.btn-quit');

        // Dynamic Text
        this.attemptCountText = document.getElementById('attempt-count');
        this.progressPercentText = document.getElementById('progress-percent');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Main Menu
        this.btnIconKit.addEventListener('click', () => this.showScreen('screen-icon-kit'));
        this.btnPlayMain.addEventListener('click', () => this.showScreen('screen-main-levels'));
        this.btnConstruct.addEventListener('click', () => this.showScreen('screen-construct'));

        // Play Menu
        this.btnRandomTab.addEventListener('click', () => {
            this.hideAllScreens();
            this.game.startRandomLevel();
        });

        // Construct Menu
        this.btnMakeLevel.addEventListener('click', () => this.showScreen('screen-make-level'));
        this.btnPublicLevels.addEventListener('click', () => this.showScreen('screen-public-levels'));

        // In-Game / End Game
        this.btnRestart.addEventListener('click', () => {
            this.hideAllScreens();
            this.game.restart();
        });

        this.btnResume.addEventListener('click', () => {
            this.hideAllScreens();
            this.game.resume();
        });

        // Back / Quit Buttons
        this.btnBacks.forEach(btn => {
            btn.addEventListener('click', () => this.showScreen('screen-home'));
        });

        this.btnQuits.forEach(btn => {
            btn.addEventListener('click', () => {
                this.game.quit();
                this.showScreen('screen-home');
            });
        });

        // Pause event (handled in main.js, but UI exposes function)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.game.state === 'playing') {
                    this.game.pause();
                    this.showScreen('screen-pause');
                } else if (this.game.state === 'paused') {
                    this.hideAllScreens();
                    this.game.resume();
                }
            }
        });
    }

    showScreen(screenId) {
        this.screens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
    }

    hideAllScreens() {
        this.screens.forEach(screen => {
            screen.classList.remove('active');
        });
    }

    showGameOver(attempts, progress) {
        this.attemptCountText.innerText = attempts;
        this.progressPercentText.innerText = Math.floor(progress);
        this.showScreen('screen-game-over');
    }
}
