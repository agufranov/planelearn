<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { normalize } from './util/util'
import Plane from './util/Plane'
import Game from './util/Game'
import Simulation from './util/Simulation'
import Environment from './util/Environment'
import Renderer from './util/Renderer'

const width = ref()
const height = ref()

const setSize = () => {
  width.value = window.innerWidth - 6
  // height.value = window.innerHeight - 6
  height.value = 400
}

const canvas = ref()
const game = ref()
const q = ref(1)

setSize()

onMounted(() => {
  window.addEventListener('resize', setSize)
  const env = Environment.generate({ length: 100, gapFrom: 5, gapTo: 20, height: 20 })
  const simulation = new Simulation(env, 10)
  const renderer = new Renderer(canvas.value, env, simulation.plane)
  simulation.onTick = renderer.render
  simulation.start()
})
</script>

<template>
  <canvas :width="width" :height="height" ref="canvas" />
  <pre v-if="game">
    {{q}}
    {{game.plane.hd}}
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
