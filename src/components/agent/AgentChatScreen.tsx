import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, ToolCall } from '../../types';
import { runAgentInference } from '../../services/llmEngine';
import { 
  Wrench, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  MapPin, 
  QrCode, 
  Smile, 
  Binary, 
  Music, 
  Utensils, 
  Settings2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AgentChatScreen: React.FC = () => {
  const { selectedModel, skills, toggleSkill, agentMessages, setAgentMessages } = useApp();
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSkillsManagerOpen, setIsSkillsManagerOpen] = useState(false);
  const [activePianoNote, setActivePianoNote] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages, isGenerating]);

  // Web Audio Synth for Virtual Piano Skill
  const playPianoFreq = (freq: number, noteName: string) => {
    setActivePianoNote(noteName);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
    setTimeout(() => setActivePianoNote(null), 300);
  };

  const pianoKeys = [
    { note: 'C4', freq: 261.63, isBlack: false },
    { note: 'C#4', freq: 277.18, isBlack: true },
    { note: 'D4', freq: 293.66, isBlack: false },
    { note: 'D#4', freq: 311.13, isBlack: true },
    { note: 'E4', freq: 329.63, isBlack: false },
    { note: 'F4', freq: 349.23, isBlack: false },
    { note: 'F#4', freq: 369.99, isBlack: true },
    { note: 'G4', freq: 392.00, isBlack: false },
    { note: 'G#4', freq: 415.30, isBlack: true },
    { note: 'A4', freq: 440.00, isBlack: false },
    { note: 'A#4', freq: 466.16, isBlack: true },
    { note: 'B4', freq: 493.88, isBlack: false },
    { note: 'C5', freq: 523.25, isBlack: false },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isGenerating) return;

    setInputPrompt('');

    const userMsg: ChatMessage = {
      id: 'agent-user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setAgentMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await runAgentInference(text, selectedModel);
      const asstMsg: ChatMessage = {
        id: 'agent-asst-' + Date.now(),
        role: 'assistant',
        content: response.text,
        toolCalls: response.toolCalls,
        latencyStats: response.latencyStats,
        timestamp: Date.now()
      };
      setAgentMessages((prev) => [...prev, asstMsg]);
    } catch (err: any) {
      setAgentMessages((prev) => [
        ...prev,
        {
          id: 'agent-err-' + Date.now(),
          role: 'assistant',
          content: `Tool Execution Error: ${err.message}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSkillIcon = (id: string) => {
    switch (id) {
      case 'query-wikipedia': return Globe;
      case 'interactive-map': return MapPin;
      case 'qr-code': return QrCode;
      case 'mood-tracker': return Smile;
      case 'calculate-hash': return Binary;
      case 'virtual-piano': return Music;
      case 'kitchen-adventure':
      case 'restaurant-roulette': return Utensils;
      default: return Wrench;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Top Bar inside Agent Chat */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Agent Skills Hub</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                {skills.filter((s) => s.enabled).length} Tools Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Autonomous on-device tool grounding & execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAgentMessages([])}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSkillsManagerOpen(!isSkillsManagerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSkillsManagerOpen
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Manage Skills</span>
          </button>
        </div>
      </div>

      {/* Skills Drawer */}
      {isSkillsManagerOpen && (
        <div className="mb-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Installed Edge Skills ({skills.length})</span>
            <span className="text-slate-400 font-normal">Toggle to enable or disable tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {skills.map((skill) => {
              const Icon = getSkillIcon(skill.id);
              return (
                <div
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    skill.enabled
                      ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${skill.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-semibold truncate">{skill.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={skill.enabled}
                    onChange={() => {}}
                    className="accent-emerald-600 w-3.5 h-3.5 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {agentMessages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Message text bubble */}
              <div
                className={`max-w-3xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Tool Call Cards */}
                {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.toolCalls.map((tc) => {
                      const Icon = getSkillIcon(tc.skillId);
                      return (
                        <div
                          key={tc.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 space-y-2.5 overflow-hidden"
                        >
                          {/* Tool Header */}
                          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
                            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                              <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span>Tool Executed: {tc.skillName}</span>
                            </div>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Success
                            </span>
                          </div>

                          {/* Interactive Tool Outputs */}
                          {tc.result?.webviewUrl && (
                            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-64 bg-slate-200">
                              <iframe
                                src={tc.result.webviewUrl}
                                title="Skill View"
                                className="w-full h-full border-0"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {tc.result?.imageUrl && (
                            <div className="flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                              <img
                                src={tc.result.imageUrl}
                                alt="Generated result"
                                className="w-48 h-48 object-contain rounded-md"
                              />
                              <span className="text-[11px] text-slate-500 mt-2 font-mono">
                                Scan with any camera
                              </span>
                            </div>
                          )}

                          {tc.result?.result && !tc.result.webviewUrl && !tc.result.imageUrl && (
                            <div className="text-xs bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800 font-sans whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                              {tc.result.result}
                            </div>
                          )}

                          {/* Virtual Piano Interactive Widget */}
                          {tc.skillId === 'virtual-piano' && (
                            <div className="bg-slate-900 p-4 rounded-xl text-white space-y-3">
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>Interactive Web Audio Synth</span>
                                <span>Click keys to play notes</span>
                              </div>
                              <div className="flex justify-center items-end h-28 select-none overflow-x-auto pb-1">
                                {pianoKeys.map((k) => (
                                  <button
                                    key={k.note}
                                    onClick={() => playPianoFreq(k.freq, k.note)}
                                    className={`relative transition-all ${
                                      k.isBlack
                                        ? `w-6 h-18 -mx-3 z-10 rounded-b-md ${activePianoNote === k.note ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'}`
                                        : `w-9 h-28 rounded-b-lg border border-slate-300 ${activePianoNote === k.note ? 'bg-emerald-200' : 'bg-white hover:bg-slate-100'} text-slate-800 text-[10px] font-bold flex items-end justify-center pb-2`
                                    }`}
                                  >
                                    {!k.isBlack && k.note}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Extra Link for Wikipedia */}
                          {tc.result?.data?.url && (
                            <div className="text-right">
                              <a
                                href={tc.result.data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <span>Open full Wikipedia article</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Agent evaluating and executing tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Triggers */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
        <button
          onClick={() => handleSend('Tell me about the LiteRT machine learning runtime on Wikipedia')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          🌐 Search Wikipedia
        </button>
        <button
          onClick={() => handleSend('Show me the map of Eiffel Tower, Paris')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          📍 Map Eiffel Tower
        </button>
        <button
          onClick={() => handleSend('Generate a QR code for https://github.com/google-ai-edge/gallery')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          📱 QR Code
        </button>
        <button
          onClick={() => handleSend('Log my mood today as 9/10 feeling productive and energized')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          😊 Log Mood
        </button>
        <button
          onClick={() => handleSend('Let us play some chords on the virtual piano')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          🎹 Virtual Piano
        </button>
      </div>

      {/* Input */}
      <div className="pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask agent with tools (e.g. 'Show map of Kyoto', 'Calculate sha256 of test')..."
            disabled={isGenerating}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isGenerating || !inputPrompt.trim()}
            className={`mr-2 p-2 rounded-xl transition-all ${
              isGenerating || !inputPrompt.trim()
                ? 'text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
                : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
