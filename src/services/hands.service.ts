import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import type { Options, Results } from "@mediapipe/hands";
import { LogService } from "./log.service";
import { WebsocketBuilder } from "websocket-ts";
import { useAuthStore } from "@/stores";
import type { Ref } from "vue";

export class HandsService extends Camera {
  private readonly pipe = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
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

  public render({ multiHandLandmarks, image }: Results): void {
    if (this.loadingCanvas.value) {
      this.loadingCanvas.value = false;
      this.logService.debug_log("this.loadingCanvas.value is change.");
      this.ws.build();
    }

    this.ctx.save();
    const { width, height } = this.canvas;
    this.logService.delay_log(10, "width: %d, height: %d", width, height);

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(image, 0, 0, width, height);

    if (multiHandLandmarks) {
      for (const landmarks of multiHandLandmarks) {
        // 畫線
        drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        // 描點
        drawLandmarks(this.ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
    }

    this.ctx.restore();
  }
}
