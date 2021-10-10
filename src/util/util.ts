import * as R from 'ramda'

export const rand = (...args: number[]): number => {
    if (args.length === 0) {
        return Math.random()
    } else if (args.length === 1) {
        return Math.random() * args[0]
    } else if (args.length === 2) {
        return rand(args[1] - args[0]) + args[0]
    } else {
        throw new Error()
    }
}

Object.assign(window, { rand })

export const irand = R.pipe(rand, Math.round)

export const range = (n: number) => [...Array(n).keys()]

export const normalize = (xs: number[]) => {
    const sum = R.sum(xs.map(Math.abs))
    if (sum === 0) return xs
    return xs.map(x => x / sum)
}

export const nrandv = (n: number) => R.pipe(range, R.map(() => rand()), normalize)(n)

export const includes = (from: number, to: number, value: number) => from <= value && value <= to