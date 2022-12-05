import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import GoogleSignInPlugin from "vue3-google-signin";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(Toast, {});
app.use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_APP_GOOGLE_SIGNIN_CLIENT_ID,
});

app.mount("#app");
