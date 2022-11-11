<script setup lang="ts">
import { onMounted } from "vue";
import { googleOneTap } from "vue3-google-login";
import { LogService, UserService } from "@/services";
import { useAuthStore } from "@/stores";
import { useToast, POSITION } from "vue-toastification";

onMounted(() => {
  const store = useAuthStore();
  if (!store.isLoggedIn) {
    googleOneTap({ autoLogin: true })
      .then(async (response) => {
        // This promise is resolved when user selects an account from the the One Tap prompt
        // console.log("Handle the response", response);
        LogService.debug_log(response);
        const toast = useToast();

        if (response.credential) {
          toast.info("Now, you are try log in.", {
            position: POSITION.BOTTOM_RIGHT,
          });
          const clientId = import.meta.env.VITE_APP_GOOGLE_SIGNIN_CLIENT_ID;
          const idToken = response.credential;
          try {
            const res = await UserService.loginWithGoogle(clientId, idToken);
            LogService.debug_log("loginWithGoogle", res);
            if (res.result === "OK") {
              // store user credentials
              const store = useAuthStore();
              store.login(response.credential);

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
      })
      .catch((error) => {
        LogService.error_log("Handle the error", error);
      });
  }
});
</script>

<template>
  <div></div>
</template>
