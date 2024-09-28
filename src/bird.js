class Bird {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.velocity = 0;
        this.lift = -8;
        this.alive = true;
        this.score = 0;
        this.fitness = 0;
        this.brain = brain || neat.createBrain();
    }

    think(pipes) {
        if (!this.brain || typeof this.brain.activate !== 'function') {
            console.error('Invalid brain structure');
            return;
        }

        // Find the closest pipe
        let closestPipe = null;
        let closestDist = Infinity;
        for (let pipe of pipes) {
            let d = pipe.x + pipe.w - this.x;
            if (d < closestDist && d > 0) {
                closestPipe = pipe;
                closestDist = d;
            }
        }

        if (closestPipe) {
            let inputs = [
                this.y / height,
                closestPipe.top / height,
                (closestPipe.bottom + closestPipe.top) / (2 * height),
                closestPipe.x / width,
                this.velocity / 10
            ];

            let output = this.brain.activate(inputs);
            if (output[0] > 0.5) {
                this.jump();
            }
        }
    }

    jump() {
        this.velocity = this.lift;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
        this.score++;
    }

    show() {
        fill(255, 255, 0);
        ellipse(this.x, this.y, 32, 32);
    }

    offscreen() {
        return this.y >= height || this.y <= 0;
    }
}