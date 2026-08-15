class Player {
    constructor(game) {
        this.game = game;
        this.size = 30; // standard GD cube size

        this.reset();
    }

    reset() {
        this.x = 200; // Fixed horizontal position relative to screen, world scrolls around player
        this.y = 0;   // Start on ground

        this.vy = 0;
        this.mode = 'cube'; // 'cube' or 'ship'

        this.rotation = 0;
        this.isGrounded = false;

        // Cube Physics
        this.gravityCube = 1800; // pixels per second squared
        this.jumpForce = -700;   // pixels per second (negative is up)
        this.terminalVelocityCube = 900;

        // Ship Physics
        this.gravityShip = 900;
        this.flyForce = -1400; // Force applied when holding
        this.terminalVelocityShip = 400;
        this.terminalVelocityShipUp = -500;
    }

    setMode(mode) {
        this.mode = mode;
        this.rotation = 0;
        if (mode === 'ship') {
            this.vy = 0; // stabilize when entering portal
        }
    }

    update(dt, input) {
        if (this.mode === 'cube') {
            this.updateCube(dt, input);
        } else if (this.mode === 'ship') {
            this.updateShip(dt, input);
        }
    }

    updateCube(dt, input) {
        // Apply Gravity
        if (!this.isGrounded) {
            this.vy += this.gravityCube * dt;
            if (this.vy > this.terminalVelocityCube) {
                this.vy = this.terminalVelocityCube;
            }
            // Rotate while in air
            this.rotation += 360 * dt;
        } else {
            this.vy = 0;
            // Snap rotation to nearest 90 degrees when grounded
            let r = this.rotation % 360;
            if (r < 45 || r > 315) this.rotation = 0;
            else if (r < 135) this.rotation = 90;
            else if (r < 225) this.rotation = 180;
            else this.rotation = 270;
        }

        // Jump
        if (input.action && this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
        }

        this.y += this.vy * dt;
    }

    updateShip(dt, input) {
        // Continuous upward force when held
        if (input.action) {
            this.vy += this.flyForce * dt;
        } else {
            this.vy += this.gravityShip * dt;
        }

        // Clamp velocity
        if (this.vy > this.terminalVelocityShip) {
            this.vy = this.terminalVelocityShip;
        }
        if (this.vy < this.terminalVelocityShipUp) {
            this.vy = this.terminalVelocityShipUp;
        }

        // Rotation based on velocity
        this.rotation = this.vy * 0.05;

        this.y += this.vy * dt;
    }
}
