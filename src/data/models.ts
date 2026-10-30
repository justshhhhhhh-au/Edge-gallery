import { ModelInfo } from '../types';

export const INITIAL_MODELS: ModelInfo[] = [
  {
    name: 'Gemma-4-E2B-it',
    modelId: 'litert-community/gemma-4-E2B-it-litert-lm',
    modelFile: 'gemma-4-E2B-it.litertlm',
    family: 'Gemma 4',
    description: 'Premier variant of Gemma 4 E2B powered by LiteRT-LM. Features built-in On-Device Thinking Mode, multi-turn reasoning, and speculative decoding with up to 32K context.',
    sizeInBytes: 2588147712, // 2.59 GB
    estimatedPeakMemoryInBytes: 3800000000,
    minDeviceMemoryInGb: 8,
    llmSupportImage: true,
    llmSupportAudio: true,
    capabilities: ['llm_thinking', 'speculative_decoding', 'multimodal'],
    defaultConfig: {
      topK: 64,
      topP: 0.95,
      temperature: 0.8,
      maxContextLength: 32000,
      maxTokens: 4096,
      accelerators: 'gpu,cpu',
      visionAccelerator: 'gpu',
      mtpEnabled: true
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab', 'llm_agent_chat', 'llm_ask_image'],
    isDownloaded: true,
    downloadProgress: 100
  },
  {
    name: 'Gemma-4-E4B-it',
    modelId: 'litert-community/gemma-4-E4B-it-litert-lm',
    modelFile: 'gemma-4-E4B-it.litertlm',
    family: 'Gemma 4',
    description: 'High-capacity Gemma 4 E4B model for high precision logic, coding, and multi-step reasoning with on-device Thinking Mode.',
    sizeInBytes: 3659530240, // 3.66 GB
    estimatedPeakMemoryInBytes: 5200000000,
    minDeviceMemoryInGb: 12,
    llmSupportImage: true,
    llmSupportAudio: true,
    capabilities: ['llm_thinking', 'speculative_decoding', 'multimodal'],
    defaultConfig: {
      topK: 64,
      topP: 0.95,
      temperature: 0.7,
      maxContextLength: 32000,
      maxTokens: 4096,
      accelerators: 'gpu,cpu',
      visionAccelerator: 'gpu',
      mtpEnabled: true
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab', 'llm_agent_chat', 'llm_ask_image'],
    isDownloaded: false,
    downloadProgress: 0
  },
  {
    name: 'Gemma-3n-E2B-it-int4',
    modelId: 'google/gemma-3n-E2B-it-litert-preview',
    modelFile: 'gemma-3n-E2B-it-int4.task',
    family: 'Gemma 3',
    description: 'Optimized Gemma 3n E2B model with MediaPipe LLM inference runtime. Ideal for fast single-turn prompts and vision processing.',
    sizeInBytes: 3136226711, // 3.14 GB
    estimatedPeakMemoryInBytes: 4200000000,
    minDeviceMemoryInGb: 6,
    llmSupportImage: true,
    capabilities: ['multimodal'],
    defaultConfig: {
      topK: 64,
      topP: 0.95,
      temperature: 1.0,
      maxTokens: 4096,
      accelerators: 'cpu,gpu'
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab', 'llm_ask_image'],
    isDownloaded: true,
    downloadProgress: 100
  },
  {
    name: 'Gemma3-1B-IT q4',
    modelId: 'litert-community/Gemma3-1B-IT',
    modelFile: 'Gemma3-1B-IT_multi-prefill-seq_q4_ekv2048.task',
    family: 'Gemma 3',
    description: 'Ultra-lightweight 4-bit quantized Gemma 3 1B model. Extremely rapid token generation and minimal battery impact.',
    sizeInBytes: 554661246, // 554 MB
    estimatedPeakMemoryInBytes: 1500000000,
    minDeviceMemoryInGb: 4,
    capabilities: [],
    defaultConfig: {
      topK: 64,
      topP: 0.95,
      temperature: 0.8,
      maxTokens: 2048,
      accelerators: 'gpu,cpu'
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab'],
    isDownloaded: true,
    downloadProgress: 100
  },
  {
    name: 'FunctionGemma-270M-it',
    modelId: 'google/functiongemma-270m-litert',
    modelFile: 'functiongemma-270m-it.litertlm',
    family: 'FunctionGemma',
    description: 'Specialized 270M parameter micro-model fine-tuned specifically for low-latency tool use, offline device actions, and Tiny Garden game commands.',
    sizeInBytes: 284100000, // 284 MB
    estimatedPeakMemoryInBytes: 600000000,
    minDeviceMemoryInGb: 2,
    capabilities: ['function_calling'],
    defaultConfig: {
      topK: 40,
      topP: 0.9,
      temperature: 0.2,
      maxTokens: 512,
      accelerators: 'cpu,gpu'
    },
    taskTypes: ['tiny_garden', 'mobile_actions', 'llm_agent_chat'],
    isDownloaded: true,
    downloadProgress: 100
  },
  {
    name: 'Qwen2.5-1.5B-Instruct q8',
    modelId: 'litert-community/Qwen2.5-1.5B-Instruct',
    modelFile: 'Qwen2.5-1.5B-Instruct_multi-prefill-seq_q8_ekv1280.task',
    family: 'Qwen',
    description: '8-bit quantized Qwen 2.5 1.5B model offering exceptional multilingual comprehension and factual instruction following.',
    sizeInBytes: 1625493432, // 1.63 GB
    estimatedPeakMemoryInBytes: 2400000000,
    minDeviceMemoryInGb: 6,
    capabilities: [],
    defaultConfig: {
      topK: 40,
      topP: 0.95,
      temperature: 0.7,
      maxTokens: 2048,
      accelerators: 'cpu,gpu'
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab'],
    isDownloaded: false,
    downloadProgress: 0
  },
  {
    name: 'DeepSeek-R1-Distill-1.5B',
    modelId: 'litert-community/DeepSeek-R1-Distill-Qwen-1.5B',
    modelFile: 'deepseek-r1-distill-qwen-1.5b.litertlm',
    family: 'DeepSeek',
    description: 'Distilled open reasoning model trained to output detailed internal thinking thoughts before formulating its final answer.',
    sizeInBytes: 1720000000,
    estimatedPeakMemoryInBytes: 2600000000,
    minDeviceMemoryInGb: 6,
    capabilities: ['llm_thinking'],
    defaultConfig: {
      topK: 50,
      topP: 0.95,
      temperature: 0.6,
      maxTokens: 3000,
      accelerators: 'gpu,cpu'
    },
    taskTypes: ['llm_chat', 'llm_prompt_lab'],
    isDownloaded: false,
    downloadProgress: 0
  }
];

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
