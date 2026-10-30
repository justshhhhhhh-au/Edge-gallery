import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flower2, 
  Send, 
  Droplet, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  Scissors,
  Sun
} from 'lucide-react';

interface GameCommand {
  item: number;
  plot: number[];
}

export const TinyGardenScreen: React.FC = () => {
  const [instruction, setInstruction] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const dispatchToTinyGarden = (commands: GameCommand[], actionDescription: string) => {
    setLastAction(actionDescription);
    const jsonString = JSON.stringify(commands);

    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Send command into TinyGarden window
        (iframeRef.current.contentWindow as any).tinyGarden?.runCommands?.(jsonString);
      }
    } catch (e) {
      console.warn('TinyGarden command dispatch error:', e);
    }
  };

  const handleShowHelp = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        (iframeRef.current.contentWindow as any).tinyGarden?.showHelp?.();
      }
    } catch (e) {
      console.warn('Help dispatch error:', e);
    }
  };

  const handleNaturalLanguage = (text?: string) => {
    const input = (text || instruction).trim().toLowerCase();
    if (!input) return;

    setIsProcessing(true);
    setInstruction('');

    setTimeout(() => {
      // Natural language parser matching FunctionGemma fine-tune logic
      let plots: number[] = [];
      const plotMatches = input.match(/\b([1-9])\b/g);
      if (plotMatches) {
        plots = plotMatches.map((n) => parseInt(n));
      } else if (input.includes('all') || input.includes('every')) {
        plots = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      } else {
        plots = [1];
      }

      if (input.includes('water')) {
        dispatchToTinyGarden([{ item: 5, plot: plots }], `Watered plots: ${plots.join(', ')}`);
      } else if (input.includes('harvest') || input.includes('scythe') || input.includes('cut')) {
        dispatchToTinyGarden([{ item: 6, plot: plots }], `Harvested plots: ${plots.join(', ')}`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } else if (input.includes('sunflower')) {
        dispatchToTinyGarden([{ item: 1, plot: plots }], `Planted Sunflower in plot(s): ${plots.join(', ')}`);
      } else if (input.includes('daisy')) {
        dispatchToTinyGarden([{ item: 2, plot: plots }], `Planted Daisy in plot(s): ${plots.join(', ')}`);
      } else if (input.includes('rose')) {
        dispatchToTinyGarden([{ item: 3, plot: plots }], `Planted Rose in plot(s): ${plots.join(', ')}`);
      } else if (input.includes('special') || input.includes('secret')) {
        dispatchToTinyGarden([{ item: 4, plot: plots }], `Planted Special Seed in plot(s): ${plots.join(', ')}`);
      } else {
        // Fallback default: plant daisy
        dispatchToTinyGarden([{ item: 2, plot: plots }], `Planted Daisy in plot(s): ${plots.join(', ')}`);
      }

      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flower2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Tiny Garden</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Powered by FunctionGemma
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Interactive garden simulation driven by natural language tool calling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShowHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Game Guide</span>
          </button>
        </div>
      </div>

      {/* Main Game Frame & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Embedded Game Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
            <iframe
              ref={iframeRef}
              src="/tinygarden/index.html"
              title="Tiny Garden Game"
              className="w-full h-full border-0 select-none"
              allow="autoplay"
            />
          </div>

          {/* Quick Action Button Palette */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1 text-[11px]">
              Direct Actions:
            </span>
            <button
              onClick={() => dispatchToTinyGarden([{ item: 2, plot: [1, 2, 3] }], 'Planted Daisy in plots 1, 2, 3')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 font-medium transition-colors"
            >
              🌼 Plant Daisies (1-3)
            </button>
            <button
              onClick={() => dispatchToTinyGarden([{ item: 3, plot: [4, 5, 6] }], 'Planted Rose in plots 4, 5, 6')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 font-medium transition-colors"
            >
              🌹 Plant Roses (4-6)
            </button>
            <button
              onClick={() => dispatchToTinyGarden([{ item: 1, plot: [7, 8, 9] }], 'Planted Sunflowers in plots 7, 8, 9')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 font-medium transition-colors"
            >
              🌻 Plant Sunflowers (7-9)
            </button>
            <button
              onClick={() => dispatchToTinyGarden([{ item: 5, plot: [1, 2, 3, 4, 5, 6, 7, 8, 9] }], 'Watered all 9 plots')}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 transition-colors"
            >
              💧 Water All Plots
            </button>
            <button
              onClick={() => {
                dispatchToTinyGarden([{ item: 6, plot: [1, 2, 3, 4, 5, 6, 7, 8, 9] }], 'Harvested all ripe crops');
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-100 transition-colors"
            >
              🌾 Harvest All
            </button>
          </div>
        </div>

        {/* Right: Natural Language Agent Interface */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                FunctionGemma Agent
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              FunctionGemma converts natural conversational speech into deterministic function calls (<code className="text-amber-600 dark:text-amber-400 font-mono">TinyGardenTools</code>) executed in real-time.
            </p>

            {/* Recent Action Card */}
            {lastAction && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs">
                <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-0.5">
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>Executed Tool Call</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {lastAction}
                </div>
              </div>
            )}

            {/* Prompt Starters */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-2">
                Sample Natural Language Commands:
              </div>
              <div className="space-y-1.5">
                {[
                  'Plant daisies in plot 1 and 2',
                  'Water all 9 plots',
                  'Plant a sunflower in plot 5',
                  'Harvest plot 1, 2, and 5'
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleNaturalLanguage(sample)}
                    className="w-full text-left text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-800 transition-colors border border-slate-200 dark:border-slate-800"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Natural Language Prompt Input */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNaturalLanguage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Give command (e.g. 'Water plot 3')..."
                disabled={isProcessing}
                className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isProcessing || !instruction.trim()}
                className={`p-2 rounded-xl text-white transition-all ${
                  isProcessing || !instruction.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
