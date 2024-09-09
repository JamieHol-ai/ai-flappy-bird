let bird;
let pipes = [];
let score = 0;
let gameOver = false;

function setup() {
    createCanvas(400, 600);
    bird = new Bird();
    pipes.push(new Pipe());
}

function draw() {
    background(200);

    // Game logic
    if (!gameOver) {
        if (frameCount % 100 == 0) {
            pipes.push(new Pipe());
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();
            pipes[i].show();

            if (pipes[i].hits(bird)) {
                gameOver = true;
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
                score++;
            }
        }

        bird.update();
        bird.show();

        if (bird.offscreen()) {
            gameOver = true;
        }
    }

    // Display score and game over
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text(`Score: ${score}`, width/2, 40);

    if (gameOver) {
        text('Game Over', width / 2, height / 2);
        text('Press Space to Restart', width / 2, height / 2 + 40);
    }
}

function keyPressed() {
    if (key == ' ') {
        if (gameOver) {
            // Restart game
            bird = new Bird();
            pipes = [];
            score = 0;
            gameOver = false;
        } else {
            bird.jump();
        }
    }
}