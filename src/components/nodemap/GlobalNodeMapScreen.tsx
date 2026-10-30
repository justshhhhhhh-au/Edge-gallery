import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { EdgeNode, SynapticConduit, TelemetryIguala } from '../../types';
import { INITIAL_EDGE_NODES, SYNAPTIC_CONDUITS } from '../../data/edgeNodes';
import { 
  Globe, 
  Activity, 
  Cpu, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  Send, 
  Maximize2, 
  Layers, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Thermometer,
  Radio,
  Server,
  X,
  Flame
} from 'lucide-react';

export const GlobalNodeMapScreen: React.FC = () => {
  const { models, setSelectedModel, setActiveTask } = useApp();
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_EDGE_NODES);
  const [selectedNode, setSelectedNode] = useState<EdgeNode | null>(INITIAL_EDGE_NODES[0]);
  const [filterFamily, setFilterFamily] = useState<string>('All');
  const [isSimulatingPulse, setIsSimulatingPulse] = useState(false);
  const [pulseCounter, setPulseCounter] = useState(0);
  const [isEqualizerModalOpen, setIsEqualizerModalOpen] = useState(false);

  // Live telemetry perturbation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          // Subtle realistic telemetry micro-variations
          const deltaBalance = (Math.random() - 0.5) * 0.4;
          const newBalance = Math.min(100, Math.max(90, n.telemetry.balanceRatio + deltaBalance));
          const deltaDecode = (Math.random() - 0.5) * 1.2;
          const newDecode = Math.max(15, n.telemetry.decodeTokPerSec + deltaDecode);
          const deltaTemp = (Math.random() - 0.5) * 0.2;
          const newTemp = Math.min(55, Math.max(34, n.telemetry.thermalTempC + deltaTemp));

          return {
            ...n,
            telemetry: {
              ...n.telemetry,
              balanceRatio: parseFloat(newBalance.toFixed(1)),
              decodeTokPerSec: parseFloat(newDecode.toFixed(1)),
              thermalTempC: parseFloat(newTemp.toFixed(1)),
              lastPulseMs: Math.round(70 + Math.random() * 80)
            }
          };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const filteredNodes = filterFamily === 'All'
    ? nodes
    : nodes.filter((n) => n.modelFamily === filterFamily);

  const handleSimulateMeshPulse = () => {
    setIsSimulatingPulse(true);
    setPulseCounter((c) => c + 1);

    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: 'inferencing',
        telemetry: {
          ...n.telemetry,
          balanceRatio: parseFloat((99.0 + Math.random() * 0.9).toFixed(1)),
          lastPulseMs: Math.round(40 + Math.random() * 30)
        }
      }))
    );

    setTimeout(() => {
      setIsSimulatingPulse(false);
      setNodes((prev) =>
        prev.map((n, i) => ({
          ...n,
          status: i % 2 === 0 ? 'synced' : 'active'
        }))
      );
    }, 1800);
  };

  const handleSelectModelFromNode = (node: EdgeNode) => {
    const matched = models.find((m) => m.name === node.modelName);
    if (matched) {
      setSelectedModel(matched);
      setActiveTask('llm_chat');
    }
  };

  // Compute aggregate network telemetry
  const avgBalance = (nodes.reduce((acc, n) => acc + n.telemetry.balanceRatio, 0) / nodes.length).toFixed(1);
  const totalTokensSec = Math.round(nodes.reduce((acc, n) => acc + n.telemetry.decodeTokPerSec, 0));
  const avgTtft = Math.round(nodes.reduce((acc, n) => acc + n.telemetry.ttftMs, 0) / nodes.length);
  const avgTemp = (nodes.reduce((acc, n) => acc + n.telemetry.thermalTempC, 0) / nodes.length).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Globe className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Global Node Map & Telemetric Iguala</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300/40">
                Peer Mesh Connected
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Live equalized telemetry across distributed Google AI Edge nodes running Gemma 4, FunctionGemma, and LiteRT
            </p>
          </div>
        </div>

        {/* Global Action & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
            {['All', 'Gemma 4', 'Gemma 3', 'FunctionGemma'].map((fam) => (
              <button
                key={fam}
                onClick={() => setFilterFamily(fam)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterFamily === fam
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateMeshPulse}
            disabled={isSimulatingPulse}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              isSimulatingPulse
                ? 'bg-cyan-500 animate-pulse cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 active:scale-98'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isSimulatingPulse ? 'Transmitting Pulse...' : 'Send Iguala Pulse'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Telemetric Iguala Gauge Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Iguala Equilibrium</span>
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">
            {avgBalance}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Load balance parity across 8 nodes
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Aggregate Throughput</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {totalTokensSec} <span className="text-xs font-normal text-slate-400">tok/s</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Combined token generation rate
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Mesh Prefill Latency (TTFT)</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {avgTtft} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Average time to first token
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Thermal Dissipation</span>
            <Thermometer className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {avgTemp}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Optimal thermal throttling margin
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Synaptic Topology Visualizer */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        
        {/* Ambient Map Grid & Background Art */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* World Map SVG Projection Outline */}
        <svg 
          viewBox="0 0 1000 500" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        >
          {/* Stylized Continents Outlines */}
          <path
            d="M 120 120 Q 220 100 300 130 Q 320 220 240 240 Q 180 200 120 120 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 230 260 Q 340 260 360 350 Q 300 440 250 380 Q 220 320 230 260 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 450 100 Q 560 90 580 180 Q 520 230 460 200 Q 430 140 450 100 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 460 210 Q 540 210 560 300 Q 520 400 480 340 Q 450 270 460 210 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 600 100 Q 820 90 860 220 Q 760 280 660 240 Q 600 180 600 100 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M 780 320 Q 880 320 890 390 Q 840 430 780 410 Q 760 360 780 320 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Synaptic Conduit Arcs connecting the nodes */}
          {SYNAPTIC_CONDUITS.map((conduit) => {
            const fromNode = nodes.find((n) => n.id === conduit.fromId);
            const toNode = nodes.find((n) => n.id === conduit.toId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.xPercent * 10;
            const y1 = fromNode.yPercent * 5;
            const x2 = toNode.xPercent * 10;
            const y2 = toNode.yPercent * 5;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 35; // Curve curvature

            return (
              <g key={conduit.id}>
                {/* Background conduit line */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={isSimulatingPulse ? '#06b6d4' : '#1e293b'}
                  strokeWidth={isSimulatingPulse ? '2.5' : '1.5'}
                  className="transition-colors duration-500"
                />
                {/* Active packet particle moving along curve */}
                <circle r={isSimulatingPulse ? '3' : '2'} fill="#38bdf8">
                  <animateMotion
                    path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    dur={`${1.8 + (conduit.latencyMs % 3) * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Edge Node Pins & Telemetric Iguala Callouts */}
        {filteredNodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const statusColors = {
            inferencing: 'bg-amber-400 text-amber-950 shadow-amber-500/50',
            synced: 'bg-emerald-400 text-emerald-950 shadow-emerald-500/50',
            active: 'bg-cyan-400 text-cyan-950 shadow-cyan-500/50',
            standby: 'bg-slate-400 text-slate-900 shadow-slate-500/50'
          };

          return (
            <div
              key={node.id}
              style={{
                left: `${node.xPercent}%`,
                top: `${node.yPercent}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              {/* Radial Pulse Rings */}
              <div className="relative flex items-center justify-center">
                <span className={`absolute w-8 h-8 rounded-full opacity-60 animate-ping ${
                  node.status === 'inferencing' ? 'bg-amber-500' : 'bg-cyan-500'
                }`} />
                <span className={`absolute w-5 h-5 rounded-full opacity-40 animate-pulse ${
                  node.status === 'inferencing' ? 'bg-amber-400' : 'bg-cyan-400'
                }`} />

                {/* Node Target Button */}
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`relative z-10 w-4.5 h-4.5 rounded-full border-2 border-slate-950 transition-all shadow-lg flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-cyan-400 scale-125' : 'hover:scale-120'
                  } ${statusColors[node.status]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </button>
              </div>

              {/* Node Static Mini Label */}
              <div 
                onClick={() => setSelectedNode(node)}
                className="mt-1 cursor-pointer whitespace-nowrap text-center pointer-events-auto"
              >
                <span className="text-[10px] font-mono font-bold tracking-tight text-white/90 drop-shadow-md bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60">
                  {node.name.split(' ')[0]} ({node.telemetry.balanceRatio}%)
                </span>
              </div>
            </div>
          );
        })}

        {/* Pinned Telemetric Iguala Callout Card (Floating over selected node) */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-30 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* Callout Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Telemetric Iguala Node
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-0.5">
                  {selectedNode.name}
                </h3>
                <div className="text-[11px] text-slate-400">
                  {selectedNode.location} · {selectedNode.region}
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Model & Quantization Ribbon */}
            <div className="py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedNode.modelName}</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {selectedNode.telemetry.quantization}
              </span>
            </div>

            {/* Iguala Equalizer Bar & Live Metrics */}
            <div className="py-3 space-y-3">
              
              {/* Equalization Balance Meter */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Iguala Parity</span>
                  <span className="font-bold text-cyan-400">{selectedNode.telemetry.balanceRatio}% Balanced</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${selectedNode.telemetry.balanceRatio}%` }}
                  />
                </div>
              </div>

              {/* Dynamic 4-Point Telemetric Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Decode Throughput</span>
                  <span className="font-bold text-emerald-400">{selectedNode.telemetry.decodeTokPerSec} tok/s</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Time to First Token</span>
                  <span className="font-bold text-cyan-300">{selectedNode.telemetry.ttftMs} ms</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Memory Load</span>
                  <span className="font-bold text-slate-200">
                    {(selectedNode.telemetry.memoryAllocatedMb / 1024).toFixed(1)} / {(selectedNode.telemetry.totalMemoryMb / 1024).toFixed(0)} GB
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Thermal Core</span>
                  <span className="font-bold text-amber-400">{selectedNode.telemetry.thermalTempC}°C ({selectedNode.telemetry.powerWatts}W)</span>
                </div>
              </div>

            </div>

            {/* Callout Action Controls */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleSelectModelFromNode(selectedNode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white transition-all shadow-md active:scale-98"
              >
                <span>Route to Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsEqualizerModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
                title="Open Telemetry Equalizer"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Deep Telemetry Equalizer Modal */}
      {isEqualizerModalOpen && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Deep Telemetric Iguala Equalizer
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Hardware shard telemetry for {selectedNode.name} · {selectedNode.modelName}
                </p>
              </div>

              <button
                onClick={() => setIsEqualizerModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Equalizer Frequency & Channel Bars */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Inference Equalization Spectrum (8 Channels)</span>
                <span className="text-cyan-400">Iguala: {selectedNode.telemetry.balanceRatio}%</span>
              </div>

              <div className="h-28 flex items-end justify-between gap-2 px-2 pb-1 border-b border-slate-800">
                {[65, 82, 94, 76, 88, 92, 70, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full bg-slate-800 rounded-t-sm h-24 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ height: `${val}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">CH{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Conduit Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Context Window Utilization</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedNode.telemetry.activeContextWindow} tokens
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Conduit Bandwidth</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {selectedNode.telemetry.conduitBandwidthGbps} Gbps
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Health Integrity</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedNode.telemetry.healthScore} / 100
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsEqualizerModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                Close Equalizer
              </button>
              <button
                onClick={() => {
                  handleSelectModelFromNode(selectedNode);
                  setIsEqualizerModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Launch Model in AI Chat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
