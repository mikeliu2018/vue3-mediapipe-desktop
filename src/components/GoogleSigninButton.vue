<script setup lang="ts">
import {
  useCodeClient,
  type ImplicitFlowSuccessResponse,
  type ImplicitFlowErrorResponse,
} from "vue3-google-signin";

const handleOnSuccess = async (response: ImplicitFlowSuccessResponse) => {
  console.log("Code: ", response.code);
};

const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  redirect_uri: `${import.meta.env.VITE_DEV_API_SERVER_URL}/code/verify`,
  ux_mode: "redirect",
});
</script>

<template>
  <div class="google-btn" :disabled="!isReady" @click="() => login()">
    <div class="google-icon-wrapper">
      <img
        class="google-icon"
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      />
    </div>
    <p class="btn-text"><b>Sign in with google</b></p>
  </div>
</template>

<style lang="scss" scoped>
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;
.google-btn {
  width: 184px;
  height: 42px;
  background-color: $google-blue;
  border-radius: 2px;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
  display: inline-flex;
  cursor: pointer;
  .google-icon-wrapper {
    margin-top: 1px;
    margin-left: 1px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background-color: $white;
  }
  .google-icon {
    margin: 12px 12px;
    width: 18px;
    height: 18px;
  }
  .btn-text {
    text-align: center;
    float: right;
    margin: 11px 11px;
    color: $white;
    font-size: 14px;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }
  &:active {
    background: $button-active-blue;
  }
}
</style>
