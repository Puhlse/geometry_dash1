export class Player {
    constructor(game) {
        this.game = game;
        this.size = 30;

        this.reset();
    }

    reset() {
        this.x = 200;
        this.y = 0;

        this.vy = 0;
        this.mode = 'cube';

        this.rotation = 0;
        this.isGrounded = false;

        this.gravityCube = 1800;
        this.jumpForce = -700;
        this.terminalVelocityCube = 900;

        this.gravityShip = 900;
        this.flyForce = -1400;
        this.terminalVelocityShip = 400;
        this.terminalVelocityShipUp = -500;
    }

    setMode(mode) {
        this.mode = mode;
        this.rotation = 0;
        if (mode === 'ship') {
            this.vy = 0;
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
        if (!this.isGrounded) {
            this.vy += this.gravityCube * dt;
            if (this.vy > this.terminalVelocityCube) {
                this.vy = this.terminalVelocityCube;
            }
            this.rotation += 360 * dt;
        } else {
            this.vy = 0;
            let r = this.rotation % 360;
            if (r < 45 || r > 315) this.rotation = 0;
            else if (r < 135) this.rotation = 90;
            else if (r < 225) this.rotation = 180;
            else this.rotation = 270;
        }

        if (input.action && this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
        }

        this.y += this.vy * dt;
    }

    updateShip(dt, input) {
        if (input.action) {
            this.vy += this.flyForce * dt;
        } else {
            this.vy += this.gravityShip * dt;
        }

        if (this.vy > this.terminalVelocityShip) {
            this.vy = this.terminalVelocityShip;
        }
        if (this.vy < this.terminalVelocityShipUp) {
            this.vy = this.terminalVelocityShipUp;
        }

        this.rotation = this.vy * 0.05;

        this.y += this.vy * dt;
    }
}
