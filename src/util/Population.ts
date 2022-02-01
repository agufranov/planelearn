import * as R from 'ramda'
import Simulation, { SimulationOptions } from './Simulation'
import { NeuralNetwork } from './NeuralNetwork'
import { range, randFrom } from './util'
import Environment from './Environment'

export default class Population {
    simOptions: SimulationOptions

    popOptions = {
        mutations: {
            0: 10,
            1: 10,
            2: 10,
            3: 10
        },
        newSize: 100,
        top: 20
    }

    simulations: Simulation[]
    score: number
    epoch: number

    constructor(simOptions: SimulationOptions, simulations: Simulation[], epoch: number = 0) {
        this.simOptions = simOptions
        this.simulations = simulations
        this.epoch = epoch
        this.simulations.forEach(sim => sim.start())
        this.simulations = R.sortWith([R.descend(R.prop('score'))])(this.simulations)
        this.score = R.head(this.simulations)!.score
        this.top = this.getTop()
    }

    getTop() {
        return R.pipe(
            R.groupWith((s1, s2) => s1.score === s2.score),
            R.take(this.popOptions.top),
            R.map(R.path([0]))
        )(this.simulations)
    }

    generateNext = (env?: Environment) => {
        let simOptions = this.simOptions
        if (env) { simOptions.env = env }

        // console.log(top.map(s => s.score))
        const mixedTop = this.top.map(sim => sim.mix(randFrom(this.simulations)))

        const mutated = Object.entries(this.popOptions.mutations).flatMap(([ type, amount ]) =>
            this.top.flatMap(sim => range(amount).map(() => sim.cloneMutated(Number(type)))))

        const new_ = Population.generateSims(this.popOptions.newSize, simOptions)
        return new Population(simOptions, [...mixedTop, ...mutated, ...new_], this.epoch + 1)
    }

    save() {
        localStorage.saved = JSON.stringify({
            networksData: this.simulations.map(sim => sim.neuralNetwork.serialize()),
            networkLengths: this.simOptions.networkLengths,
            epoch: this.epoch
        })
    }

    static load(env: Environment, dt: number) {
        // try {
            const { networksData, networkLengths, epoch } = JSON.parse(localStorage.saved)
            const networks = networksData.map(d => NeuralNetwork.deserialize(d))
            const simOptions = { env, dt, networkLengths }
            return new Population(simOptions, networks.map(network => this.generateSimWithNetwork(network, simOptions)), epoch)
        // } catch(e) {
        //     throw new Error('Cannot load population')
        // }
    }

    static generateSimWithNetwork(network: NeuralNetwork, simOptions: SimulationOptions) {
        return new Simulation(simOptions.env, simOptions.dt, network)
    }

    static generateSims(size: number, simOptions: SimulationOptions) {
        return range(size).map(() => this.generateSimWithNetwork(NeuralNetwork.generate(6, simOptions.networkLengths), simOptions))
    }

    static generate(size: number, simOptions: SimulationOptions) {
        return new Population(simOptions, this.generateSims(size, simOptions))
    }
}