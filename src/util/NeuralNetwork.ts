import { rand, nrandv } from './util'

class Neuron {
    weights: number[]
    bias: number

    constructor({ weights, bias }: { weights: number[], bias: number }) {
        this.weights = weights
        this.bias = bias
    }

    static rand(dim: number): Neuron {
        return new this({
            weights: nrandv(dim),
            bias: rand(-1, 1)
        })
    }
}