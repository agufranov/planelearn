import Environment from './Environment'
import Plane, { PlaneSimplePitchControls } from './Plane'
import { rand } from './util'

export default class Simulation {
    env: Environment
    plane: Plane
    dt: number
    interval?: number
    data: Array<{ x: number, y: number }> = []
    controls: BinaryControls<PlaneSimplePitchControls>
    onTick?: () => void

    constructor(env: Environment, dt: number) {
        this.env = env
        this.controls = { up: false, down: false }
        this.plane = new Plane({ x: 0, y: env.height / 2, hd: 0, controls: this.controls })
        this.dt = dt
    }

    start() {
        this.interval = setInterval(this.calc, this.dt)
    }

    calc = () => {
        this.plane.calc(this.dt)
        if (this.onTick) this.onTick()
    }
}