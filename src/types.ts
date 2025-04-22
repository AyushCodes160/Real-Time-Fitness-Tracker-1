export type Exercise = 'squat' | 'pushup';

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseFeedback {
  isCorrect: boolean;
  message: string;
  problematicPoints?: number[];
} 