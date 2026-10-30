import { ModelInfo, LatencyStats, ToolCall } from '../types';
import { INITIAL_SKILLS } from '../data/skills';

export interface GenerationChunk {
  token: string;
  isThinking: boolean;
  thoughtComplete?: boolean;
}

export interface GenerationResult {
  text: string;
  thought?: string;
  latencyStats: LatencyStats;
  toolCalls?: ToolCall[];
}

export async function runInferenceStream(
  prompt: string,
  model: ModelInfo,
  systemPrompt: string | undefined,
  onChunk: (chunk: GenerationChunk) => void,
  imagePayload?: string
): Promise<GenerationResult> {
  const startTime = performance.now();
  const hasThinking = model.capabilities.includes('llm_thinking');

  // Realistic TTFT simulation
  const ttftMs = Math.round(75 + Math.random() * 45);
  await new Promise((r) => setTimeout(r, ttftMs));

  let thought = '';
  let responseText = '';

  // 1. If Gemma 4 or Thinking model, generate thought trace
  if (hasThinking) {
    const thoughtsList = [
      `1. Analyzing user input: "${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}"\n2. Context length: 32K window active; LiteRT-LM graph initialized.\n3. Identifying core objectives and technical constraints.\n4. Formulating step-by-step verified response with precision.\n5. Validating safety, coherence, and conciseness for on-device delivery.`,
      `* Deconstructing query intent: identifying key entities and requirements.\n* Checking knowledge constraints and local device capability.\n* Synthesizing clean structural answer with logical rationale.\n* Evaluating optimal formatting (markdown, bullet points, concise summary).`,
      `Step 1: Parse prompt tokens with multi-token prediction (MTP) enabled.\nStep 2: Reason through mathematical or logical relations.\nStep 3: Ensure grounded response without hallucination.\nStep 4: Prepare direct, actionable conclusion.`
    ];
    const selectedThought = thoughtsList[Math.floor(Math.random() * thoughtsList.length)];
    
    // Stream thought tokens
    const thoughtWords = selectedThought.split(' ');
    for (const word of thoughtWords) {
      thought += (thought ? ' ' : '') + word;
      onChunk({ token: word + ' ', isThinking: true });
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 15));
    }

    onChunk({ token: '', isThinking: true, thoughtComplete: true });
    await new Promise((r) => setTimeout(r, 100));
  }

  // 2. Generate substantive answer based on prompt
  let finalContent = '';
  const lower = prompt.toLowerCase();

  if (imagePayload) {
    finalContent = `**Visual Analysis Result:**\n\nI have analyzed the provided image using **${model.name}**'s multimodal vision encoder.\n\n- **Identified Subject:** Clean digital or real-world image.\n- **Visual Details:** Sharp clarity, balanced lighting, and identifiable composition.\n- **Assessment:** Ready for multimodal processing on-device with zero cloud latency.`;
  } else if (lower.includes('gemma 4') || lower.includes('what is gemma')) {
    finalContent = `**Gemma 4** is the newest open-weights foundation model family optimized specifically for on-device execution with Google AI Edge.\n\n### Key Highlights:\n- **On-Device Thinking Mode:** Generates visible reasoning traces prior to token emission, enhancing reasoning in math, coding, and logical tasks.\n- **LiteRT-LM Integration:** Direct hardware acceleration on Vulkan/OpenCL GPUs and NPUs with up to 32K context lengths.\n- **Speculative Decoding & Multi-Token Prediction (MTP):** Greatly accelerates decoding speeds while maintaining low thermal and memory footprints.`;
  } else if (lower.includes('hello') || lower.includes('hi')) {
    finalContent = `Hello! I am running on-device using **${model.name}** through Google AI Edge LiteRT.\n\nHow can I help you today? You can test my reasoning capabilities, experiment with prompt templates in the Prompt Lab, or try Agent Skills!`;
  } else if (lower.includes('code') || lower.includes('python') || lower.includes('function') || lower.includes('typescript')) {
    finalContent = `Here is an optimized implementation for on-device processing:\n\n\`\`\`typescript\n// LiteRT-LM on-device prompt runner\nexport async function runPrompt(input: string): Promise<string> {\n  const sanitized = input.trim();\n  if (!sanitized) throw new Error("Empty prompt");\n  \n  console.log(\`[LiteRT] Executing token prefill for \${sanitized.length} characters...\`);\n  return \`Gemma on-device response completed successfully.\`;\n}\n\`\`\`\n\nThis pattern guarantees zero memory leaks and fast garbage collection on constrained mobile environments.`;
  } else if (lower.includes('summarize') || lower.includes('summary')) {
    finalContent = `### Summary\n\n- **Key Takeaway:** The provided information emphasizes efficient on-device intelligence without cloud dependency.\n- **Core Benefit:** Total user privacy, zero network latency, and continuous offline availability.\n- **Action Item:** Integrate models into edge workflows via LiteRT APIs.`;
  } else {
    finalContent = `Thank you for your prompt! Executed locally on **${model.name}**.\n\nYour query: "${prompt}"\n\nIn an on-device environment, models like Gemma execute entirely in device RAM (GPU/NPU acceleration). This provides immediate responsiveness, enhanced security, and predictable performance without server latency or network drops.`;
  }

  // Stream output tokens
  const words = finalContent.split(' ');
  for (const word of words) {
    responseText += (responseText ? ' ' : '') + word;
    onChunk({ token: word + ' ', isThinking: false });
    // Speed based on model size
    const delay = model.sizeInBytes > 3000000000 ? 25 : 15;
    await new Promise((r) => setTimeout(r, delay + Math.random() * 10));
  }

  const endTime = performance.now();
  const durationMs = Math.round(endTime - startTime);
  const totalTokens = Math.round((thought.length + responseText.length) / 4);
  const prefillSpeed = Math.round(140 + Math.random() * 50);
  const decodeSpeed = Math.round(28 + Math.random() * 15);

  return {
    text: responseText,
    thought: hasThinking ? thought : undefined,
    latencyStats: {
      prefillSpeed,
      decodeSpeed,
      ttftMs,
      totalTokens,
      durationMs
    }
  };
}

export async function runAgentInference(
  prompt: string,
  model: ModelInfo
): Promise<{ text: string; toolCalls: ToolCall[]; latencyStats: LatencyStats }> {
  const startTime = performance.now();
  const lower = prompt.toLowerCase();
  const toolCalls: ToolCall[] = [];

  // Match tool calls based on intent
  if (lower.includes('wiki') || lower.includes('who is') || lower.includes('what is') || lower.includes('history of')) {
    const topic = prompt.replace(/(search|wikipedia|wiki|tell me about|who is|what is)/gi, '').trim() || 'Google AI';
    const skill = INITIAL_SKILLS.find((s) => s.id === 'query-wikipedia')!;
    const execution = await skill.execute({ topic, lang: 'en' });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { topic, lang: 'en' },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('map') || lower.includes('where is') || lower.includes('location') || lower.includes('directions')) {
    const location = prompt.replace(/(map|where is|location of|show me)/gi, '').trim() || 'Tokyo Tower, Japan';
    const skill = INITIAL_SKILLS.find((s) => s.id === 'interactive-map')!;
    const execution = await skill.execute({ location });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { location },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('qr') || lower.includes('barcode')) {
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : 'https://github.com/google-ai-edge/gallery';
    const skill = INITIAL_SKILLS.find((s) => s.id === 'qr-code')!;
    const execution = await skill.execute({ url, shape: 'square' });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { url, shape: 'square' },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('mood') || lower.includes('feeling') || lower.includes('rate my day')) {
    const skill = INITIAL_SKILLS.find((s) => s.id === 'mood-tracker')!;
    const scoreMatch = prompt.match(/\b([1-9]|10)\b/);
    const score = scoreMatch ? parseInt(scoreMatch[0]) : 8;
    const execution = await skill.execute({
      action: 'log_mood',
      score,
      comment: prompt.slice(0, 80)
    });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { action: 'log_mood', score, comment: prompt.slice(0, 80) },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('hash') || lower.includes('sha256') || lower.includes('checksum')) {
    const skill = INITIAL_SKILLS.find((s) => s.id === 'calculate-hash')!;
    const textToHash = prompt.replace(/(calculate|hash|sha256|sha-256|checksum)/gi, '').trim() || 'Hello Google AI Edge';
    const execution = await skill.execute({ text: textToHash, algorithm: 'SHA-256' });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { text: textToHash, algorithm: 'SHA-256' },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('piano') || lower.includes('music') || lower.includes('play note')) {
    const skill = INITIAL_SKILLS.find((s) => s.id === 'virtual-piano')!;
    const execution = await skill.execute({ notes: 'C4, E4, G4, C5' });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { notes: 'C4, E4, G4, C5' },
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('eat') || lower.includes('restaurant') || lower.includes('dinner') || lower.includes('lunch')) {
    const skill = INITIAL_SKILLS.find((s) => s.id === 'restaurant-roulette')!;
    const execution = await skill.execute({});
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: {},
      result: execution,
      status: 'success'
    });
  } else if (lower.includes('cook') || lower.includes('recipe') || lower.includes('kitchen')) {
    const skill = INITIAL_SKILLS.find((s) => s.id === 'kitchen-adventure')!;
    const execution = await skill.execute({ ingredients: 'garlic, pasta, parmesan, olive oil' });
    toolCalls.push({
      id: 'tc-' + Date.now(),
      skillId: skill.id,
      skillName: skill.name,
      args: { ingredients: 'garlic, pasta, parmesan, olive oil' },
      result: execution,
      status: 'success'
    });
  }

  const durationMs = Math.round(performance.now() - startTime + 150);
  let text = '';
  if (toolCalls.length > 0) {
    text = `I executed the **${toolCalls[0].skillName}** skill on-device to handle your request. Here are the results:`;
  } else {
    text = `I evaluated your request with available skills. No specialized tool call was required for this conversational query, so I've processed it directly.`;
  }

  return {
    text,
    toolCalls,
    latencyStats: {
      prefillSpeed: 165,
      decodeSpeed: 32,
      ttftMs: 95,
      totalTokens: 180,
      durationMs
    }
  };
}
