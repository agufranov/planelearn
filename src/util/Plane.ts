export type PlaneSimplePitchControls = 'up' | 'down'

interface PlaneOpts {
    speed: number
    pitchSpeed: number
}

export default class Plane implements Robot {
    x: number
    y: number
    hd: number
    controls: BinaryControls<PlaneSimplePitchControls>
    opts: PlaneOpts = {
        speed: 20,
        pitchSpeed: 8
    }

    constructor({ x, y, hd, controls }: { x: number, y: number, hd: number, controls: BinaryControls<PlaneControls> }) {
        this.x = x
        this.y = y
        this.hd = hd
        this.controls = controls
    }

    calc(dt: number) {
        const { hd, opts, controls } = this
        const dt$ = dt / 1000
        this.x += Math.cos(hd) * opts.speed * dt$
        this.y += Math.sin(hd) * opts.speed * dt$
        if(controls.up || controls.down) {
            this.hd += (controls.up ? 1 : -1) * opts.pitchSpeed * dt$
        }
        console.log(this.hd)
    }
}