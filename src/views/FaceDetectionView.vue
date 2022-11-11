<template>
  <div class="face-detection">
    <h1>Face detection demo</h1>
    <div class="container">
      <video class="input_video" ref="source" v-show="false"></video>
      <canvas
        class="output_canvas"
        :class="{ loading_canvas: loadingCanvas }"
        :width="canvasWidth"
        :height="canvasHeight"
        ref="canvas"
      ></canvas>
      <div class="landmark-grid-container" ref="landmarkContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, computed, watch } from "vue";
import { FaceDetectionService, LogService } from "@/services";
const source = ref<InstanceType<typeof HTMLVideoElement> | null>(null);
const canvas = ref<InstanceType<typeof HTMLCanvasElement> | null>(null);
const landmarkContainer = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const logService = new LogService();
const loadingCanvas = ref(true);

watch(loadingCanvas, async (newLoadingCanvas, oldLoadingCanvas) => {
  logService.debug_log(
    "oldLoadingCanvas: ",
    oldLoadingCanvas ? "true" : "false"
  );
  logService.debug_log(
    "newLoadingCanvas: ",
    newLoadingCanvas ? "true" : "false"
  );
});

const canvasWidth = computed(() => {
  return window.innerWidth * 0.7;
});

const canvasHeight = computed(() => {
  // 16:9 resolution
  return canvasWidth.value * (9 / 16);
});

onMounted(() => {
  // child.value will hold an instance of <Child />
  logService.debug_log("onMounted");
  logService.debug_log("canvasWidth", canvasWidth);
  logService.debug_log("canvasHeight", canvasHeight);
  if (canvas.value && source.value && landmarkContainer.value) {
    new FaceDetectionService(
      canvas.value,
      source.value,
      canvasWidth.value,
      canvasHeight.value,
      landmarkContainer.value,
      loadingCanvas
      // this.grid
    ).setOptions({
      // modelSelection: 1,
      // minDetectionConfidence: 0.5,
      // selfieMode: true,
      model: "short",
      selfieMode: true,
      // model: "full-range.dense",
      minDetectionConfidence: 0.5,
    });
  }
});

onActivated(() => {
  logService.debug_log("onActivated");
});
</script>

<style scoped>
.face-detection {
  align-items: center;
  text-align: center;
  margin: 1.5rem 1.5rem;
}
.face-detection h1 {
  margin: 1.5rem 1.5rem;
}
.loading_canvas {
  background: url("https://media.giphy.com/media/8agqybiK5LW8qrG3vJ/giphy.gif")
    center no-repeat;
}
@media (min-width: 1024px) {
  .face-detection {
    margin: 3rem 3rem;
  }
  .input_video,
  .output_canvas {
    margin: 1.5rem 1.5rem;
  }
}
</style>
