class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.2;
        this.velocity = 0;
    }

    jump() {
        this.velocity = -5;
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
    }

    show() {
        fill(255, 255, 0);
        ellipse(this.x, this.y, 32, 32);
    }

    offscreen() {
        return this.y >= height || this.y <= 0;
    }
}