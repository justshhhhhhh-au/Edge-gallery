import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, LatencyStats } from '../../types';
import { runInferenceStream } from '../../services/llmEngine';
import { 
  Send, 
  Sparkles, 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Copy, 
  Check, 
  SlidersHorizontal, 
  Zap, 
  Clock, 
  Cpu, 
  Trash2 
} from 'lucide-react';

export const LlmChatScreen: React.FC = () => {
  const { selectedModel, chatMessages, setChatMessages } = useApp();
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are an expert, concise on-device AI assistant powered by Google AI Edge and Gemma.');
  const [temperature, setTemperature] = useState(selectedModel.defaultConfig.temperature);
  const [topK, setTopK] = useState(selectedModel.defaultConfig.topK);
  const [topP, setTopP] = useState(selectedModel.defaultConfig.topP);
  const [mtpEnabled, setMtpEnabled] = useState(true);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGenerating]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isGenerating) return;

    setInputPrompt('');

    const userMessageId = 'msg-' + Date.now();
    const assistantMessageId = 'asst-' + (Date.now() + 1);

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };

    const initialAsstMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      thinkingContent: selectedModel.capabilities.includes('llm_thinking') ? '' : undefined,
      timestamp: Date.now()
    };

    setChatMessages((prev) => [...prev, userMsg, initialAsstMsg]);
    setIsGenerating(true);

    // Expand thinking by default for current stream
    setExpandedThinking((prev) => ({ ...prev, [assistantMessageId]: true }));

    try {
      let accumulatedText = '';
      let accumulatedThought = '';

      const result = await runInferenceStream(
        prompt,
        { ...selectedModel, defaultConfig: { ...selectedModel.defaultConfig, temperature, topK, topP } },
        systemPrompt,
        (chunk) => {
          if (chunk.isThinking) {
            accumulatedThought += chunk.token;
            setChatMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, thinkingContent: accumulatedThought }
                  : msg
              )
            );
          } else {
            accumulatedText += chunk.token;
            setChatMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }
      );

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: result.text,
                thinkingContent: result.thought,
                latencyStats: result.latencyStats
              }
            : msg
        )
      );
    } catch (err: any) {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: `Error during inference: ${err.message}` }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const samplePrompts = [
    'How does Gemma 4 Thinking Mode work on mobile?',
    'Write a concise Kotlin snippet for LiteRT-LM',
    'Compare speculative decoding vs greedy decoding',
    'Solve this puzzle: If 3 cats catch 3 mice in 3 minutes, how long for 100 cats to catch 100 mice?'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Top Bar inside Chat */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{selectedModel.name}</span>
              {selectedModel.capabilities.includes('llm_thinking') && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
                  Thinking Mode
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500">
              LiteRT Context: {selectedModel.defaultConfig.maxContextLength || 4096} tokens
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatMessages([])}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isConfigOpen
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* Model Config Drawer (Collapsible) */}
      {isConfigOpen && (
        <div className="mb-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Temperature</span>
              <span>{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Top-K</span>
              <span>{topK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="128"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Top-P</span>
              <span>{topP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>Multi-Token Prediction</span>
              <span className={mtpEnabled ? 'text-blue-600' : 'text-slate-400'}>{mtpEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <button
              onClick={() => setMtpEnabled(!mtpEnabled)}
              className="w-full py-1 px-2 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-center border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Toggle MTP Mode
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Ready for on-device reasoning
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter your question below or pick a prompt starter to test Gemma 4's Thinking Mode.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {samplePrompts.map((sp) => (
                <button
                  key={sp}
                  onClick={() => handleSendMessage(sp)}
                  className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            const isThinkingOpen = expandedThinking[msg.id] ?? true;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Thinking Mode Accordion for Assistant */}
                {!isUser && msg.thinkingContent && (
                  <div className="max-w-3xl w-full rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-3 transition-all mb-1">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-300 hover:opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse-subtle" />
                        <span>Reasoning Process (Thinking Trace)</span>
                      </div>
                      {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isThinkingOpen && (
                      <div className="mt-2 text-xs font-mono text-amber-900 dark:text-amber-200/90 whitespace-pre-wrap leading-relaxed border-t border-amber-200/60 dark:border-amber-900/40 pt-2">
                        {msg.thinkingContent}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-3xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content || (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 italic">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        Generating response...
                      </span>
                    )}
                  </div>

                  {/* Latency Stats Badge */}
                  {!isUser && msg.latencyStats && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>TTFT: {msg.latencyStats.ttftMs}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Decode: {msg.latencyStats.decodeSpeed} tok/s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-blue-500" />
                        <span>Prefill: {msg.latencyStats.prefillSpeed} tok/s</span>
                      </div>
                      <span>({msg.latencyStats.totalTokens} tokens)</span>
                    </div>
                  )}

                  {/* Copy Button */}
                  {!isUser && msg.content && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask ${selectedModel.name}...`}
            disabled={isGenerating}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isGenerating || !inputPrompt.trim()}
            className={`mr-2 p-2 rounded-xl transition-all ${
              isGenerating || !inputPrompt.trim()
                ? 'text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700 shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
