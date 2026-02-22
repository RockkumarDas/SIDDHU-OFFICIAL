export type ProjectPlan = 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY' | 'LIFETIME';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: ProjectPlan;
}

export interface Keyframe {
  time: number;
  value: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface ClipTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface ColorGrading {
  brightness: number;
  contrast: number;
  saturation: number;
  vibrance: number;
  exposure: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
}

export type ClipType = 'video' | 'audio' | 'text' | 'image';

export interface Clip {
  id: string;
  type: ClipType;
  name: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  sourceUrl: string;
  layer: number;
  transform: ClipTransform;
  colorGrading: ColorGrading;
  keyframes: {
    [key in keyof ClipTransform]?: Keyframe[];
  };
  effects: string[];
}

export interface Project {
  id: string;
  name: string;
  clips: Clip[];
  duration: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  fps: number;
  updatedAt: string;
  thumbnail?: string;
}
