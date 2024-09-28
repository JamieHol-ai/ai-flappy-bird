let bird;
let birds = [];
let pipes = [];
let neat;
let generation = 0;
const POPULATION_SIZE = 200;
let gameMode = 'menu';
let trainedBrain = null;
let pipesPassed = 0;

function setup() {
    let canvas = createCanvas(400, 600);
    canvas.parent('gameCanvas');
    neat = new Neat(POPULATION_SIZE);
    resetGame();
}

function draw() {
    background(200);

    switch (gameMode) {
        case 'menu':
            showMenu();
            break;
        case 'play':
            playGame();
            break;
        case 'trainAI':
            trainAI();
            break;
        case 'showUntrained':
            showAI(neat.createBrain());
            break;
        case 'showTrained':
            showAI(trainedBrain);
            break;
    }
    textAlign(LEFT);
    if (gameMode !== 'menu') {
        displayScore();
    }
}

function showMenu() {
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text("Select a mode from the buttons above", width / 2, height / 2);
}

function playGame() {
    for (let pipe of pipes) {
        pipe.update();
        pipe.show();


        if (pipe.offscreen()) {
            pipes.splice(pipes.indexOf(pipe), 1);
            pipesPassed++;
        }
    }

    bird.update();
    bird.show();

    if (frameCount % 150 == 0) {
        pipes.push(new Pipe());
    }

    for (let pipe of pipes) {
        if (pipe.hits(bird)) {
            resetGame();
        }
    }

    if (bird.offscreen()) {
        resetGame();
    }

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => !pipe.offscreen());
}

function trainAI() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            pipesPassed++; // Increment score when a pipe is passed
        }
    }

    if (frameCount % 150 == 0) {
        pipes.push(new Pipe());
    }

    let bestBird = null;
    let bestScore = 0;

    for (let bird of birds) {
        if (bird.alive) {
            bird.think(pipes);
            bird.update();
            bird.show();

            for (let pipe of pipes) {
                if (pipe.hits(bird)) {
                    bird.alive = false;
                }
            }

            if (bird.offscreen()) {
                bird.alive = false;
            }

            if (bird.score > bestScore) {
                bestScore = bird.score;
                bestBird = bird;
            }
        }
    }

    if (pipesPassed > 10 && !trainedBrain && bestBird !== null) {
        trainedBrain = bestBird.brain;
        console.log("AI trained! Score:", pipesPassed);

        let trainedBrainData = trainedBrain.weights;

        saveJSON(trainedBrainData, 'data/trained_ai.json');
    }

    if (birds.every(bird => !bird.alive)) {
        nextGeneration();
    }

    fill(0);
    textSize(24);

    text(`Generation: ${generation}`, 10, 60);
    text(`Alive: ${birds.filter(b => b.alive).length}`, 10, 90);
}

function showAI(brain) {
    if (!bird) {
        bird = new Bird(brain);
    }

    for (let pipe of pipes) {
        pipe.update();
        pipe.show();
        if (pipe.offscreen()) {
            pipes.splice(pipes.indexOf(pipe), 1);
            pipesPassed++;
        }
    }

    bird.think(pipes);
    bird.update();
    bird.show();

    if (frameCount % 150 == 0) {
        pipes.push(new Pipe());
    }

    for (let pipe of pipes) {
        if (pipe.hits(bird)) {
            resetGame();
            bird = new Bird(brain);
        }
    }

    if (bird.offscreen()) {
        resetGame();
        bird = new Bird(brain);
    }

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => !pipe.offscreen());
}

function resetGame() {
    bird = new Bird();
    pipes = [];
    frameCount = 0;
    pipesPassed = 0;
    pipes.push(new Pipe());
}

function nextGeneration() {
    generation++;
    neat.evolve(birds);
    birds = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        birds.push(new Bird(neat.createBrain()));
    }
    pipes = [];
    pipes.push(new Pipe());
    pipesPassed = 0;
    frameCount = 0;
}

function setMode(mode) {
    gameMode = mode;
    resetGame();
    if (mode === 'trainAI') {
        birds = [];
        for (let i = 0; i < POPULATION_SIZE; i++) {
            birds.push(new Bird(neat.createBrain()));
        }
        generation = 0;
    } else if (mode === 'showUntrained') {
        bird = new Bird(neat.createBrain());
    } else if (mode === 'showTrained') {
        loadJSON('data/trained_ai.json',
            function (loadedBrain) {
                console.log('Loaded brain:', loadedBrain);
                let weights = extractWeights(loadedBrain);
                if (weights) {
                    trainedBrain = neat.createBrainFromWeights(weights);
                    bird = new Bird(trainedBrain);
                    console.log('Trained brain created successfully');
                } else {
                    console.error('Invalid brain data structure');
                    gameMode = 'menu';
                }
            },
            function (error) {
                console.error('Error loading trained AI:', error);
                gameMode = 'menu';
            }
        );
    }
}

window.setMode = setMode;

function extractWeights(loadedBrain) {
    // Check if loadedBrain is directly the weights array
    if (Array.isArray(loadedBrain) && loadedBrain.length === 2) {
        return loadedBrain;
    }
    // Check if weights are a property of loadedBrain
    if (loadedBrain && Array.isArray(loadedBrain.weights) && loadedBrain.weights.length === 2) {
        return loadedBrain.weights;
    }
    // If weights are nested deeper or in a different structure, you might need to add more checks here
    console.error('Unexpected brain data structure:', loadedBrain);
    return null;
}

function keyPressed() {
    if (key == ' ' && gameMode === 'play') {
        bird.jump();
    }
}

function displayScore() {
    fill(0);
    textSize(24);
    text(`Score: ${pipesPassed}`, 10, 30);
}