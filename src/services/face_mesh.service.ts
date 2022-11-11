import { Camera } from "@mediapipe/camera_utils";
// import { LandmarkGrid } from "@mediapipe/control_utils_3d";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import type { Options, Results } from "@mediapipe/face_mesh";
import {
  FaceMesh,
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh";
import { LogService } from "./log.service";
import { WebsocketBuilder } from "websocket-ts";
import { useAuthStore } from "@/stores";
import type { Ref } from "vue";
// import { RootState } from "@/store/types";
// import { Getter, Action } from "vuex-class";

export class FaceMeshService extends Camera {
  private readonly pipe = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
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
    console.log("FaceMeshService constructor.");
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

  public render({ multiFaceLandmarks, image }: Results): void {
    if (this.loadingCanvas.value) {
      this.loadingCanvas.value = false;
      this.logService.debug_log("this.loadingCanvas.value is change.");
      this.ws.build();
    }

    const { width, height } = this.canvas;
    // this.logService.delay_log(10, "width: %d, height: %d", width, height);
    // this.logService.delay_log(10, "multiFaceLandmarks", multiFaceLandmarks);

    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(image, 0, 0, width, height);
    if (multiFaceLandmarks) {
      for (const landmarks of multiFaceLandmarks) {
        drawConnectors(this.ctx, landmarks, FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_RIGHT_IRIS, {
          color: "#FF3030",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_LEFT_IRIS, {
          color: "#30FF30",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        drawConnectors(this.ctx, landmarks, FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
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
