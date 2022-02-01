import * as R from 'ramda'
import { rand, irand, nrandv, randFrom, randSet, randSetWith, range, normalize } from './util'

const clampBias = R.clamp(-1, 1)

export class Neuron {
    weights: number[]
    bias: number

    constructor({ weights, bias }: { weights: number[], bias: number }) {
        this.weights = weights
        this.bias = bias
    }

    mutate(type: number) {
        // randSetWith(this.weights, w => w * rand(0.8, 1.2))
        const mutations = {
            0: {
                w: w => rand(-2, 2),
                b: b => rand(-2, 2)
            },
            1: {
                w: w => w * rand(0.5, 2),
                b: b => clampBias(b * rand(0.5, 2) + rand(-1, 1))
            },
            2: {
                w: w => w * rand(0.99, 1.01),
                b: b => clampBias(b * rand(0.99, 1.01) + rand(-0.01, 0.01))
            },
            3: {
                w: w => w * rand(0.999, 1.001),
                b: b => clampBias(b * rand(0.990, 1.001) + rand(-0.001, 0.001))
            }
        }
        randSetWith(this.weights, mutations[type].w)
        this.bias = mutations[type].b(this.bias)
        this.weights = normalize(this.weights)
    }
    
    clone() {
        return new Neuron({
            weights: [...this.weights],
            bias: this.bias
        })
    }

    calc(inputs: number[]) {
        let sum = this.bias
        for(let i in this.weights) {
            sum += this.weights[i] * inputs[i]
        }
        return sum
    }

    serialize() {
        return [...this.weights, this.bias]
    }

    static deserialize = (data: number[]) => {
        return new this({ weights: data.slice(0, -1), bias: data.slice(-1)[0] })
    }

    static rand(inputLength: number): Neuron {
        return new this({
            weights: nrandv(inputLength),
            bias: rand(-1, 1)
        })
    }
}

export class NeuralNetwork {
    layers: Neuron[][]

    constructor(layers: Neuron[][]) {
        if (!layers.length) {
            throw new Error
        }
        this.layers = layers
    }

    calc(inputs: number[]) {
        let prevLayerOutput = inputs
        let result: number[] = []
        for(let layer of this.layers) {
            for(let neuron of layer) {
                result.push(neuron.calc(prevLayerOutput))
            }
            prevLayerOutput = result
        }
        return result
    }

    mutate(type: number) {
        const neuron = <Neuron>R.pipe(
            randFrom,
            randFrom,
        )(this.layers)
        neuron.mutate(type)
    }

    mapNeurons<T>(cb: (neuron: Neuron, neuronIndex: number, layerIndex: number) => T): T[][] {
        return this.layers.map((layer, layerIndex) => layer.map((neuron, neuronIndex) => cb(neuron, neuronIndex, layerIndex)))
    }

    clone() {
        return new NeuralNetwork(this.layers.map(layer => layer.map(neuron => neuron.clone())))
    }

    serialize() {
        return this.mapNeurons(neuron => neuron.serialize())
    }

    mix(n: NeuralNetwork) {
        const others = n.mapNeurons(R.identity)
        return new NeuralNetwork(this.mapNeurons((neuron, neuronIndex, layerIndex) => {
            const otherNeuron = others[layerIndex][neuronIndex]
            return rand() > 0.5 ? neuron : otherNeuron
        }))
    }

    static deserialize(layersData: any) {
        return new this(layersData.map(layer => layer.map(Neuron.deserialize)))
    }

    static generateLayer(inputLength: number, dim: number): Neuron[] {
        return range(dim).map(() => Neuron.rand(inputLength))
    }

    static generate(inputLength: number, lengths: number[]) {
        const layers = []
        let prevLayerLength = inputLength
        for (let length of lengths) {
            layers.push(this.generateLayer(prevLayerLength, length))
            prevLayerLength = length
        }
        return new NeuralNetwork(layers)
    }
}