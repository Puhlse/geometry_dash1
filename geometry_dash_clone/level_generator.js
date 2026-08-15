class LevelGenerator {
    constructor() {
        this.blockSize = 30; // Matches player size
        this.obstacles = [];
        this.portals = [];
        this.groundY = 400; // Default ground level
        this.levelLength = 0;

        // Segments are predefined patterns of blocks (type, x_offset, y_offset)
        // 1 = solid block, 2 = spike (triangle pointing up)
        this.segments = {
            cube: [
                // 0: Flat
                [],
                // 1: Single Spike
                [{type: 2, x: 0, y: 1}],
                // 2: Double Spike
                [{type: 2, x: 0, y: 1}, {type: 2, x: 1, y: 1}],
                // 3: Triple Spike (requires precise jump)
                [{type: 2, x: 0, y: 1}, {type: 2, x: 1, y: 1}, {type: 2, x: 2, y: 1}],
                // 4: Block jump
                [{type: 1, x: 0, y: 1}, {type: 1, x: 1, y: 1}],
                // 5: Staircase up
                [{type: 1, x: 0, y: 1}, {type: 1, x: 1, y: 1}, {type: 1, x: 1, y: 2}, {type: 1, x: 2, y: 1}, {type: 1, x: 2, y: 2}, {type: 1, x: 2, y: 3}],
                // 6: Block with spike on top
                [{type: 1, x: 0, y: 1}, {type: 2, x: 0, y: 2}]
            ],
            ship: [
                // 0: Empty
                [],
                // 1: Pillars top and bottom
                [{type: 1, x: 0, y: 1}, {type: 1, x: 0, y: 2}, {type: 1, x: 0, y: 8}, {type: 1, x: 0, y: 9}],
                // 2: Sawblade obstacle (represented as block for now)
                [{type: 1, x: 0, y: 5}],
                // 3: Tunnel
                [{type: 1, x: 0, y: 1}, {type: 1, x: 0, y: 2}, {type: 1, x: 0, y: 3}, {type: 1, x: 0, y: 7}, {type: 1, x: 0, y: 8}, {type: 1, x: 0, y: 9}],
                // 4: Random scattered blocks
                [{type: 1, x: 0, y: 4}, {type: 1, x: 2, y: 6}, {type: 1, x: 4, y: 3}]
            ]
        };
    }

    generateRandomLevel(lengthBlocks = 300) {
        this.obstacles = [];
        this.portals = [];
        this.levelLength = lengthBlocks * this.blockSize;

        let currentX = 10; // Start placing obstacles after 10 blocks (safe zone)
        let currentMode = 'cube';

        while (currentX < lengthBlocks) {
            // Decide whether to place a portal (switch mode)
            // Roughly 20% chance to switch mode every 30 blocks, if we are far enough from end
            if (currentX > 30 && currentX < lengthBlocks - 30 && Math.random() < 0.2) {
                let nextMode = currentMode === 'cube' ? 'ship' : 'cube';
                // Add portal
                this.portals.push({
                    x: currentX * this.blockSize,
                    y: 3 * this.blockSize, // Floating in air a bit
                    mode: nextMode,
                    width: 20,
                    height: 60
                });

                currentMode = nextMode;
                currentX += 5; // buffer after portal
                continue;
            }

            // Pick a random segment based on current mode
            let modeSegments = this.segments[currentMode];
            // Ensure playability by not placing impossible things back to back.
            // We just pick randomly for now, assuming segments themselves are possible.
            let segmentIndex = Math.floor(Math.random() * modeSegments.length);
            let segment = modeSegments[segmentIndex];

            // Place segment
            for (let block of segment) {
                this.obstacles.push({
                    type: block.type,
                    x: (currentX + block.x) * this.blockSize,
                    y: block.y * this.blockSize, // y is calculated upwards from ground in logic
                    width: this.blockSize,
                    height: this.blockSize
                });
            }

            // Determine gap before next segment based on difficulty/mode
            let gap = 0;
            if (currentMode === 'cube') {
                // Gap after a jump needs to be large enough to land, but small enough to not be boring
                gap = Math.floor(Math.random() * 3) + 4; // 4 to 6 blocks
            } else {
                gap = Math.floor(Math.random() * 2) + 2; // 2 to 3 blocks
            }

            // Find max X in the segment to advance currentX
            let maxOffsetX = 0;
            for(let b of segment) {
                if (b.x > maxOffsetX) maxOffsetX = b.x;
            }

            currentX += maxOffsetX + gap;
        }

        // Add a giant wall at the end to mark completion
        this.obstacles.push({
            type: 1,
            x: this.levelLength,
            y: 500, // tall wall
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
