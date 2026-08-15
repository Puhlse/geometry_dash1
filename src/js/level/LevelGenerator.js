export class LevelGenerator {
    constructor() {
        this.blockSize = 30;
        this.obstacles = [];
        this.portals = [];
        this.groundY = 400;
        this.levelLength = 0;

        this.segments = {
            cube: [
                [],
                [{type: 2, x: 0, y: 1}],
                [{type: 2, x: 0, y: 1}, {type: 2, x: 1, y: 1}],
                [{type: 2, x: 0, y: 1}, {type: 2, x: 1, y: 1}, {type: 2, x: 2, y: 1}],
                [{type: 1, x: 0, y: 1}, {type: 1, x: 1, y: 1}],
                [{type: 1, x: 0, y: 1}, {type: 1, x: 1, y: 1}, {type: 1, x: 1, y: 2}, {type: 1, x: 2, y: 1}, {type: 1, x: 2, y: 2}, {type: 1, x: 2, y: 3}],
                [{type: 1, x: 0, y: 1}, {type: 2, x: 0, y: 2}]
            ],
            ship: [
                [],
                [{type: 1, x: 0, y: 1}, {type: 1, x: 0, y: 2}, {type: 1, x: 0, y: 8}, {type: 1, x: 0, y: 9}],
                [{type: 1, x: 0, y: 5}],
                [{type: 1, x: 0, y: 1}, {type: 1, x: 0, y: 2}, {type: 1, x: 0, y: 3}, {type: 1, x: 0, y: 7}, {type: 1, x: 0, y: 8}, {type: 1, x: 0, y: 9}],
                [{type: 1, x: 0, y: 4}, {type: 1, x: 2, y: 6}, {type: 1, x: 4, y: 3}]
            ]
        };
    }

    generateRandomLevel(lengthBlocks = 300) {
        this.obstacles = [];
        this.portals = [];
        this.levelLength = lengthBlocks * this.blockSize;

        let currentX = 10;
        let currentMode = 'cube';

        while (currentX < lengthBlocks) {
            if (currentX > 30 && currentX < lengthBlocks - 30 && Math.random() < 0.2) {
                let nextMode = currentMode === 'cube' ? 'ship' : 'cube';
                this.portals.push({
                    x: currentX * this.blockSize,
                    y: 3 * this.blockSize,
                    mode: nextMode,
                    width: 20,
                    height: 60
                });

                currentMode = nextMode;
                currentX += 5;
                continue;
            }

            let modeSegments = this.segments[currentMode];
            let segmentIndex = Math.floor(Math.random() * modeSegments.length);
            let segment = modeSegments[segmentIndex];

            for (let block of segment) {
                this.obstacles.push({
                    type: block.type,
                    x: (currentX + block.x) * this.blockSize,
                    y: block.y * this.blockSize,
                    width: this.blockSize,
                    height: this.blockSize
                });
            }

            let gap = 0;
            if (currentMode === 'cube') {
                gap = Math.floor(Math.random() * 3) + 4;
            } else {
                gap = Math.floor(Math.random() * 2) + 2;
            }

            let maxOffsetX = 0;
            for(let b of segment) {
                if (b.x > maxOffsetX) maxOffsetX = b.x;
            }

            currentX += maxOffsetX + gap;
        }

        this.obstacles.push({
            type: 1,
            x: this.levelLength,
            y: 500,
            width: this.blockSize * 2,
            height: 1000
        });

        return {
            obstacles: this.obstacles,
            portals: this.portals,
            length: this.levelLength
        };
    }
}
