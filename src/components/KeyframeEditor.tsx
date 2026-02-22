import React from 'react';
import { motion } from 'motion/react';
import { Keyframe, ClipTransform } from '../types';
import { Plus, Trash2, Circle } from 'lucide-react';

interface KeyframeEditorProps {
  property: keyof ClipTransform;
  label: string;
  currentTime: number;
  clipStartTime: number;
  clipDuration: number;
  keyframes: Keyframe[];
  onAddKeyframe: (time: number) => void;
  onRemoveKeyframe: (time: number) => void;
  onUpdateKeyframe: (time: number, value: number) => void;
  onUpdateEasing: (time: number, easing: Keyframe['easing']) => void;
}

export default function KeyframeEditor({
  property,
  label,
  currentTime,
  clipStartTime,
  clipDuration,
  keyframes,
  onAddKeyframe,
  onRemoveKeyframe,
  onUpdateKeyframe,
  onUpdateEasing
}: KeyframeEditorProps) {
  const relativeTime = currentTime - clipStartTime;
  const currentKeyframe = keyframes.find(k => Math.abs(k.time - relativeTime) < 0.05);
  const hasKeyframeAtCurrentTime = !!currentKeyframe;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</label>
          {hasKeyframeAtCurrentTime && (
            <select
              value={currentKeyframe.easing || 'linear'}
              onChange={(e) => onUpdateEasing(currentKeyframe.time, e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded text-[8px] font-bold text-white/60 px-1 py-0.5 outline-none hover:border-white/20 transition-colors"
            >
              <option value="linear">LINEAR</option>
              <option value="ease-in">EASE IN</option>
              <option value="ease-out">EASE OUT</option>
              <option value="ease-in-out">EASE IN-OUT</option>
            </select>
          )}
        </div>
        <button
          onClick={() => hasKeyframeAtCurrentTime ? onRemoveKeyframe(relativeTime) : onAddKeyframe(relativeTime)}
          className={`p-1 rounded transition-colors ${
            hasKeyframeAtCurrentTime ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/20 hover:text-white hover:bg-white/5'
          }`}
        >
          <Circle size={10} fill={hasKeyframeAtCurrentTime ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="h-6 bg-white/5 rounded relative overflow-hidden group border border-white/5">
        {/* Progress Bar */}
        <div 
          className="absolute top-0 bottom-0 bg-emerald-500/10 border-r border-emerald-500/30 pointer-events-none"
          style={{ width: `${(relativeTime / clipDuration) * 100}%` }}
        />

        {/* Keyframe Markers */}
        {keyframes.map((kf, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rotate-45 cursor-pointer hover:scale-125 transition-transform z-10"
            style={{ left: `${(kf.time / clipDuration) * 100}%`, marginLeft: '-4px' }}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveKeyframe(kf.time);
            }}
          />
        ))}

        {/* Click to seek within clip */}
        <div className="absolute inset-0 cursor-crosshair" />
      </div>
    </div>
  );
}
