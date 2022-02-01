import * as R from 'ramda'
import { irand, range } from './util'

export class Pole {
    x: number
    height: number
    up: boolean

    constructor({ x, height, up }: { x: number, height: number, up: boolean }) {
        this.x = x
        this.height = height
        this.up = up
    }

    getLine(height: number): Segment {
        return [this.x, this.up ? 0 : height, this.x, this.up ? this.height : height - this.height]
    }

    getDistanceToEdge(y: number, envHeight: number) {
        return this.up ? this.height - y : this.height - envHeight + y
    }
}

export default class Environment {
    poles: Pole[]
    height: number
    length: number
    maxGap: number

    constructor({ poles, height, length }: { poles: Pole[], height: number, length: number }) {
        this.poles = poles
        this.height = height
        this.length = length
        this.maxGap = Math.max(...range(this.poles.length - 1).map(i => this.poles[i + 1].x - this.poles[i].x))
    }

    static generate({ length, gapFrom, gapTo, height }: { length: number, gapFrom: number, gapTo: number, height: number }) {
        const poles: Pole[] = []
        let x = irand(gapFrom, gapTo)
        let up = true
        while (x <= length) {
            poles.push(new Pole({
                x,
                height: irand(Math.ceil(height / 2), Math.floor(height * 7 / 8)),
                up
            }))
            up = !up
            x += irand(gapFrom, gapTo)
        }
        return new Environment({ poles, height, length })
    }
}