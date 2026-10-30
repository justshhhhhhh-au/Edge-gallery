import React, { createContext, useContext, useState, useEffect } from 'react';
import { ModelInfo, TaskType, Skill, BenchmarkRecord, ChatMessage } from '../types';
import { INITIAL_MODELS } from '../data/models';
import { INITIAL_SKILLS } from '../data/skills';

interface AppContextType {
  activeTask: TaskType;
  setActiveTask: (task: TaskType) => void;
  models: ModelInfo[];
  selectedModel: ModelInfo;
  setSelectedModel: (model: ModelInfo) => void;
  downloadModel: (modelName: string) => void;
  deleteModel: (modelName: string) => void;
  skills: Skill[];
  toggleSkill: (skillId: string) => void;
  benchmarkHistory: BenchmarkRecord[];
  addBenchmarkRecord: (record: BenchmarkRecord) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  agentMessages: ChatMessage[];
  setAgentMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTask, setActiveTask] = useState<TaskType>('home');
  const [models, setModels] = useState<ModelInfo[]>(() => {
    const saved = localStorage.getItem('edge_gallery_models');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MODELS;
  });

  const [selectedModel, setSelectedModel] = useState<ModelInfo>(() => {
    return models.find((m) => m.name === 'Gemma-4-E2B-it') || models[0];
  });

  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  
  const [benchmarkHistory, setBenchmarkHistory] = useState<BenchmarkRecord[]>(() => {
    const saved = localStorage.getItem('edge_gallery_benchmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'bm-1',
        modelName: 'Gemma-4-E2B-it',
        timestamp: Date.now() - 3600000 * 2,
        prefillSpeed: 178,
        decodeSpeed: 34,
        ttftMs: 92,
        memoryMb: 2480,
        tokensGenerated: 256
      },
      {
        id: 'bm-2',
        modelName: 'Gemma3-1B-IT q4',
        timestamp: Date.now() - 3600000 * 1,
        prefillSpeed: 245,
        decodeSpeed: 52,
        ttftMs: 64,
        memoryMb: 940,
        tokensGenerated: 256
      }
    ];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Welcome to **Google AI Edge Gallery**! I am running locally using **Gemma 4 with Thinking Mode**.\n\nYou can test multi-turn conversations, observe my internal reasoning trace, test Prompt Lab templates, or execute Agent Skills.',
      timestamp: Date.now()
    }
  ]);

  const [agentMessages, setAgentMessages] = useState<ChatMessage[]>([
    {
      id: 'agent-welcome',
      role: 'assistant',
      content: 'Agent Chat initialized with on-device skills: **Wikipedia Search**, **Interactive Map**, **QR Code Generator**, **Mood Tracker**, **Hash Calculator**, and **Virtual Piano**.\n\nTry asking:\n- "What is the James Webb Space Telescope according to Wikipedia?"\n- "Show me a map of Central Park, New York"\n- "Generate a QR code for https://ai.google.dev"\n- "Log my mood today as 9/10 feeling productive"',
      timestamp: Date.now()
    }
  ]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('edge_gallery_models', JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem('edge_gallery_benchmarks', JSON.stringify(benchmarkHistory));
  }, [benchmarkHistory]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const downloadModel = (modelName: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.name === modelName) {
          return { ...m, isDownloaded: false, downloadProgress: 10 };
        }
        return m;
      })
    );

    // Simulate steady download steps
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        clearInterval(interval);
        setModels((prev) =>
          prev.map((m) => {
            if (m.name === modelName) {
              return { ...m, isDownloaded: true, downloadProgress: 100 };
            }
            return m;
          })
        );
      } else {
        setModels((prev) =>
          prev.map((m) => {
            if (m.name === modelName) {
              return { ...m, downloadProgress: progress };
            }
            return m;
          })
        );
      }
    }, 400);
  };

  const deleteModel = (modelName: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.name === modelName) {
          return { ...m, isDownloaded: false, downloadProgress: 0 };
        }
        return m;
      })
    );
  };

  const addBenchmarkRecord = (record: BenchmarkRecord) => {
    setBenchmarkHistory((prev) => [record, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTask,
        setActiveTask,
        models,
        selectedModel,
        setSelectedModel,
        downloadModel,
        deleteModel,
        skills,
        toggleSkill,
        benchmarkHistory,
        addBenchmarkRecord,
        chatMessages,
        setChatMessages,
        agentMessages,
        setAgentMessages,
        theme,
        toggleTheme,
        isSettingsOpen,
        setIsSettingsOpen
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
