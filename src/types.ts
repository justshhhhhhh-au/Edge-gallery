export type TaskType = 
  | 'home'
  | 'llm_chat' 
  | 'llm_agent_chat' 
  | 'llm_prompt_lab' 
  | 'llm_ask_image' 
  | 'tiny_garden' 
  | 'mobile_actions' 
  | 'model_manager'
  | 'node_map'
  | 'benchmark';

export interface TelemetryIguala {
  balanceRatio: number; // 0-100% equalized load
  ttftMs: number;
  decodeTokPerSec: number;
  prefillTokPerSec: number;
  memoryAllocatedMb: number;
  totalMemoryMb: number;
  thermalTempC: number;
  powerWatts: number;
  activeContextWindow: number;
  quantization: string;
  lastPulseMs: number;
  conduitBandwidthGbps: number;
  healthScore: number;
}

export interface EdgeNode {
  id: string;
  name: string;
  location: string;
  region: string;
  lat: number;
  lng: number;
  xPercent: number; // 0-100% for SVG world map placement
  yPercent: number; // 0-100%
  modelName: string;
  modelFamily: string;
  status: 'active' | 'inferencing' | 'synced' | 'standby';
  telemetry: TelemetryIguala;
  peers: string[];
}

export interface SynapticConduit {
  id: string;
  fromId: string;
  toId: string;
  latencyMs: number;
  trafficLoad: number; // 0 - 100%
}

export interface ModelConfig {
  topK: number;
  topP: number;
  temperature: number;
  maxTokens: number;
  maxContextLength?: number;
  accelerators: string;
  visionAccelerator?: string;
  mtpEnabled?: boolean;
}

export interface ModelInfo {
  name: string;
  modelId: string;
  modelFile: string;
  description: string;
  sizeInBytes: number;
  estimatedPeakMemoryInBytes?: number;
  minDeviceMemoryInGb?: number;
  llmSupportImage?: boolean;
  llmSupportAudio?: boolean;
  capabilities: string[];
  defaultConfig: ModelConfig;
  taskTypes: string[];
  isDownloaded?: boolean;
  downloadProgress?: number;
  family: 'Gemma 4' | 'Gemma 3' | 'Gemma 2' | 'FunctionGemma' | 'Qwen' | 'DeepSeek' | 'Other';
}

export interface LatencyStats {
  prefillSpeed: number; // tok/s
  decodeSpeed: number; // tok/s
  ttftMs: number; // time to first token in ms
  totalTokens: number;
  durationMs: number;
}

export interface ToolCall {
  id: string;
  skillId: string;
  skillName: string;
  args: Record<string, any>;
  result?: any;
  status: 'running' | 'success' | 'error';
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinkingContent?: string;
  isThinkingExpanded?: boolean;
  timestamp: number;
  latencyStats?: LatencyStats;
  toolCalls?: ToolCall[];
  imageUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'built-in' | 'featured';
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  enabled: boolean;
  execute: (args: Record<string, any>) => Promise<{
    result: string;
    data?: any;
    webviewUrl?: string;
    imageUrl?: string;
  }>;
}

export interface BenchmarkRecord {
  id: string;
  modelName: string;
  timestamp: number;
  prefillSpeed: number; // tok/s
  decodeSpeed: number; // tok/s
  ttftMs: number;
  memoryMb: number;
  tokensGenerated: number;
}

export interface MobileActionItem {
  id: string;
  actionType: string;
  title: string;
  description: string;
  params: Record<string, any>;
  timestamp: number;
  status: 'completed' | 'pending';
}
