import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_APP_GOOGLE_SIGNIN_CLIENT_ID,
  // idConfiguration: {
  //   ux_mode: "redirect",
  //   redirect_uri: "http://localhost/home",
  // },
  buttonConfig: {
    type: "standard",
    theme: "filled_blue",
  },
});
app.use(Toast, {});

app.mount("#app");
