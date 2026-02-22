import { Keyframe } from '../types';

export function interpolateKeyframes(keyframes: Keyframe[], time: number, defaultValue: number): number {
  if (!keyframes || keyframes.length === 0) return defaultValue;
  
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const k1 = sorted[i];
    const k2 = sorted[i + 1];
    
    if (time >= k1.time && time <= k2.time) {
      let t = (time - k1.time) / (k2.time - k1.time);
      
      // Apply easing
      const easing = k1.easing || 'linear';
      if (easing === 'ease-in') {
        t = t * t;
      } else if (easing === 'ease-out') {
        t = t * (2 - t);
      } else if (easing === 'ease-in-out') {
        t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }
      
      return k1.value + (k2.value - k1.value) * t;
    }
  }
  
  return defaultValue;
}
