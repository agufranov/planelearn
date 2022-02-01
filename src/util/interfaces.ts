interface Robot {
    calc: (dt: number) => void
}

interface Input {
    getValue: () => number
}

type BinaryControls<Names extends string> = {
    [name in Names]: boolean
}

type Segment = [number, number, number, number]

interface SimulationBase {
    dt: number
    isFinished: boolean

    calc: () => void
    getSensorData: () => number[]
    getScore: () => number
}