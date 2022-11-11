<script setup lang="ts">
// import TheWelcome from "../components/TheWelcome.vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores";
import GoogleSigninButton from "../components/GoogleSigninButton.vue";

const isLoggedIn = computed(() => {
  return useAuthStore().isLoggedIn;
});
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <div class="wrapper">
      <h1>Welcome to my demo for media-pipe with Vue.js</h1>
      <div class="g_btn_signin">
        <GoogleSigninButton v-if="isLoggedIn !== true"></GoogleSigninButton>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* main {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 1rem;
} */
.wrapper {
  align-items: center;
  text-align: center;
  margin: 1.5rem 1.5rem;
}
.wrapper h1 {
  margin: 1.5rem 1.5rem;
}
@media (min-width: 1024px) {
  .wrapper {
    margin: 3rem 3rem;
  }
  .g_btn_signin {
    align-items: center;
    text-align: center;
    margin: 3rem 3rem;
  }
}
</style>
