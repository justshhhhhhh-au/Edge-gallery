import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runInferenceStream } from '../../services/llmEngine';
import { 
  Image as ImageIcon, 
  Upload, 
  Send, 
  Sparkles, 
  Eye, 
  Check, 
  RotateCcw,
  Camera
} from 'lucide-react';

interface SampleImage {
  id: string;
  name: string;
  url: string;
  samplePrompt: string;
}

const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'flower',
    name: 'Wild Sunflower',
    url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
    samplePrompt: 'Identify this flower species and describe optimal soil and sunlight requirements.'
  },
  {
    id: 'math',
    name: 'Handwritten Math Formula',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    samplePrompt: 'Parse the mathematical notation in this image and verify its mathematical properties.'
  },
  {
    id: 'city',
    name: 'Urban Architecture',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    samplePrompt: 'Analyze the architectural style and landmark characteristics in this scene.'
  }
];

export const AskImageScreen: React.FC = () => {
  const { selectedModel } = useApp();
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0].url);
  const [prompt, setPrompt] = useState<string>(SAMPLE_IMAGES[0].samplePrompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedImage(sample.url);
    setPrompt(sample.samplePrompt);
    setAnalysisResult('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setAnalysisResult('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      let accumulated = '';
      await runInferenceStream(
        prompt,
        selectedModel,
        'You are an expert multimodal visual intelligence model executing on-device via LiteRT-LM.',
        (chunk) => {
          if (!chunk.isThinking) {
            accumulated += chunk.token;
            setAnalysisResult(accumulated);
          }
        },
        selectedImage
      );
    } catch (err: any) {
      setAnalysisResult(`Analysis Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Ask Image (Multimodal Vision)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              Vision Accelerator Active
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Process visual inputs and answer questions using {selectedModel.name}'s on-device vision encoder
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Canvas and Sample Selection */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-4/3 flex items-center justify-center shadow-xs">
            <img
              src={selectedImage}
              alt="Subject for analysis"
              className="w-full h-full object-cover"
            />

            <label className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md cursor-pointer hover:bg-white transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample Selectors */}
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Sample Image:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-video ${
                    selectedImage === sample.url
                      ? 'border-blue-600 ring-2 ring-blue-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">
                      {sample.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Prompt Input & Analysis Result */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          
          {/* Question / Prompt Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Visual Question
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about this image..."
                disabled={isAnalyzing}
                className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !prompt.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                  isAnalyzing || !prompt.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-98'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Ask Image'}
              </button>
            </div>
          </div>

          {/* Analysis Result */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Multimodal Response
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap">
              {analysisResult ? (
                analysisResult
              ) : isAnalyzing ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2" />
                  Running multimodal vision inference on-device...
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center py-10">
                  <Eye className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Ask a question above to analyze the image</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
