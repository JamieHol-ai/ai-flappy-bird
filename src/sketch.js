let birds = [];
let pipes = [];
let neat;
let generation = 0;
const POPULATION_SIZE = 200;

function setup() {
    createCanvas(400, 600);
    neat = new Neat(POPULATION_SIZE);
    resetGame();
}

function draw() {
    background(200);

    // Update and show pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }

    // Add new pipes
    if (frameCount % 100 == 0) {
        pipes.push(new Pipe());
    }

    // Update and show birds
    for (let bird of birds) {
        if (bird.alive) {
            bird.think(pipes);
            bird.update();
            bird.show();

            // Check for collisions
            for (let pipe of pipes) {
                if (pipe.hits(bird)) {
                    bird.alive = false;
                }
            }

            if (bird.offscreen()) {
                bird.alive = false;
            }
        }
    }

    // Check if all birds are dead
    if (birds.every(bird => !bird.alive)) {
        nextGeneration();
    }

    // Display info
    fill(0);
    textSize(24);
    text(`Generation: ${generation}`, 10, 30);
    text(`Alive: ${birds.filter(b => b.alive).length}`, 10, 60);
}

function resetGame() {
    birds = [];
    pipes = [];
    frameCount = 0;
    for (let i = 0; i < POPULATION_SIZE; i++) {
        birds.push(new Bird(neat.createBrain()));
    }
    pipes.push(new Pipe());
}

function nextGeneration() {
    generation++;
    neat.evolve(birds);
    resetGame();
}