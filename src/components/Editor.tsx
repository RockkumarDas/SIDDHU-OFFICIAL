import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Scissors, Copy, Trash2, Plus, 
  Layers, Wand2, Palette, Type as TypeIcon, 
  Music, Settings, Download, ChevronLeft,
  Maximize2, MousePointer2, Hand,
  Undo2, Redo2, Save, Circle
} from 'lucide-react';
import { Project, Clip, ClipType, ClipTransform, Keyframe } from '../types';
import { DEFAULT_TRANSFORM, DEFAULT_COLOR_GRADING } from '../constants';
import KeyframeEditor from './KeyframeEditor';
import { interpolateKeyframes } from '../utils/interpolation';

interface EditorProps {
  project: Project;
  onSave: (project: Project) => void;
  onBack: () => void;
}

export default function Editor({ project: initialProject, onSave, onBack }: EditorProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'edit' | 'effects' | 'color' | 'text' | 'audio'>('edit');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);

  const selectedClip = project.clips.find(c => c.id === selectedClipId);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      const start = Date.now() - (currentTime * 1000);
      const animate = () => {
        const now = Date.now();
        const nextTime = (now - start) / 1000;
        if (nextTime >= project.duration) {
          setIsPlaying(false);
          setCurrentTime(project.duration);
        } else {
          setCurrentTime(nextTime);
          requestRef.current = requestAnimationFrame(animate);
        }
      };
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, project.duration]);

  const handleAddClip = (type: ClipType) => {
    const newClip: Clip = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type}`,
      startTime: currentTime,
      duration: 5,
      sourceUrl: type === 'video' ? 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1282-large.mp4' : '',
      layer: project.clips.length,
      transform: { ...DEFAULT_TRANSFORM },
      colorGrading: { ...DEFAULT_COLOR_GRADING },
      keyframes: {},
      effects: [],
    };
    setProject(prev => ({ ...prev, clips: [...prev.clips, newClip] }));
    setSelectedClipId(newClip.id);
  };

  const handleUpdateClip = (id: string, updates: Partial<Clip>) => {
    setProject(prev => ({
      ...prev,
      clips: prev.clips.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const handleAddKeyframe = (clipId: string, property: keyof ClipTransform, time: number) => {
    const clip = project.clips.find(c => c.id === clipId);
    if (!clip) return;

    const currentValue = clip.transform[property];
    const newKeyframe: Keyframe = { time, value: currentValue };
    
    const propertyKeyframes = [...(clip.keyframes[property] || []), newKeyframe].sort((a, b) => a.time - b.time);

    handleUpdateClip(clipId, {
      keyframes: {
        ...clip.keyframes,
        [property]: propertyKeyframes
      }
    });
  };

  const handleRemoveKeyframe = (clipId: string, property: keyof ClipTransform, time: number) => {
    const clip = project.clips.find(c => c.id === clipId);
    if (!clip) return;

    const propertyKeyframes = (clip.keyframes[property] || []).filter(k => Math.abs(k.time - time) > 0.05);

    handleUpdateClip(clipId, {
      keyframes: {
        ...clip.keyframes,
        [property]: propertyKeyframes
      }
    });
  };

  const handleUpdateEasing = (clipId: string, property: keyof ClipTransform, time: number, easing: Keyframe['easing']) => {
    const clip = project.clips.find(c => c.id === clipId);
    if (!clip) return;

    const propertyKeyframes = (clip.keyframes[property] || []).map(k => 
      Math.abs(k.time - time) < 0.05 ? { ...k, easing } : k
    );

    handleUpdateClip(clipId, {
      keyframes: {
        ...clip.keyframes,
        [property]: propertyKeyframes
      }
    });
  };

  const handleDeleteClip = () => {
    if (!selectedClipId) return;
    setProject(prev => ({
      ...prev,
      clips: prev.clips.filter(c => c.id !== selectedClipId)
    }));
    setSelectedClipId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0B] overflow-hidden select-none font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 glass-dark z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Project</span>
            <span className="text-sm font-semibold font-display">{project.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-lg p-1 mr-4">
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white">
              <Undo2 size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white">
              <Redo2 size={16} />
            </button>
          </div>
          <button 
            onClick={() => onSave(project)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-all"
          >
            <Save size={16} />
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
            <Download size={16} />
            Export
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-6 glass-dark">
          {[
            { id: 'edit', icon: Scissors, label: 'Edit' },
            { id: 'effects', icon: Wand2, label: 'FX' },
            { id: 'color', icon: Palette, label: 'Color' },
            { id: 'text', icon: TypeIcon, label: 'Text' },
            { id: 'audio', icon: Music, label: 'Audio' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id as any)}
              className={`group flex flex-col items-center gap-1 transition-all ${
                activeTab === tool.id ? 'text-emerald-400' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeTab === tool.id ? 'bg-emerald-400/10' : 'group-hover:bg-white/5'
              }`}>
                <tool.icon size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tool.label}</span>
            </button>
          ))}
          <div className="mt-auto">
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Settings size={22} />
            </button>
          </div>
        </aside>

        {/* Center Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 bg-black/40 relative flex items-center justify-center p-8">
            <div 
              className="relative shadow-2xl shadow-black/50 overflow-hidden bg-black"
              style={{ 
                aspectRatio: project.aspectRatio === '9:16' ? '9/16' : 
                            project.aspectRatio === '16:9' ? '16/9' : '1/1',
                height: '100%',
                maxHeight: 'calc(100vh - 400px)'
              }}
            >
              {/* Video Layers Simulation */}
              {project.clips.map(clip => {
                const isVisible = currentTime >= clip.startTime && currentTime <= clip.startTime + clip.duration;
                if (!isVisible) return null;

                const relativeTime = currentTime - clip.startTime;
                
                // Interpolate transform values
                const interpolatedTransform = {
                  x: interpolateKeyframes(clip.keyframes.x || [], relativeTime, clip.transform.x),
                  y: interpolateKeyframes(clip.keyframes.y || [], relativeTime, clip.transform.y),
                  scale: interpolateKeyframes(clip.keyframes.scale || [], relativeTime, clip.transform.scale),
                  rotation: interpolateKeyframes(clip.keyframes.rotation || [], relativeTime, clip.transform.rotation),
                  opacity: interpolateKeyframes(clip.keyframes.opacity || [], relativeTime, clip.transform.opacity),
                };

                return (
                  <div 
                    key={clip.id}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: interpolatedTransform.opacity,
                      transform: `translate(${interpolatedTransform.x}px, ${interpolatedTransform.y}px) scale(${interpolatedTransform.scale}) rotate(${interpolatedTransform.rotation}deg)`,
                      filter: `brightness(${clip.colorGrading.brightness}%) contrast(${clip.colorGrading.contrast}%) saturate(${clip.colorGrading.saturation}%)`
                    }}
                  >
                    {clip.type === 'video' && (
                      <video 
                        src={clip.sourceUrl}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                    )}
                    {clip.type === 'text' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-white drop-shadow-lg">
                          {clip.name}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Playback Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <Play size={32} fill="white" />
                  </div>
                </div>
              )}
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 glass rounded-full shadow-xl">
              <button onClick={() => setCurrentTime(0)} className="hover:text-emerald-400 transition-colors">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
              </button>
              <button onClick={() => setCurrentTime(project.duration)} className="hover:text-emerald-400 transition-colors">
                <SkipForward size={20} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-2" />
              <span className="text-xs font-mono font-medium w-20 text-center">
                {currentTime.toFixed(2)}s / {project.duration.toFixed(0)}s
              </span>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="h-[300px] border-t border-white/5 flex flex-col glass-dark">
            {/* Timeline Toolbar */}
            <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
                  <button className="p-1.5 bg-white/10 rounded text-emerald-400">
                    <MousePointer2 size={14} />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded text-white/40 hover:text-white">
                    <Hand size={14} />
                  </button>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <button 
                  onClick={() => handleAddClip('video')}
                  className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors"
                >
                  <Plus size={14} />
                  ADD CLIP
                </button>
                <button 
                  onClick={handleDeleteClip}
                  disabled={!selectedClipId}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                >
                  <Trash2 size={14} />
                  DELETE
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/40">ZOOM</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5" 
                    step="0.1" 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-24 accent-emerald-500"
                  />
                </div>
                <button className="text-white/40 hover:text-white">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div 
              ref={timelineRef}
              className="flex-1 overflow-x-auto overflow-y-auto relative timeline-grid no-scrollbar"
              onScroll={(e) => {
                // Sync scroll if needed
              }}
            >
              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-emerald-500 z-30 pointer-events-none"
                style={{ left: `${currentTime * 40 * zoom}px` }}
              >
                <div className="w-3 h-3 bg-emerald-500 rounded-full -ml-[6px] -mt-1 shadow-lg shadow-emerald-500/50" />
              </div>

              {/* Tracks */}
              <div className="min-w-full inline-block p-4 space-y-2">
                {[0, 1, 2, 3].map(layerIndex => (
                  <div key={layerIndex} className="h-12 bg-white/5 rounded-lg relative border border-white/5 group">
                    <div className="absolute -left-12 top-0 bottom-0 w-10 flex items-center justify-center text-[10px] font-bold text-white/20 group-hover:text-white/40">
                      L{layerIndex + 1}
                    </div>
                    {project.clips
                      .filter(c => c.layer === layerIndex)
                      .map(clip => (
                        <motion.div
                          key={clip.id}
                          layoutId={clip.id}
                          onClick={() => setSelectedClipId(clip.id)}
                          className={`absolute top-1 bottom-1 rounded-md cursor-pointer flex items-center px-2 overflow-hidden border-2 transition-all ${
                            selectedClipId === clip.id 
                              ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                              : 'bg-white/10 border-transparent hover:bg-white/15'
                          }`}
                          style={{
                            left: `${clip.startTime * 40 * zoom}px`,
                            width: `${clip.duration * 40 * zoom}px`
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {clip.type === 'video' ? <Play size={12} fill="currentColor" /> : <TypeIcon size={12} />}
                            <span className="text-[10px] font-bold truncate uppercase tracking-tighter">
                              {clip.name}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <AnimatePresence>
          {selectedClip && (
            <motion.aside 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-72 border-l border-white/5 flex flex-col glass-dark z-40"
            >
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-4">
                <span className="text-sm font-bold uppercase tracking-widest">Properties</span>
                <button onClick={() => setSelectedClipId(null)} className="text-white/40 hover:text-white">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {/* Transform */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Transform</h3>
                    <button 
                      onClick={() => handleUpdateClip(selectedClip.id, { transform: { ...DEFAULT_TRANSFORM }, keyframes: {} })}
                      className="text-[10px] font-bold text-emerald-400 hover:underline"
                    >
                      RESET
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(['x', 'y', 'scale', 'rotation', 'opacity'] as const).map((prop) => (
                      <div key={prop} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-white/40 uppercase">{prop}</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              step={prop === 'scale' || prop === 'opacity' ? '0.1' : '1'}
                              value={selectedClip.transform[prop]}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                handleUpdateClip(selectedClip.id, { 
                                  transform: { ...selectedClip.transform, [prop]: val } 
                                });
                                // If there's a keyframe at current time, update it too
                                const relativeTime = currentTime - selectedClip.startTime;
                                const kfIndex = (selectedClip.keyframes[prop] || []).findIndex(k => Math.abs(k.time - relativeTime) < 0.05);
                                if (kfIndex !== -1) {
                                  const newKfs = [...(selectedClip.keyframes[prop] || [])];
                                  newKfs[kfIndex] = { ...newKfs[kfIndex], value: val };
                                  handleUpdateClip(selectedClip.id, { keyframes: { ...selectedClip.keyframes, [prop]: newKfs } });
                                }
                              }}
                              className="w-16 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-mono text-right"
                            />
                          </div>
                        </div>
                        <KeyframeEditor
                          property={prop}
                          label=""
                          currentTime={currentTime}
                          clipStartTime={selectedClip.startTime}
                          clipDuration={selectedClip.duration}
                          keyframes={selectedClip.keyframes[prop] || []}
                          onAddKeyframe={(time) => handleAddKeyframe(selectedClip.id, prop, time)}
                          onRemoveKeyframe={(time) => handleRemoveKeyframe(selectedClip.id, prop, time)}
                          onUpdateKeyframe={(time, value) => {}}
                          onUpdateEasing={(time, easing) => handleUpdateEasing(selectedClip.id, prop, time, easing)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Color Grading */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Color Grading</h3>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline">
                      <Wand2 size={10} />
                      AI AUTO
                    </button>
                  </div>
                  {['brightness', 'contrast', 'saturation'].map(prop => (
                    <div key={prop} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-white/40 uppercase">{prop}</label>
                        <span className="text-[10px] font-mono text-white/60">{(selectedClip.colorGrading as any)[prop]}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={(selectedClip.colorGrading as any)[prop]}
                        onChange={(e) => handleUpdateClip(selectedClip.id, { colorGrading: { ...selectedClip.colorGrading, [prop]: parseInt(e.target.value) } })}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  ))}
                </section>

                {/* AI Features */}
                <section className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Tools</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                          <TypeIcon size={16} />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold">Auto Captions</div>
                          <div className="text-[10px] text-white/40">Generate from audio</div>
                        </div>
                      </div>
                      <ChevronLeft size={14} className="rotate-180 text-white/20 group-hover:text-white" />
                    </button>
                    <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <Layers size={16} />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold">Remove BG</div>
                          <div className="text-[10px] text-white/40">AI segmentation</div>
                        </div>
                      </div>
                      <ChevronLeft size={14} className="rotate-180 text-white/20 group-hover:text-white" />
                    </button>
                  </div>
                </section>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
