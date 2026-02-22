import { ClipTransform, ColorGrading } from './types';

export const DEFAULT_TRANSFORM: ClipTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1,
};

export const DEFAULT_COLOR_GRADING: ColorGrading = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  vibrance: 100,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
};

export const ASPECT_RATIOS = [
  { label: '9:16', value: '9:16', icon: 'Smartphone' },
  { label: '16:9', value: '16:9', icon: 'Monitor' },
  { label: '1:1', value: '1:1', icon: 'Square' },
  { label: '4:5', value: '4:5', icon: 'RectangleVertical' },
] as const;

export const SAMPLE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1282-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-the-shore-4151-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-525-large.mp4',
];
