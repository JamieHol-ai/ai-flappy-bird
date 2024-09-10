class Bird {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.velocity = 0;
        this.lift = -15;
        this.alive = true;
        this.score = 0;
        this.fitness = 0;
        this.brain = brain;
    }

    think(pipes) {
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
            // Create inputs for neural network
            let inputs = [
                this.y / height,
                closestPipe.top / height,
                (closestPipe.bottom + closestPipe.top) / height,
                closestPipe.x / width,
                this.velocity / 10
            ];

            // Get output from neural network
            let output = this.brain.activate(inputs);
            if (output[0] > 0.5) {
                this.jump();
            }
        }
    }

    jump() {
        this.velocity += this.lift;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.score++;

        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    show() {
        fill(255, 255, 0);
        ellipse(this.x, this.y, 32, 32);
    }

    offscreen() {
        return this.y >= height || this.y <= 0;
    }
}