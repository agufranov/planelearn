import Environment from './Environment'
import Plane from './Plane'
import Population from './Population'
import Simulation from './Simulation'

export default class Renderer {
    ctx: CanvasRenderingContext2D
    scale = 8

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!
    }

    renderEnvironment(env: Environment) {
        this.clear()

        const { ctx, scale } = this

        ctx.strokeStyle = 'blue'
        ctx.save()
        ctx.setTransform(scale, 0, 0, -scale, 100, ctx.canvas.height - 100)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(env.length, 0)
        ctx.moveTo(0, env.height)
        ctx.lineTo(env.length, env.height)
        env.poles.forEach(pole => {
            const line = pole.getLine(env.height)
            ctx.moveTo(...line.slice(0, 2) as [number, number])
            ctx.lineTo(...line.slice(2) as [number, number])
        })
        ctx.restore()
        ctx.stroke()
    }

    renderPlane() {
        const { ctx, sim: { env, plane } } = this

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

    renderSimulation = (sim: Simulation) => {
        const { ctx, scale } = this
        const { points } = sim

        ctx.strokeStyle = 'green'
        ctx.save()
        ctx.setTransform(scale, 0, 0, -scale, 100, ctx.canvas.height - 100)
        ctx.beginPath()
        points.forEach(([x, y]) => {
            ctx.lineTo(x, y)
        })
        ctx.restore()
        ctx.stroke()
    }

    renderPopulation = (pop: Population) => {
        pop.simulations.forEach(this.renderSimulation)
    }

    clear() {
        const { ctx } = this
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    render = () => {
        const { ctx } = this
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.renderEnvironment()
        this.renderPlane()
    }
}