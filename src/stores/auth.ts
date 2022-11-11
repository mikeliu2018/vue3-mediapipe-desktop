// import { ref, computed } from "vue";
// import { defineStore } from "pinia";

// export const useAuthStore = defineStore("auth", () => {
//   const credential = ref("");
//   const isLoggedIn = computed(() => {
//     return credential.value !== "";
//   });
//   function login(cred: string) {
//     credential.value = cred;
//   }

//   return { credential, isLoggedIn, login };
// });

import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      credential: "",
    };
  },
  getters: {
    getCredential: (state) => {
      return state.credential;
    },
    isLoggedIn: (state) => {
      return state.credential !== "";
    },
  },
  actions: {
    login(cred: string) {
      this.credential = cred;
    },
    logout() {
      this.credential = "";
    },
  },
  persist: true,
});

export default useAuthStore;
