<script setup lang="ts">
import { LogService, UserService } from "@/services";
import { useAuthStore } from "@/stores";
import { useToast, POSITION } from "vue-toastification";

const callback = async (response: any) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  LogService.debug_log("Handle the response", response);
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
};
</script>

<template>
  <GoogleLogin :callback="callback"></GoogleLogin>
</template>
