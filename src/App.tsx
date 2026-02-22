import React, { useState, useEffect } from 'react';
import { Project, User } from './types';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import { motion, AnimatePresence } from 'motion/react';

const DEMO_USER: User = {
  id: 'demo-user',
  email: 'creator@dynasty.pro',
  name: 'Alex Dynasty',
  plan: 'LIFETIME',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};

export default function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  const handleNewProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Untitled Project',
      clips: [],
      duration: 30,
      aspectRatio: '9:16',
      fps: 30,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(newProject);
    setView('editor');
  };

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    setView('editor');
  };

  const handleSaveProject = async (project: Project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          userId: DEMO_USER.id,
          name: project.name,
          data: project,
          thumbnail: project.thumbnail || `https://picsum.photos/seed/${project.id}/400/225`
        })
      });
      if (response.ok) {
        console.log('Project saved successfully');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Dashboard 
              user={DEMO_USER}
              onNewProject={handleNewProject}
              onOpenProject={handleOpenProject}
              onLogout={() => console.log('Logout')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentProject && (
              <Editor 
                project={currentProject}
                onSave={handleSaveProject}
                onBack={() => setView('dashboard')}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
