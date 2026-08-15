import { UIManager } from './ui/UIManager.js';
import { Player } from './physics/Player.js';
import { LevelGenerator } from './level/LevelGenerator.js';
import { Renderer } from './render/Renderer.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ui = new UIManager(this);
        this.renderer = new Renderer(this.canvas);
        this.generator = new LevelGenerator();
        this.player = new Player(this);

        this.state = 'menu';
        this.lastTime = 0;
        this.cameraX = 0;
        this.scrollSpeed = 400;
        this.groundY = this.canvas.height * 0.8;

        this.levelData = null;
        this.attempts = 0;

        this.input = { action: false };

        this.setupInput();

        this.ui.showScreen('screen-home');

        requestAnimationFrame((t) => this.loop(t));
    }

    setupInput() {
        const handleDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.type === 'mousedown' || e.type === 'touchstart') {
                this.input.action = true;
            }
        };
        const handleUp = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.type === 'mouseup' || e.type === 'touchend') {
                this.input.action = false;
            }
        };

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        window.addEventListener('mousedown', handleDown);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchstart', handleDown, {passive: false});
        window.addEventListener('touchend', handleUp);
    }

    startRandomLevel() {
        this.levelData = this.generator.generateRandomLevel(400);
        this.attempts = 1;
        this.resetRun();
    }

    restart() {
        this.attempts++;
        this.resetRun();
    }

    resetRun() {
        this.state = 'playing';
        this.player.reset();
        this.cameraX = 0;
        this.input.action = false;
        this.groundY = this.canvas.height * 0.8;
    }

    pause() {
        this.state = 'paused';
    }

    resume() {
        this.state = 'playing';
        this.lastTime = performance.now();
    }

    quit() {
        this.state = 'menu';
    }

    die() {
        this.state = 'gameover';
        let progress = (this.cameraX / this.levelData.length) * 100;
        if (progress > 100) progress = 100;
        this.ui.showGameOver(this.attempts, progress);
    }

    checkCollisions() {
        let pSize = this.player.size;
        let pLeft = this.cameraX + this.player.x;
        let pRight = pLeft + pSize;
        let pBottom = this.player.y;
        let pTop = pBottom + pSize;

        let hitboxOffset = 4;
        let hbLeft = pLeft + hitboxOffset;
        let hbRight = pRight - hitboxOffset;
        let hbBottom = pBottom + hitboxOffset;
        let hbTop = pTop - hitboxOffset;

        this.player.isGrounded = false;
        if (this.player.y <= 0) {
            this.player.y = 0;
            this.player.isGrounded = true;
        }

        for (let i=0; i<this.levelData.portals.length; i++) {
            let portal = this.levelData.portals[i];
            let poLeft = portal.x;
            let poRight = portal.x + portal.width;

            if (pRight > poLeft && pLeft < poRight) {
                if (this.player.mode !== portal.mode) {
                    this.player.setMode(portal.mode);
                }
            }
        }

        for (let obs of this.levelData.obstacles) {
            if (obs.x > pRight + 100 || obs.x + obs.width < pLeft - 100) continue;

            let obsLeft = obs.x;
            let obsRight = obs.x + obs.width;
            let obsBottom = obs.y;
            let obsTop = obs.y + obs.height;

            if (hbRight > obsLeft && hbLeft < obsRight && hbTop > obsBottom && hbBottom < obsTop) {
                if (obs.type === 2) {
                    this.die();
                    return;
                }

                if (obs.type === 1) {
                    if (this.player.vy <= 0 && pBottom >= obsTop - 10 && this.player.mode === 'cube') {
                        this.player.y = obsTop;
                        this.player.vy = 0;
                        this.player.isGrounded = true;
                    } else {
                        this.die();
                        return;
                    }
                }
            }
        }

        if (this.player.mode === 'ship') {
            let maxScreenHeight = this.groundY;
            if (this.player.y > maxScreenHeight - pSize) {
                this.player.y = maxScreenHeight - pSize;
                this.player.vy = 0;
            }
        }
    }

    loop(timestamp) {
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (dt > 0.1) dt = 0.1;

        if (this.state === 'playing') {
            this.cameraX += this.scrollSpeed * dt;

            if (this.cameraX > this.levelData.length) {
                this.state = 'gameover';
                this.ui.showGameOver(this.attempts, 100);
            } else {
                this.player.update(dt, this.input);
                this.checkCollisions();
            }
        }

        if (this.state !== 'menu' && this.levelData) {
            let stateData = {
                cameraX: this.cameraX,
                groundY: this.groundY,
                player: this.player,
                state: this.state
            };
            this.renderer.draw(stateData, this.levelData);
        } else if (this.state === 'menu') {
            this.renderer.clear();
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}

window.onload = () => {
    new Game();
};
