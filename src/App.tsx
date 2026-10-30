import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { HomeScreen } from './components/home/HomeScreen';
import { LlmChatScreen } from './components/chat/LlmChatScreen';
import { AgentChatScreen } from './components/agent/AgentChatScreen';
import { PromptLabScreen } from './components/promptlab/PromptLabScreen';
import { AskImageScreen } from './components/multimodal/AskImageScreen';
import { TinyGardenScreen } from './components/tinygarden/TinyGardenScreen';
import { MobileActionsScreen } from './components/mobileactions/MobileActionsScreen';
import { ModelManagerScreen } from './components/models/ModelManagerScreen';
import { GlobalNodeMapScreen } from './components/nodemap/GlobalNodeMapScreen';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  const { activeTask } = useApp();

  const renderActiveScreen = () => {
    switch (activeTask) {
      case 'home':
        return <HomeScreen />;
      case 'node_map':
        return <GlobalNodeMapScreen />;
      case 'llm_chat':
        return <LlmChatScreen />;
      case 'llm_agent_chat':
        return <AgentChatScreen />;
      case 'llm_prompt_lab':
        return <PromptLabScreen />;
      case 'llm_ask_image':
        return <AskImageScreen />;
      case 'tiny_garden':
        return <TinyGardenScreen />;
      case 'mobile_actions':
        return <MobileActionsScreen />;
      case 'model_manager':
      case 'benchmark':
        return <ModelManagerScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-[#202124] dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header />
      <Navigation />
      
      <main className="flex-1 overflow-x-hidden">
        {renderActiveScreen()}
      </main>

      <SettingsModal />
    </div>
  );
};
