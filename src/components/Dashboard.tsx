import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Video, Clock, MoreVertical, 
  Search, Grid, List as ListIcon, 
  Crown, User as UserIcon, LogOut,
  ChevronRight, Play
} from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  user: { name: string; email: string; avatar?: string; plan: string };
  onNewProject: () => void;
  onOpenProject: (project: Project) => void;
  onLogout: () => void;
}

export default function Dashboard({ user, onNewProject, onOpenProject, onLogout }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/projects?userId=demo-user')
      .then(res => res.json())
      .then(data => {
        setProjects(data.map((p: any) => ({ ...p, data: JSON.parse(p.data) })));
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 glass-dark z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center rotate-12 shadow-lg shadow-emerald-500/20">
              <Video size={20} className="text-black -rotate-12" />
            </div>
            <span className="text-xl font-black font-display tracking-tighter uppercase">Dynasty <span className="text-emerald-400">Pro</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-bold text-white/60 hover:text-white transition-colors">Projects</button>
            <button className="text-sm font-bold text-white/60 hover:text-white transition-colors">Templates</button>
            <button className="text-sm font-bold text-white/60 hover:text-white transition-colors">Assets</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Crown size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{user.plan}</span>
          </div>
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{user.name}</div>
              <div className="text-[10px] text-white/40">{user.email}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 transition-colors">
              {user.avatar ? <img src={user.avatar} alt="" /> : <UserIcon size={20} className="text-white/40" />}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 space-y-12">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[32/9] bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/5 flex items-center px-12">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=10')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10 space-y-6 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black font-display tracking-tight leading-[0.9]">
              CREATE <br />
              <span className="text-emerald-400">CINEMATIC</span> <br />
              STORIES.
            </h1>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Professional video editing tools powered by AI. 
              Edit, animate, and export in 4K directly from your browser.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={onNewProject}
                className="px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-white/10"
              >
                Start New Project
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-black text-sm uppercase tracking-widest transition-all">
                Browse Templates
              </button>
            </div>
          </div>
          
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="w-64 h-96 glass rounded-2xl rotate-6 border-white/20 flex flex-col p-4 gap-4 shadow-2xl">
              <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center">
                <Play size={48} className="text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="h-12 bg-white/5 rounded-xl" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-white/10 rounded-lg" />
                <div className="h-8 w-8 bg-white/10 rounded-lg" />
                <div className="h-8 w-8 bg-white/10 rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black font-display uppercase tracking-tight">Recent Projects</h2>
              <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-white/40">{projects.length}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors w-64"
                />
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button className="p-1.5 bg-white/10 rounded text-white"><Grid size={16} /></button>
                <button className="p-1.5 hover:bg-white/10 rounded text-white/40"><ListIcon size={16} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* New Project Card */}
            <button 
              onClick={onNewProject}
              className="aspect-video rounded-3xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-white/40 group-hover:text-emerald-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white">Create New</span>
            </button>

            {/* Project Cards */}
            {projects.map(project => (
              <motion.div 
                key={project.id}
                layoutId={project.id}
                onClick={() => onOpenProject(project)}
                className="group aspect-video rounded-3xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all flex flex-col"
              >
                <div className="flex-1 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <Video size={48} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Play size={24} fill="black" className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono font-bold">
                    {project.duration.toFixed(0)}s
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{project.name}</div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                      <Clock size={10} />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="p-2 text-white/20 hover:text-white transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight">Trending Templates</h2>
            <button className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:underline">
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-shrink-0 w-48 aspect-[9/16] rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group cursor-pointer">
                <img src={`https://picsum.photos/seed/template${i}/400/700`} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs font-bold truncate">Cyberpunk Reel</div>
                  <div className="text-[10px] text-white/40">Used by 12.4k</div>
                </div>
                <div className="absolute top-3 left-3">
                  <div className="px-2 py-1 bg-emerald-500 text-black rounded text-[8px] font-black uppercase tracking-widest">HOT</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 px-8 glass-dark">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <Video size={20} />
            <span className="text-sm font-black font-display tracking-tighter uppercase">Dynasty Pro</span>
          </div>
          
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
          
          <div className="text-[10px] font-bold text-white/20">
            © 2026 DYNASTY PRO. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
