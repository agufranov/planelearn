<script setup lang="ts">
import * as R from 'ramda'
import { watch, ref, onMounted } from 'vue'
import Environment from './util/Environment'
import Renderer from './util/Renderer'
import Population from './util/Population'

const width = ref()
const height = ref()

const setSize = () => {
  width.value = window.innerWidth - 6
  // height.value = window.innerHeight - 6
  height.value = 400
}

let simOptions = {
  dt: 50,
  networkLengths: [2, 2],
  env: null
}

setSize()

const canvas = ref()
const generateEnv = ref()
const generatePopulation = ref()
const clearPopulation = ref()
const interval = ref()
const pop = ref()

onMounted(() => {
  window.addEventListener('resize', setSize)
  const t0 = Date.now()

  const renderer = new Renderer(canvas.value)

  let population

  generateEnv.value = () => {
    simOptions.env = Environment.generate({ length: 130, gapFrom: 10, gapTo: 20, height: 20 })
    if (population) population.simOptions.env = simOptions.env
    renderer.renderEnvironment(simOptions.env)
  }
  generateEnv.value()

  population = Population.load(simOptions.env, simOptions.dt)

  renderer.renderPopulation(population)
  generatePopulation.value = () => {
    population = population.generateNext(simOptions.env)
    if (population.epoch % 10 === 0) {
      population.save()
    }
    window.population = population
    pop.value = population
    renderer.clear()
    renderer.renderEnvironment(simOptions.env)
    population.top.forEach(sim => renderer.renderSimulation(sim))
    // renderer.renderPopulation(population)
  }
  clearPopulation.value = () => {
    population = Population.generate(1000, simOptions)
    population.save()
  }
  interval.value = setInterval(generatePopulation.value)
})

const stop = () => { console.log(1); clearInterval(interval.value) }
</script>

<template>
  <canvas :width="width" :height="height" ref="canvas" />
  <button @click="generateEnv">Generate env</button>
  <button @click="generatePopulation">Generate population</button>
  <button @click="stop">Stop</button>
  <button @click="clearPopulation">Clear</button>
  <pre v-if="pop">
    Epoch: {{pop.epoch}}
    Max score: {{pop.score}}
  </pre>
</template>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

canvas {
  border: 1px solid red;
}
</style>
