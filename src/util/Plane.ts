export type PlaneSimplePitchControls = 'up' | 'down'

interface PlaneOpts {
    speed: number
    pitchSpeed: number
}

export default class Plane implements Robot {
    x: number
    y: number
    oldX: number
    oldY: number
    hd: number
    controls: BinaryControls<PlaneSimplePitchControls>
    opts: PlaneOpts = {
        speed: 15,
        pitchSpeed: 6
    }

    constructor({ x, y, hd, controls }: { x: number, y: number, hd: number, controls: BinaryControls<PlaneSimplePitchControls> }) {
        this.x = x
        this.y = y
        this.oldX = x
        this.oldY = y
        this.hd = hd
        this.controls = controls
    }

    calc(dt: number) {
        const { hd, opts, controls } = this
        const dt$ = dt / 1000
        this.oldX = this.x
        this.oldY = this.y
        this.x += Math.cos(hd) * opts.speed * dt$
        this.y += Math.sin(hd) * opts.speed * dt$
        if(controls.up || controls.down) {
            this.hd += (controls.up ? 1 : -1) * opts.pitchSpeed * dt$
        }
    }

    getTrajectorySegment(): Segment {
        return [this.oldX, this.oldY, this.x, this.y]
    }
}