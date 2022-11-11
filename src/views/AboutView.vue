<script setup lang="ts">
import GoogleOneTap from "../components/GoogleOneTap.vue";
</script>

<template>
  <div class="about">
    <h1>This is a base on Vue3 + Vite + Typescript project</h1>
    <p>The project will receive user's biometric data from camera</p>
    <p>And use media-pipe to draw image on canvas</p>
    <GoogleOneTap></GoogleOneTap>
  </div>
</template>

<style scoped>
.about {
  align-items: center;
  text-align: center;
  margin: 1.5rem 1.5rem;
}
.about h1 {
  margin: 1.5rem 1.5rem;
}
@media (min-width: 1024px) {
  .about {
    margin: 3rem 3rem;
  }
}
</style>
