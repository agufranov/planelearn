interface Robot {
    calc: (dt: number) => void
}

type BinaryControls<Names extends string> = {
    [name in Names]: boolean
}