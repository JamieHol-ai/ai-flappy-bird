class Neat {
    constructor(populationSize) {
        this.populationSize = populationSize;
        this.mutationRate = 0.1;
        this.inputNodes = 5;
        this.hiddenNodes = 4;
        this.outputNodes = 1;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    createBrain() {
        const weights = this.createRandomWeights();
        return {
            weights: weights,
            activate: (inputs) => {
                // Ensure inputs are the correct length
                if (inputs.length !== this.inputNodes) {
                    console.error(`Expected ${this.inputNodes} inputs, but got ${inputs.length}`);
                    return [0]; // Return a default output
                }

                // Simple feedforward network
                let hidden = weights[0].map(neuronWeights =>
                    neuronWeights.reduce((sum, weight, i) => sum + weight * inputs[i], 0)
                ).map(this.sigmoid);

                let output = weights[1].map(neuronWeights =>
                    neuronWeights.reduce((sum, weight, i) => sum + weight * hidden[i], 0)
                ).map(this.sigmoid);

                return output;
            }
        };
    }

    createRandomWeights() {
        return [
            Array(this.hiddenNodes).fill().map(() =>
                Array(this.inputNodes).fill().map(() => Math.random() * 2 - 1)
            ),
            Array(this.outputNodes).fill().map(() =>
                Array(this.hiddenNodes).fill().map(() => Math.random() * 2 - 1)
            )
        ];
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    evolve(birds) {
        // Calculate fitness
        let totalScore = birds.reduce((sum, bird) => sum + bird.score, 0);
        birds.forEach(bird => bird.fitness = bird.score / totalScore);

        // Select parents and create new population
        let newPopulation = [];
        for (let i = 0; i < this.populationSize; i++) {
            let parent1 = this.selectParent(birds);
            let parent2 = this.selectParent(birds);
            let child = this.crossover(parent1, parent2);
            this.mutate(child);
            newPopulation.push(child);
        }

        // Replace old population with new population
        birds.forEach((bird, i) => bird.brain = newPopulation[i]);
    }

    selectParent(birds) {
        let r = Math.random();
        let sum = 0;
        for (let bird of birds) {
            sum += bird.fitness;
            if (r <= sum) {
                return bird;
            }
        }
        return birds[birds.length - 1];
    }

    crossover(parent1, parent2) {
        let childBrain = this.createBrain();
        childBrain.weights = childBrain.weights.map((layer, i) =>
            layer.map((weights, j) =>
                weights.map((_, k) =>
                    Math.random() < 0.5 ? parent1.brain.weights[i][j][k] : parent2.brain.weights[i][j][k]
                )
            )
        );
        return childBrain;
    }

    mutate(brain) {
        brain.weights = brain.weights.map(layer =>
            layer.map(weights =>
                weights.map(w =>
                    Math.random() < this.mutationRate ? w + (Math.random() * 2 - 1) * 0.1 : w
                )
            )
        );
    }
}