import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runInferenceStream } from '../../services/llmEngine';
import { LatencyStats } from '../../types';
import { 
  FlaskConical, 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  SlidersHorizontal, 
  Clock, 
  Zap, 
  Cpu, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface PromptTemplate {
  title: string;
  category: string;
  system: string;
  prompt: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    title: 'Executive 3-Bullet Summary',
    category: 'Summarization',
    system: 'You are an executive assistant. Condense all input into exactly three high-impact bullet points with a bold takeaway.',
    prompt: 'On-device machine learning with Google AI Edge allows mobile developers to run models like Gemma directly on the user\'s local hardware. This architecture eliminates cloud server inference costs, protects user privacy completely by keeping sensitive text and images on device, and guarantees operation without requiring network connectivity.'
  },
  {
    title: 'Extract JSON Schema',
    category: 'Information Extraction',
    system: 'Extract structured details into valid JSON schema. Output pure JSON without markdown wrappers.',
    prompt: 'Dr. Jane Smith scheduled a cardiac review with patient Robert Chen at St. Jude Hospital on November 14, 2026 at 2:30 PM. Follow-up blood test required in 14 days.'
  },
  {
    title: 'Step-by-Step Math Reasoning',
    category: 'Logic & Reasoning',
    system: 'Think step-by-step. Break the problem into verified mathematical equations before delivering the final answer.',
    prompt: 'A train leaves Station A traveling at 80 km/h towards Station B, 240 km away. At the same time, another train leaves Station B heading toward Station A at 100 km/h. At what time and distance from Station A do they meet?'
  },
  {
    title: 'TypeScript Refactor & Clean Code',
    category: 'Coding',
    system: 'You are a staff software engineer. Refactor the input code for optimal type safety, performance, and readability.',
    prompt: 'function fetchUser(id) {\n  return fetch("/api/users/" + id).then(r => r.json()).then(data => {\n    return { id: data.id, name: data.first_name + " " + data.last_name, email: data.email };\n  });\n}'
  }
];

export const PromptLabScreen: React.FC = () => {
  const { selectedModel } = useApp();
  const [promptText, setPromptText] = useState(TEMPLATES[0].prompt);
  const [systemPrompt, setSystemPrompt] = useState(TEMPLATES[0].system);
  const [temperature, setTemperature] = useState(selectedModel.defaultConfig.temperature);
  const [topK, setTopK] = useState(selectedModel.defaultConfig.topK);
  const [topP, setTopP] = useState(selectedModel.defaultConfig.topP);
  const [maxTokens, setMaxTokens] = useState(selectedModel.defaultConfig.maxTokens);

  const [outputResult, setOutputResult] = useState('');
  const [thinkingResult, setThinkingResult] = useState<string | undefined>();
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleApplyTemplate = (tmpl: PromptTemplate) => {
    setPromptText(tmpl.prompt);
    setSystemPrompt(tmpl.system);
    setOutputResult('');
    setThinkingResult(undefined);
    setLatencyStats(null);
  };

  const handleRun = async () => {
    if (!promptText.trim() || isRunning) return;
    setIsRunning(true);
    setOutputResult('');
    setThinkingResult(undefined);
    setLatencyStats(null);

    try {
      let accumulatedText = '';
      let accumulatedThought = '';

      const res = await runInferenceStream(
        promptText,
        {
          ...selectedModel,
          defaultConfig: {
            ...selectedModel.defaultConfig,
            temperature,
            topK,
            topP,
            maxTokens
          }
        },
        systemPrompt,
        (chunk) => {
          if (chunk.isThinking) {
            accumulatedThought += chunk.token;
            setThinkingResult(accumulatedThought);
          } else {
            accumulatedText += chunk.token;
            setOutputResult(accumulatedText);
          }
        }
      );

      setOutputResult(res.text);
      setThinkingResult(res.thought);
      setLatencyStats(res.latencyStats);
    } catch (err: any) {
      setOutputResult(`Execution Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Prompt Lab
            </h1>
            <p className="text-xs text-slate-500">
              Single-turn testing, template exploration, and fine-grained parameter tuning
            </p>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning || !promptText.trim()}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
            isRunning || !promptText.trim()
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 active:scale-98'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRunning ? 'Inferencing...' : 'Run Single Turn'}</span>
        </button>
      </div>

      {/* Preset Templates */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Prompt Templates:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              onClick={() => handleApplyTemplate(tmpl)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 whitespace-nowrap transition-colors"
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: System Prompt, User Prompt, Parameters */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* System Prompt */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              System Instruction
            </label>
            <textarea
              rows={2}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Define model behavior or constraints..."
            />
          </div>

          {/* User Prompt */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Input Prompt
            </label>
            <textarea
              rows={6}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              placeholder="Enter your prompt here..."
            />
          </div>

          {/* Hyperparameters Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
              <span>Inference Parameters</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-400 mb-1">
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
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-400 mb-1">
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
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-400 mb-1">
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
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span>Max Tokens</span>
                  <span>{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="4096"
                  step="128"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output & Hardware Metrics */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col h-full min-h-[440px]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Model Output ({selectedModel.name})
                </span>
              </div>

              {outputResult && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Thought trace if present */}
            {thinkingResult && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] font-mono text-amber-900 dark:text-amber-200 whitespace-pre-wrap">
                <div className="font-bold mb-1 text-amber-800 dark:text-amber-300">
                  Thinking Trace:
                </div>
                {thinkingResult}
              </div>
            )}

            {/* Main Result Content */}
            <div className="flex-1 overflow-y-auto text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap pr-1">
              {outputResult ? (
                outputResult
              ) : isRunning ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2" />
                  Generating tokens on-device...
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center py-12">
                  <FlaskConical className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Click "Run Single Turn" to see model generation</span>
                </div>
              )}
            </div>

            {/* Hardware Metrics Footer */}
            {latencyStats && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <div className="text-[10px] text-slate-400 uppercase">TTFT</div>
                  <div className="font-bold text-slate-900 dark:text-white">{latencyStats.ttftMs} ms</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <div className="text-[10px] text-slate-400 uppercase">Prefill Speed</div>
                  <div className="font-bold text-slate-900 dark:text-white">{latencyStats.prefillSpeed} tok/s</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <div className="text-[10px] text-slate-400 uppercase">Decode Speed</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">{latencyStats.decodeSpeed} tok/s</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <div className="text-[10px] text-slate-400 uppercase">Total Tokens</div>
                  <div className="font-bold text-slate-900 dark:text-white">{latencyStats.totalTokens}</div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
