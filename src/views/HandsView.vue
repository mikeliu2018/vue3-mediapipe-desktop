<template>
  <div class="hands">
    <h1>Hands demo</h1>
    <div class="container">
      <video class="input_video" ref="source" v-show="false"></video>
      <canvas
        class="output_canvas"
        :class="{ loading_canvas: loadingCanvas }"
        v-bind:style="{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }"
        ref="canvas"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, computed } from "vue";
import { HandsService, LogService } from "@/services";
const source = ref<InstanceType<typeof HTMLVideoElement> | null>(null);
const canvas = ref<InstanceType<typeof HTMLCanvasElement> | null>(null);
const logService = new LogService();
const loadingCanvas = ref(true);

const canvasWidth = computed(() => {
  return window.innerWidth * 0.7;
});

const canvasHeight = computed(() => {
  return canvasWidth.value * (9 / 16);
});

onMounted(() => {
  logService.debug_log("onMounted");
  logService.debug_log("canvasWidth", canvasWidth);
  logService.debug_log("canvasHeight", canvasHeight);

  if (canvas.value && source.value) {
    new HandsService(
      canvas.value,
      source.value,
      canvasWidth.value,
      canvasHeight.value,
      loadingCanvas
    ).setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }
});

onActivated(() => {
  logService.debug_log("onActivated");
});
</script>

<style scoped>
.hands {
  align-items: center;
  text-align: center;
  margin: 1.5rem 1.5rem;
}
.hands h1 {
  margin: 1.5rem 1.5rem;
}
.hands .container {
  padding: 3rem 3rem;
}
.loading_canvas {
  background: url("https://media.giphy.com/media/8agqybiK5LW8qrG3vJ/giphy.gif")
    center no-repeat;
}

@media (min-width: 1024px) {
  .hands {
    margin: 3rem 3rem;
  }
  .input_video,
  .output_canvas {
    margin: 1.5rem 1.5rem;
  }
}
</style>
