import { irand, range } from './util'

interface IPole {
    x: number
    height: number
    up: boolean
}

class Pole implements IPole {
    x: number
    height: number
    up: boolean

    constructor({ x, height, up }: IPole) {
        this.x = x
        this.height = height
        this.up = up
    }
}

export default class Environment {
    poles: IPole[]
    height: number
    length: number

    constructor({ poles, height, length }: { poles: IPole[], height: number, length: number }) {
        this.poles = poles
        this.height = height
        this.length = length
    }

    static generate({ length, gapFrom, gapTo, height }: { length: number, gapFrom: number, gapTo: number, height: number }) {
        const poles: IPole[] = []
        let x = irand(gapFrom, gapTo)
        let up = true
        while (x <= length) {
            poles.push(new Pole({
                x,
                height: irand(Math.ceil(height / 2), Math.floor(height * 2/ 3)),
                up
            }))
            up = !up
            x += irand(gapFrom, gapTo)
        }
        return new Environment({ poles, height, length })
    }
}