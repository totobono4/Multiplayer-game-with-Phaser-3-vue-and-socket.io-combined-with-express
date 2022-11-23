<template>
    <div :id="containerId"></div>
  </template>

<script setup>
import Game from '../scripts/game/game.ts'
import Level1 from '../scripts/game/levels/Level1'
import { onMounted } from 'vue'
const containerId = 'game-container'

onMounted(() => {
  new Game('100%', '100%')
    .attachTo(containerId)
    .registerLevel(Level1, true)
    .start()
})

</script>
