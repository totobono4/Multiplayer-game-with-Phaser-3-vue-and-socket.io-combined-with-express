<template>
    <div :id="containerId"></div>
  </template>

<script setup>
import Game from '../scripts/game/game.ts'
import Level1 from '../scripts/game/levels/Level1'
import { onMounted } from 'vue'
const containerId = 'game-container'

onMounted(() => {
  try {
    new Game('100%', '100%')
      .attachTo(containerId)
      .registerLevel(new Level1(), true)
      .start()
  } catch (e) {
    console.log(e)
    // window.location.replace('/login')
  }
})

</script>
