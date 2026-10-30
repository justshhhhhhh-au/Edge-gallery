import React from 'react';
import { useApp } from '../../context/AppContext';
import { TaskType } from '../../types';
import { 
  Sparkles, 
  MessageSquare, 
  Wrench, 
  FlaskConical, 
  Image as ImageIcon, 
  Flower2, 
  Smartphone, 
  Layers, 
  Gauge, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Brain,
  Globe
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { setActiveTask, selectedModel, setSelectedModel, models } = useApp();

  const handleLaunchGemma4 = () => {
    const gemma4 = models.find((m) => m.name === 'Gemma-4-E2B-it');
    if (gemma4) setSelectedModel(gemma4);
    setActiveTask('llm_chat');
  };

  const cards = [
    {
      id: 'node_map' as TaskType,
      title: 'Global Node Map & Telemetric Iguala',
      desc: 'Inspect real-time edge topology, live equalizers, and peer node synchronization across distributed models worldwide.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Telemetric Iguala',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300'
    },
    {
      id: 'llm_chat' as TaskType,
      title: 'AI Chat with Thinking Mode',
      desc: 'Engage in multi-turn reasoning with Gemma 4. Inspect the internal step-by-step reasoning trace under the hood.',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Gemma 4 Thinking',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
    },
    {
      id: 'llm_agent_chat' as TaskType,
      title: 'Agent Skills & Tool Calling',
      desc: 'Augment models with tools: Wikipedia lookup, interactive maps, QR generator, mood tracker, and piano.',
      icon: Wrench,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Interactive Tools',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
    },
    {
      id: 'tiny_garden' as TaskType,
      title: 'Tiny Garden Game',
      desc: 'Play a virtual garden mini-game using natural language. Plant, water, and harvest with FunctionGemma.',
      icon: Flower2,
      color: 'from-amber-500 to-orange-500',
      badge: 'Mini-Game',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
    },
    {
      id: 'mobile_actions' as TaskType,
      title: 'Mobile Actions',
      desc: 'Test offline device controls and action challenges (Flashlight, Calendar, Contacts, Email drafts).',
      icon: Smartphone,
      color: 'from-violet-500 to-purple-600',
      badge: 'Function Calling',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
    },
    {
      id: 'llm_prompt_lab' as TaskType,
      title: 'Prompt Lab',
      desc: 'Tune temperature, top-k, and system prompts. Compare single-turn responses with token throughput.',
      icon: FlaskConical,
      color: 'from-sky-500 to-blue-600',
      badge: 'Playground',
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
    },
    {
      id: 'llm_ask_image' as TaskType,
      title: 'Ask Image (Multimodal)',
      desc: 'Analyze visual inputs, identify objects, and ask questions using multimodal vision models.',
      icon: ImageIcon,
      color: 'from-pink-500 to-rose-600',
      badge: 'Vision AI',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
    },
    {
      id: 'model_manager' as TaskType,
      title: 'Models & Hardware Benchmark',
      desc: 'Browse official HuggingFace LiteRT models and benchmark prefill & decode token generation speed.',
      icon: Layers,
      color: 'from-slate-700 to-slate-900',
      badge: 'Performance',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      
      {/* Gemma 4 Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>LATEST RELEASE: GEMMA 4 FAMILY</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
              On-Device Generative AI with Thinking Mode
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Experience the next frontier in mobile intelligence. Gemma 4 introduces on-device reasoning traces, speculative decoding with LiteRT-LM, and 100% offline privacy with zero server dependence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-blue-200">
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>Thinking Process Traces</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Private & Offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>GPU / NPU Acceleration</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLaunchGemma4}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Try Gemma 4 Thinking</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setActiveTask('model_manager')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-medium text-sm transition-colors"
            >
              <span>View Allowlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Device & Hardware Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span>Runtime Engine</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            LiteRT-LM v2.16
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            Hardware acceleration active
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Active Model</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {selectedModel.name}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedModel.family} • {selectedModel.defaultConfig.accelerators.toUpperCase()}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Gauge className="w-4 h-4 text-indigo-500" />
            <span>Tokens / Second</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            ~34.2 tok/s
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Prefill: 178 tok/s
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Privacy Status</span>
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            100% On-Device
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Zero cloud data transfer
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Explore Capabilities
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Select a module to launch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTask(card.id)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Open Task</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Useful Links & References Footer */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Developer Resources & Ecosystem
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://huggingface.co/litert-community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Hugging Face Community</div>
              <div className="text-[11px] text-slate-500">Download LiteRT quantized weights</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://github.com/google-ai-edge/LiteRT-LM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">LiteRT-LM Repository</div>
              <div className="text-[11px] text-slate-500">High-performance LLM runtime</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://ai.google.dev/edge"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Google AI Edge Docs</div>
              <div className="text-[11px] text-slate-500">Guides, tutorials, and SDKs</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

    </div>
  );
};
