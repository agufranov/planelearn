import * as R from 'ramda'
import Environment, { Pole } from './Environment'
import Plane, { PlaneSimplePitchControls } from './Plane'
import { range, includes, intersect, sigma } from './util'
import { NeuralNetwork } from './NeuralNetwork'
import Environment from './Environment'

enum OutcomeResult {
    PoleCollision,
    Finish
}

export type SimulationOptions = {
    env: Environment,
    dt: number,
    networkLengths: number[]
}

export default class Simulation implements SimulationBase {
    env: Environment
    plane: Plane
    dt: number
    interval?: number
    data: Array<{ x: number, y: number }> = []
    controls: BinaryControls<PlaneSimplePitchControls>
    inputLength = 6
    onTick?: () => void
    isFinished = false
    nextPole?: Pole
    points: [number, number][] = []
    stopped = false
    onStop?: () => void
    neuralNetwork: NeuralNetwork
    score = 0
    t = 0

    constructor(env: Environment, dt: number, neuralNetwork: NeuralNetwork) {
        this.env = env
        this.controls = { up: false, down: false }
        this.plane = new Plane({ x: 0, y: env.height / 2, hd: 0, controls: this.controls })
        this.dt = dt
        this.neuralNetwork = neuralNetwork
        this.nextPole = this.getNextPole()
    }

    start() {
        // this.interval = setInterval(this.calc, this.dt)
        while (!this.stopped) {
            this.calc()
        }
    }

    private stop(outcome?: OutcomeResult, data?: any) {
        // clearInterval(this.interval)
        this.stopped = true
        this.score = this.getScore(outcome, data)
    }

    private getNextPole() {
        return this.env.poles.find(({ x }) => x > this.plane.oldX)
    }

    private updateControls() {
        const outputLayer = this.neuralNetwork.calc(this.getSensorData())
        const o1 = outputLayer[0]
        const o2 = outputLayer[1]
        this.controls.up = o1 > 0 && o2 > 0
        this.controls.down = o1 > 0 && o2 <= 0
    }

    calc = () => {
        const { plane, env } = this
        this.t += this.dt
        this.updateControls()
        plane.calc(this.dt)
        this.points.push([this.plane.x, this.plane.y])
        this.nextPole = this.getNextPole()
        if (!includes(0, env.height, plane.y)) {
            this.stop()
        } else if (plane.hd > Math.PI / 2 || plane.hd < - Math.PI / 2) {
            this.stop()
        } else {
            if (this.nextPole) {
                const poleLine = this.nextPole.getLine(this.env.height)
                if (intersect(...plane.getTrajectorySegment(), ...poleLine)) {
                    this.stop(OutcomeResult.PoleCollision, this.nextPole)
                }
            } else {
                this.stop(OutcomeResult.Finish)
            }
            if (!this.nextPole) {
                this.stop()
            }
            if (this.onTick) this.onTick()
        }
    }

    getSensorData() {
        const { nextPole, env, plane } = this
        return [
            nextPole ? (nextPole.x - plane.x) / env.maxGap : 0,
            plane.y / env.height,
            plane.hd / Math.PI,
            nextPole ? Number(nextPole.up) : 0,
            sigma(1 / Math.abs(Math.PI / 2 - plane.hd)),
            nextPole ? sigma(1 / (Math.max(nextPole.x - plane.x, 0.0001))) : 0
        ]
    }

    cloneMutated(type: number) {
        const mutatedNetwork = this.neuralNetwork.clone()
        mutatedNetwork.mutate(type)
        // const w1 = this.neuralNetwork.getAllWeights()
        // const w2 = mutatedNetwork.getAllWeights()
        // const i = w1.findIndex((v1, i) => v1 !== w2[i])
        // console.log(i, w1[i], w2[i])
        return new Simulation(this.env, this.dt, mutatedNetwork)
    }

    mix(sim: Simulation) {
        const mixedNetwork = this.neuralNetwork.mix(sim.neuralNetwork)
        return new Simulation(this.env, this.dt, mixedNetwork)
    }

    private getScore(outcomeResult?: OutcomeResult, data?: any) {
        const { plane, env } = this
        switch (outcomeResult) {
            case OutcomeResult.PoleCollision:
                const pole = data as Pole
                return data.x + 0.001 * (env.height - data.getDistanceToEdge(plane.y, env.height)) + 0.0000001 / this.t
            case OutcomeResult.Finish:
                return this.env.length * 2 + 1 / this.t
            default:
                return this.plane.x
        }
    }

    static createPopulation = (size: number, env: Environment, dt: number, networkLengths: number[]) => {
        const t0 = Date.now()
        // console.log(`calc: ${Date.now() - t0}ms`)
        return sims
    }

    static selectTop = (population: Simulation[]): Simulation[] => {
        const N = 5
        return R.pipe(
            R.sortBy(R.prop('score')),
            R.takeLast(N),
        )(population)
    }

}
