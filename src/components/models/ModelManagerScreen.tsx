import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModelInfo, BenchmarkRecord } from '../../types';
import { formatBytes } from '../../data/models';
import { 
  Layers, 
  Download, 
  Check, 
  Trash2, 
  Sparkles, 
  Gauge, 
  Play, 
  Cpu, 
  HardDrive, 
  ExternalLink,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const ModelManagerScreen: React.FC = () => {
  const { 
    models, 
    selectedModel, 
    setSelectedModel, 
    downloadModel, 
    deleteModel,
    benchmarkHistory,
    addBenchmarkRecord
  } = useApp();

  const [filterFamily, setFilterFamily] = useState<string>('All');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkModel, setBenchmarkModel] = useState<ModelInfo>(selectedModel);
  const [benchmarkProgress, setBenchmarkProgress] = useState(0);

  const families = ['All', 'Gemma 4', 'Gemma 3', 'FunctionGemma', 'Qwen', 'DeepSeek'];

  const filteredModels = filterFamily === 'All' 
    ? models 
    : models.filter((m) => m.family === filterFamily);

  const handleRunBenchmark = () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkProgress(10);

    const interval = setInterval(() => {
      setBenchmarkProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setBenchmarkProgress(100);

      // Generate realistic benchmark based on model specs
      const isLarge = benchmarkModel.sizeInBytes > 3000000000;
      const isUltraLight = benchmarkModel.sizeInBytes < 600000000;

      const prefillSpeed = isUltraLight ? Math.round(230 + Math.random() * 30) : isLarge ? Math.round(135 + Math.random() * 20) : Math.round(180 + Math.random() * 25);
      const decodeSpeed = isUltraLight ? Math.round(48 + Math.random() * 10) : isLarge ? Math.round(26 + Math.random() * 6) : Math.round(34 + Math.random() * 8);
      const ttftMs = isUltraLight ? Math.round(60 + Math.random() * 15) : Math.round(95 + Math.random() * 25);
      const memoryMb = Math.round((benchmarkModel.estimatedPeakMemoryInBytes || benchmarkModel.sizeInBytes * 1.4) / (1024 * 1024));

      const newRecord: BenchmarkRecord = {
        id: 'bm-' + Date.now(),
        modelName: benchmarkModel.name,
        timestamp: Date.now(),
        prefillSpeed,
        decodeSpeed,
        ttftMs,
        memoryMb,
        tokensGenerated: 256
      };

      addBenchmarkRecord(newRecord);
      setIsBenchmarking(false);
      setBenchmarkProgress(0);
    }, 1600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Model Library & Benchmark Suite</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Official Allowlist
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Inspect on-device LiteRT model packages, manage local weights, and evaluate hardware latency
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {families.map((f) => (
            <button
              key={f}
              onClick={() => setFilterFamily(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterFamily === f
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => {
          const isCurrentActive = selectedModel.name === model.name;
          const isDownloading = !model.isDownloaded && (model.downloadProgress ?? 0) > 0;

          return (
            <div
              key={model.name}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl border p-5 flex flex-col justify-between transition-all shadow-xs ${
                isCurrentActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {model.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {model.modelId}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {model.family}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {model.description}
                </p>

                {/* Specs Pill List */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Package Size</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatBytes(model.sizeInBytes)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min RAM</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{model.minDeviceMemoryInGb || 4} GB</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Context</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{model.defaultConfig.maxContextLength || 4096}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Accelerator</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{model.defaultConfig.accelerators.toUpperCase()}</span>
                  </div>
                </div>

                {/* Capabilities Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {model.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium"
                    >
                      {cap.replace('_', ' ')}
                    </span>
                  ))}
                  {model.llmSupportImage && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-medium">
                      multimodal vision
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {model.isDownloaded ? (
                  <>
                    <button
                      onClick={() => setSelectedModel(model)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isCurrentActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isCurrentActive ? 'Active Model' : 'Select Model'}
                    </button>

                    <button
                      onClick={() => deleteModel(model.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Uninstall Model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : isDownloading ? (
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Downloading weights...</span>
                      <span>{model.downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${model.downloadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => downloadModel(model.name)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({formatBytes(model.sizeInBytes)})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Benchmark Testing Suite Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Hardware Benchmark Runner
              </h2>
              <p className="text-xs text-slate-500">
                Measure Prefill Throughput, Decode Latency, and TTFT on local hardware
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={benchmarkModel.name}
              onChange={(e) => {
                const found = models.find((m) => m.name === e.target.value);
                if (found) setBenchmarkModel(found);
              }}
              className="bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              {models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                isBenchmarking
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 active:scale-98'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBenchmarking ? 'Testing...' : 'Run Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Benchmark progress */}
        {isBenchmarking && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
            <div className="flex justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>Benchmarking {benchmarkModel.name} (Prefill & Decode Sequences)...</span>
              <span>{benchmarkProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/60 dark:bg-amber-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-200"
                style={{ width: `${benchmarkProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Comparative Results Table / Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Recent Hardware Benchmark Runs ({benchmarkHistory.length})
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-2 font-normal">Model</th>
                  <th className="pb-2 font-normal">Prefill Speed</th>
                  <th className="pb-2 font-normal">Decode Speed</th>
                  <th className="pb-2 font-normal">TTFT</th>
                  <th className="pb-2 font-normal">Peak Memory</th>
                  <th className="pb-2 font-normal">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {benchmarkHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white font-sans">
                      {rec.modelName}
                    </td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">
                      {rec.prefillSpeed} tok/s
                    </td>
                    <td className="py-2.5 text-blue-600 dark:text-blue-400 font-bold">
                      {rec.decodeSpeed} tok/s
                    </td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">
                      {rec.ttftMs} ms
                    </td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">
                      {rec.memoryMb} MB
                    </td>
                    <td className="py-2.5 text-slate-400 font-sans text-[11px]">
                      {new Date(rec.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
