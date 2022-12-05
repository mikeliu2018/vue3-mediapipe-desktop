<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
import SignoutButton from "./components/SignoutButton.vue";
import { LogService, UserService } from "@/services";
import { useAuthStore } from "@/stores";
import { useToast, POSITION } from "vue-toastification";
import type UserToken from "../src/types";

onMounted(() => {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  LogService.debug_log(`innerWidth`, innerWidth);
  LogService.debug_log(`innerHeight`, innerHeight);
  showVersions();
});

const showVersions = async () => {
  const platforms = [
    { name: "node", version: "" },
    { name: "chrome", version: "" },
    { name: "electron", version: "" },
  ];
  platforms.map(async (platform) => {
    return (platform.version = await window.electronAPI.getPlatformVersion(
      platform.name
    ));
  });
  LogService.debug_log("platforms:", platforms);
};

window.electronAPI.handleLoginWithGoogle(
  async (event, userToken: UserToken) => {
    const toast = useToast();
    toast.info("Now, you are try log in.", {
      position: POSITION.BOTTOM_RIGHT,
    });
    const clientId = import.meta.env.VITE_APP_GOOGLE_SIGNIN_CLIENT_ID;
    const idToken = userToken.id_token;
    try {
      const res = await UserService.loginWithGoogle(clientId, idToken);
      LogService.debug_log("loginWithGoogle", res);
      if (res.result === "OK") {
        // store user credentials
        const store = useAuthStore();
        store.login(idToken);
        toast.info("You are logged in.", {
          position: POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (error: any) {
      LogService.error_log(error);
      toast.error(`Error: ${error.message}`, {
        position: POSITION.BOTTOM_RIGHT,
      });
    }
  }
);
</script>

<template>
  <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <div class="wrapper">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/face-detection">Face detection</RouterLink>
      <RouterLink to="/face-mesh">Face mesh</RouterLink>
      <RouterLink to="/hands">Hands</RouterLink>
      <RouterLink to="/pose">Pose</RouterLink>
      <RouterLink to="/holistic">Holistic</RouterLink>
      <SignoutButton></SignoutButton>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

/* .wrapper {
  text-align: center;
  align-items: center;
} */

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  align-items: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  /* display: inline-block; */
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: center;
    /* margin-left: -1rem; */
    font-size: 1rem;
    width: 80vw;
    /* padding: 1rem 0; */
    margin-top: 1rem;
  }
}
</style>
