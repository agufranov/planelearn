import Environment, { Pole } from './Environment'
import Plane, { PlaneSimplePitchControls } from './Plane'
import { rand, includes, nrandv } from './util'

import * as R from 'ramda'
const q = nrandv(3)
console.log(q, R.sum(q))

export default class Simulation implements SimulationBase {
    env: Environment
    plane: Plane
    dt: number
    interval?: number
    data: Array<{ x: number, y: number }> = []
    controls: BinaryControls<PlaneSimplePitchControls>
    onTick?: () => void
    isFinished = false
    nextPole?: Pole

    constructor(env: Environment, dt: number) {
        this.env = env
        this.controls = { up: false, down: false }
        this.plane = new Plane({ x: 0, y: env.height / 2, hd: 0, controls: this.controls })
        this.dt = dt
    }

    start() {
        this.interval = setInterval(this.calc, this.dt)
    }

    stop() {
        clearInterval(this.interval)
    }

    getNextPole() {
        return this.env.poles.find(({ x }) => x > this.plane.x)
    }

    calc = () => {
        this.plane.calc(this.dt)
        if (!includes(0, this.env.height, this.plane.y)) {
            this.stop()
        }
        this.nextPole = this.getNextPole()
        if (this.onTick) this.onTick()
    }
}