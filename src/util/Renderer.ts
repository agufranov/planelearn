import Environment from './Environment'
import Plane from './Plane'

export default class Renderer {
    env: Environment
    plane: Plane
    ctx: CanvasRenderingContext2D
    scale = 8

    constructor(canvas: HTMLCanvasElement, env: Environment, plane: plane) {
        this.ctx = canvas.getContext('2d')!
        this.env = env
        this.plane = plane
    }

    renderEnvironment() {
        const { ctx, env } = this

        ctx.strokeStyle = 'blue'
        ctx.save()
        ctx.setTransform(this.scale, 0, 0, -this.scale, 100, this.ctx.canvas.height - 100)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(env.length, 0)
        ctx.moveTo(0, env.height)
        ctx.lineTo(env.length, env.height)
        env.poles.forEach(({ x, height, up }) => {
            ctx.moveTo(x, up ? 0 : env.height)
            ctx.lineTo(x, up ? height: env.height - height)
        })
        ctx.restore()
        ctx.stroke()
    }

    renderPlane() {
        const { ctx, plane } = this

        ctx.strokeStyle = 'green'
        ctx.save()
        ctx.setTransform(this.scale, 0, 0, -this.scale, 100, this.ctx.canvas.height - 100)
        ctx.beginPath()
        // ctx.moveTo(plane.x, plane.y)
        // ctx.lineTo(plane.x + Math.cos(plane.hd) * 5, plane.y + Math.sin(plane.hd) * 5)
        ctx.moveTo(plane.oldX, plane.oldY)
        ctx.lineTo(plane.x, plane.y)
        ctx.restore()
        ctx.stroke()
    }

    render = () => {
        const { ctx } = this
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.renderEnvironment()
        this.renderPlane()
    }
}