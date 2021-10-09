import * as R from 'ramda'

export const rand = (...args) => {
    if (args.length === 1) {
        return Math.random() * args[0]
    } else if (args.length === 2) {
        return rand(args[1] - args[0]) + args[0]
    } else {
        throw new Error()
    }
}

export const irand = R.pipe(rand, Math.round)

export const range = n => [...Array(n).keys()]

export const normalize = xs => {
    const max = Math.max(...xs.map(Math.abs))
    if (max === 0) return xs
    return xs.map(x => x / max)
}

export class Field {
    constructor({ num, gapFrom, gapTo, height }) {
        Object.assign(this, { num, gapFrom, gapTo, height })
        let x = 0
        this.data = [...Array(num).keys()].map((_, i) => {
            return {
                up: !!(i % 2 - 1),
                size: irand(this.height / 3, this.height / 1.5),
                x: (x += irand(gapFrom, gapTo))
            }
        })
    }

    render(ctx, transform) {
        const { width, height } = ctx.canvas
        const { s, t } = transform
        ctx.beginPath()
        this.data.forEach(({ up, size, x }) => {
            ctx.moveTo(x * s.x + t.x, (up ? this.height : 0) * s.y + t.y)
            ctx.lineTo(x * s.x + t.x, (up ? this.height - size : size) * s.y + t.y)
        })
        ctx.strokeStyle = 'blue'
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(this.data[this.data.length - 1].x * s.x + t.x, t.y)
        ctx.moveTo(t.x, this.height * s.y + t.y)
        ctx.lineTo(this.data[this.data.length - 1].x * s.x + t.x, this.height * s.y + t.y)
        ctx.stroke()
    }
}