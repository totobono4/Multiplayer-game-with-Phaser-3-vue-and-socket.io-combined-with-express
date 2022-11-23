<template>
    <div :id="containerId"></div>
  </template>

<script setup>
import Game from '../scripts/game/game.ts'
import { onMounted } from 'vue'
const containerId = 'game-container'

onMounted(() => {
  new Game(800, 800)
    .attachTo(containerId)
    .start()
})

</script>
