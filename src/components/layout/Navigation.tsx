import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskType } from '../../types';
import { 
  Home, 
  MessageSquare, 
  Wrench, 
  FlaskConical, 
  Image as ImageIcon, 
  Flower2, 
  Smartphone, 
  Layers,
  Globe
} from 'lucide-react';

interface TabItem {
  id: TaskType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navigation: React.FC = () => {
  const { activeTask, setActiveTask } = useApp();

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'node_map', label: 'Global Node Map', icon: Globe, badge: 'Iguala' },
    { id: 'llm_chat', label: 'AI Chat', icon: MessageSquare, badge: 'Thinking' },
    { id: 'llm_agent_chat', label: 'Agent Skills', icon: Wrench },
    { id: 'llm_prompt_lab', label: 'Prompt Lab', icon: FlaskConical },
    { id: 'llm_ask_image', label: 'Ask Image', icon: ImageIcon },
    { id: 'tiny_garden', label: 'Tiny Garden', icon: Flower2, badge: 'Game' },
    { id: 'mobile_actions', label: 'Mobile Actions', icon: Smartphone },
    { id: 'model_manager', label: 'Models & Benchmark', icon: Layers }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTask === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTask(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  isActive 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
