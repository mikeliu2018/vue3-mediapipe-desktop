<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores";
import { LogService } from "@/services";
import { useToast, POSITION } from "vue-toastification";
import { googleLogout } from "vue3-google-login";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useAuthStore();

const signout = () => {
  LogService.debug_log("signout...");

  // window.google.accounts.id.disableAutoSelect();
  useAuthStore().$patch((state) => {
    state.credential = "";
  });

  googleLogout();

  if (router.currentRoute.value.path !== "/") {
    router.push({ name: "root" });
  }

  const toast = useToast();
  toast.info("You are logged out.", {
    position: POSITION.BOTTOM_RIGHT,
  });
};

const isLoggedIn = computed(() => {
  return store.isLoggedIn;
});
</script>

<template>
  <button class="g_btn_signout" v-show="isLoggedIn" v-on:click="signout()">
    Sign Out
  </button>
</template>

<style scoped>
.g_btn_signout {
  float: right;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background-color: var(--color-background);
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
@media (hover: hover) {
  .g_btn_signout:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
    color: var(--color-text);
    transition: 0.4s;
  }
}
</style>
