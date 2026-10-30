import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Cpu, 
  Moon, 
  Sun, 
  Settings as SettingsIcon, 
  ChevronDown, 
  ChevronLeft,
  CheckCircle2,
  HardDrive,
  Globe,
  Activity
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTask, 
    setActiveTask, 
    selectedModel, 
    models, 
    setSelectedModel, 
    theme, 
    toggleTheme, 
    setIsSettingsOpen 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          {activeTask !== 'home' && (
            <button
              onClick={() => setActiveTask('home')}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Return to Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => setActiveTask('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight font-sans">
                  AI Edge Gallery
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  LiteRT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                On-Device Generative AI Sandbox
              </p>
            </div>
          </div>
        </div>

        {/* Center: Model Selector Dropdown Chip & Telemetry Iguala Pill */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <select
              value={selectedModel.name}
              onChange={(e) => {
                const found = models.find((m) => m.name === e.target.value);
                if (found) setSelectedModel(found);
              }}
              className="appearance-none cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-full pl-3 pr-8 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-xs"
            >
              {models.map((m) => (
                <option key={m.name} value={m.name} className="dark:bg-slate-900">
                  {m.name} {m.isDownloaded ? '✓' : '(Ready to DL)'}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setActiveTask('node_map')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              activeTask === 'node_map'
                ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Open Global Node Map & Telemetric Iguala"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono font-semibold text-[11px]">Iguala: 98%</span>
          </button>
        </div>

        {/* Right: Hardware badge, Theme, Settings */}
        <div className="flex items-center gap-2">
          {/* Accelerator Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>GPU+NPU</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
