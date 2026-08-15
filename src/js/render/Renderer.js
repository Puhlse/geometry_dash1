export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.colorGround = '#1a3c75';
        this.colorGroundLine = '#ffffff';
        this.colorBlock = '#000000';
        this.colorBlockOutline = '#ffffff';
        this.colorSpike = '#000000';
        this.colorSpikeOutline = '#ffffff';
        this.colorPlayerCube = '#ffff00';
        this.colorPlayerShip = '#ff00ff';
        this.colorPortalCube = '#00ff00';
        this.colorPortalShip = '#ff00ff';

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        let grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, '#2a5298');
        grad.addColorStop(1, '#1e3c72');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(gameState, levelData) {
        this.clear();

        const camX = gameState.cameraX;
        const groundY = gameState.groundY;

        this.ctx.save();
        this.ctx.translate(-camX, 0);

        this.ctx.fillStyle = this.colorGround;
        this.ctx.fillRect(camX, groundY, this.canvas.width, this.canvas.height - groundY);

        this.ctx.strokeStyle = this.colorGroundLine;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(camX, groundY);
        this.ctx.lineTo(camX + this.canvas.width, groundY);
        this.ctx.stroke();

        for (let portal of levelData.portals) {
            let px = portal.x;
            let py = groundY - portal.y;

            this.ctx.fillStyle = portal.mode === 'cube' ? this.colorPortalCube : this.colorPortalShip;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.ctx.ellipse(px + portal.width/2, py - portal.height/2, portal.width/2, portal.height/2, 0, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        for (let obs of levelData.obstacles) {
            let ox = obs.x;
            let oy = groundY - obs.y;

            if (obs.type === 1) {
                this.ctx.fillStyle = this.colorBlock;
                this.ctx.fillRect(ox, oy - obs.height, obs.width, obs.height);
                this.ctx.strokeStyle = this.colorBlockOutline;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(ox, oy - obs.height, obs.width, obs.height);

                this.ctx.beginPath();
                this.ctx.moveTo(ox, oy - obs.height);
                this.ctx.lineTo(ox + obs.width, oy);
                this.ctx.moveTo(ox + obs.width, oy - obs.height);
                this.ctx.lineTo(ox, oy);
                this.ctx.stroke();

            } else if (obs.type === 2) {
                this.ctx.fillStyle = this.colorSpike;
                this.ctx.beginPath();
                this.ctx.moveTo(ox, oy);
                this.ctx.lineTo(ox + obs.width / 2, oy - obs.height);
                this.ctx.lineTo(ox + obs.width, oy);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = this.colorSpikeOutline;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }

        let p = gameState.player;
        let px = camX + p.x;
        let py = groundY - p.y;
        let s = p.size;

        this.ctx.save();
        this.ctx.translate(px + s/2, py - s/2);
        this.ctx.rotate(p.rotation * Math.PI / 180);

        if (p.mode === 'cube') {
            this.ctx.fillStyle = this.colorPlayerCube;
            this.ctx.fillRect(-s/2, -s/2, s, s);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(-s/2, -s/2, s, s);

            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(-s/4, -s/4, 4, 4);
            this.ctx.fillRect(s/8, -s/4, 4, 4);
            this.ctx.fillRect(-s/4, s/8, s/2, 2);

        } else if (p.mode === 'ship') {
            this.ctx.fillStyle = this.colorPlayerShip;

            this.ctx.beginPath();
            this.ctx.moveTo(-s, 0);
            this.ctx.lineTo(s, -s/2);
            this.ctx.lineTo(s, s/2);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = this.colorPlayerCube;
            this.ctx.fillRect(-s/4, -s/4, s/2, s/2);
            this.ctx.strokeRect(-s/4, -s/4, s/2, s/2);
        }

        this.ctx.restore();
        this.ctx.restore();

        if (gameState.state === 'playing') {
            let progress = Math.min(100, (gameState.cameraX / levelData.length) * 100);

            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(this.canvas.width/2 - 150, 20, 300, 15);

            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(this.canvas.width/2 - 150, 20, 3 * progress, 15);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`${Math.floor(progress)}%`, this.canvas.width/2 + 155, 32);
        }
    }
}
