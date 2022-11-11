import { Camera } from "@mediapipe/camera_utils";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import drawingUtils from "@mediapipe/drawing_utils";
import type { Options, Results } from "@mediapipe/face_detection";
import { FaceDetection } from "@mediapipe/face_detection";
import { LogService } from "./log.service";
import { WebsocketBuilder } from "websocket-ts";
import { useAuthStore } from "@/stores";
import type { Ref } from "vue";
// import { RootState } from "@/store/types";
// import { Getter, Action } from "vuex-class";

export class FaceDetectionService extends Camera {
  private readonly pipe = new FaceDetection({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`,
  });

  private readonly ctx: CanvasRenderingContext2D;
  private logService = new LogService();

  private readonly wsConnectUrl = `ws://localhost:3000/?credential=${
    useAuthStore().getCredential
  }`;

  private ws = new WebsocketBuilder(this.wsConnectUrl)
    .onOpen((i, ev) => {
      console.log("opened", i, ev);
    })
    .onClose((i, ev) => {
      console.log("closed", i, ev);
    })
    .onError((i, ev) => {
      console.log("error", i, ev);
    })
    .onMessage((i, ev) => {
      console.log("message", i, ev);
    })
    .onRetry((i, ev) => {
      console.log("retry", i, ev);
    });

  constructor(
    public readonly canvas: HTMLCanvasElement,
    public readonly source: HTMLVideoElement,
    public readonly canvasWidth: number,
    public readonly canvasHeight: number,
    public readonly landmarkContainer: HTMLDivElement,
    public readonly loadingCanvas: Ref<boolean>
  ) {
    super(source, {
      onFrame: async () => await this.pipe.send({ image: source }),
      width: canvasWidth,
      height: canvasHeight,
    });

    source.addEventListener("loadedmetadata", () => {
      this.canvas.height = source.videoHeight;
      this.canvas.width = source.videoWidth;
    });

    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  /**
   *
   * @param options {@link https://google.github.io/mediapipe/solutions/pose.html#javascript-solution-api|Mediapipe}
   */
  public setOptions(options: Options): Promise<void> {
    this.pipe.onResults((results) => this.render(results));
    this.pipe.setOptions(options);
    return this.start();
  }

  public render({ detections, image }: Results): void {
    if (this.loadingCanvas.value) {
      this.loadingCanvas.value = false;
      this.logService.debug_log("this.loadingCanvas.value is change.");
      this.ws.build();
    }

    const { width, height } = this.canvas;
    // this.logService.delay_log(10, "width: %d, height: %d", width, height);
    // this.logService.delay_log(10, "multiFaceLandmarks", multiFaceLandmarks);

    // Draw the overlays.
    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(image, 0, 0, width, height);
    if (detections.length > 0) {
      drawingUtils.drawRectangle(this.ctx, detections[0].boundingBox, {
        color: "blue",
        lineWidth: 4,
        fillColor: "#00000000",
      });
      drawingUtils.drawLandmarks(this.ctx, detections[0].landmarks, {
        color: "red",
        radius: 5,
      });
    }

    this.ctx.restore();

    // this.ws.send(
    //   JSON.stringify({
    //     timesteamp: Math.floor(Date.now() / 1000),
    //     poseLandmarks: poseLandmarks,
    //   })
    // );
  }
}
