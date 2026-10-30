import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Trash2, 
  ExternalLink, 
  Sparkles,
  Info
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, theme, toggleTheme } = useApp();

  if (!isSettingsOpen) return null;

  const handleClearAll = () => {
    if (confirm('Reset all cached models and benchmark logs?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Edge Settings & About
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Accelerator Options */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>Hardware Acceleration Pipeline</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Vulkan GPU', 'Hexagon NPU', 'Multi-core CPU'].map((acc, i) => (
                <div
                  key={acc}
                  className={`p-2.5 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? 'bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950 dark:border-blue-600 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {acc}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Vulkan backend automatically balances work between GPU compute shaders and CPU fallbacks.
            </p>
          </div>

          {/* Privacy */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                Zero Cloud Telemetry & 100% Privacy
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400/90 leading-relaxed mt-0.5">
                All model execution, thought traces, audio notes, and prompt histories run locally inside the client runtime. No data is stored externally.
              </p>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Clear Local Data
              </div>
              <div className="text-[11px] text-slate-500">
                Reset benchmark histories and model cache
              </div>
            </div>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* About section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              Google AI Edge Gallery v1.0.16
            </div>
            <p className="text-[11px]">
              Licensed under Apache 2.0. Built with Google AI Edge, LiteRT, and Gemma 4.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
