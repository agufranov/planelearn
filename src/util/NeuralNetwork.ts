import { rand, normalize } from './util'

class Neuron {
    weights: number[]

    constructor({ weights }: { weights: number[] }) {
        this.weights = weights
    }

    static rand() {
    }
}