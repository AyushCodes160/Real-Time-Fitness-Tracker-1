declare module '@mediapipe/tasks-vision' {
  export class FilesetResolver {
    static forVisionTasks(wasmFilePath: string): Promise<any>;
  }

  export interface PoseLandmarkerOptions {
    baseOptions: {
      modelAssetPath: string;
      delegate: string;
    };
    runningMode: string;
    numPoses: number;
  }

  export interface PoseLandmarkerResult {
    landmarks: Array<Array<{
      x: number;
      y: number;
      z: number;
      visibility?: number;
    }>>;
  }

  export class PoseLandmarker {
    static createFromOptions(vision: any, options: PoseLandmarkerOptions): Promise<PoseLandmarker>;
    detectForVideo(video: HTMLVideoElement, timestamp: number): PoseLandmarkerResult;
  }
} 