import React, { useState } from 'react';
import { 
  Smartphone, 
  Flashlight, 
  FlashlightOff, 
  Calendar, 
  Mail, 
  MapPin, 
  Wifi, 
  UserPlus, 
  Play, 
  CheckCircle2, 
  Sparkles,
  Send
} from 'lucide-react';

interface ActionChallenge {
  id: string;
  prompt: string;
  expectedAction: string;
  category: string;
}

const CHALLENGES: ActionChallenge[] = [
  {
    id: 'ch-1',
    prompt: 'It is too dark in here, turn on the flashlight please',
    expectedAction: 'ACTION_FLASHLIGHT_ON',
    category: 'Device Control'
  },
  {
    id: 'ch-2',
    prompt: 'Add a calendar event for Project Retro on Friday at 3:00 PM',
    expectedAction: 'ACTION_CREATE_CALENDAR_EVENT',
    category: 'Productivity'
  },
  {
    id: 'ch-3',
    prompt: 'Draft an email to sarah@example.com about Quarterly Roadmap review',
    expectedAction: 'ACTION_SEND_EMAIL',
    category: 'Communication'
  },
  {
    id: 'ch-4',
    prompt: 'Save new contact for Marcus Vance, phone 555-0192',
    expectedAction: 'ACTION_CREATE_CONTACT',
    category: 'Contacts'
  },
  {
    id: 'ch-5',
    prompt: 'Find the nearest coffee shop on Google Maps',
    expectedAction: 'ACTION_SHOW_LOCATION_ON_MAP',
    category: 'Navigation'
  }
];

export const MobileActionsScreen: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState(CHALLENGES[0].prompt);
  const [flashlightState, setFlashlightState] = useState(false);
  const [wifiState, setWifiState] = useState(true);
  const [executedAction, setExecutedAction] = useState<{
    type: string;
    title: string;
    details: Record<string, string>;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunChallenge = (promptText?: string) => {
    const text = (promptText || activePrompt).trim();
    if (!text || isProcessing) return;

    setIsProcessing(true);
    setExecutedAction(null);

    setTimeout(() => {
      const lower = text.toLowerCase();

      if (lower.includes('flashlight on') || (lower.includes('flashlight') && !lower.includes('off')) || lower.includes('too dark')) {
        setFlashlightState(true);
        setExecutedAction({
          type: 'ACTION_FLASHLIGHT_ON',
          title: 'Device Flashlight Enabled',
          details: { state: 'ON', hardware: 'Torch LED active' }
        });
      } else if (lower.includes('flashlight off') || lower.includes('turn off torch')) {
        setFlashlightState(false);
        setExecutedAction({
          type: 'ACTION_FLASHLIGHT_OFF',
          title: 'Device Flashlight Disabled',
          details: { state: 'OFF', hardware: 'Torch LED standby' }
        });
      } else if (lower.includes('calendar') || lower.includes('meeting') || lower.includes('event')) {
        setExecutedAction({
          type: 'ACTION_CREATE_CALENDAR_EVENT',
          title: 'Calendar Event Scheduled',
          details: {
            title: text.replace(/(schedule|add a calendar event for|calendar|event)/gi, '').trim(),
            date: 'This Friday',
            time: '3:00 PM - 4:00 PM',
            calendar: 'Primary Local'
          }
        });
      } else if (lower.includes('email') || lower.includes('mail') || lower.includes('draft')) {
        setExecutedAction({
          type: 'ACTION_SEND_EMAIL',
          title: 'Email Draft Prepared',
          details: {
            recipient: 'sarah@example.com',
            subject: 'Quarterly Roadmap review',
            body: 'Hi Sarah, let us review the quarterly roadmap milestones for Google AI Edge.'
          }
        });
      } else if (lower.includes('contact') || lower.includes('phone number')) {
        setExecutedAction({
          type: 'ACTION_CREATE_CONTACT',
          title: 'New Contact Saved',
          details: {
            name: 'Marcus Vance',
            phone: '555-0192',
            account: 'Device Address Book'
          }
        });
      } else if (lower.includes('map') || lower.includes('directions') || lower.includes('coffee') || lower.includes('location')) {
        setExecutedAction({
          type: 'ACTION_SHOW_LOCATION_ON_MAP',
          title: 'Map Navigation Launched',
          details: {
            destination: 'Nearest Artisan Coffee Shop',
            coordinates: '37.4220° N, 122.0841° W'
          }
        });
      } else if (lower.includes('wifi') || lower.includes('network')) {
        setWifiState(!wifiState);
        setExecutedAction({
          type: 'ACTION_OPEN_WIFI_SETTINGS',
          title: 'Wi-Fi Configuration',
          details: { status: !wifiState ? 'Connected' : 'Disabled', SSID: 'GoogleGuest_5G' }
        });
      } else {
        setExecutedAction({
          type: 'ACTION_UNKNOWN',
          title: 'Action Triggered',
          details: { rawInstruction: text }
        });
      }

      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Mobile Actions (Offline Tool Calling)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              FunctionGemma 270M
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Finetuned micro-model executing zero-latency device control intents without cloud access
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Challenge Selectors & Input */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Action Intent Prompt
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={activePrompt}
                onChange={(e) => setActivePrompt(e.target.value)}
                placeholder="Give an offline device command..."
                disabled={isProcessing}
                className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleRunChallenge()}
                disabled={isProcessing || !activePrompt.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                  isProcessing || !activePrompt.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 active:scale-98'
                }`}
              >
                {isProcessing ? 'Evaluating...' : 'Dispatch Action'}
              </button>
            </div>
          </div>

          {/* Test Challenges */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Interactive Action Challenges</span>
              <span className="text-slate-400 font-normal">Click to test model intent resolution</span>
            </div>

            <div className="space-y-2">
              {CHALLENGES.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActivePrompt(ch.prompt);
                    handleRunChallenge(ch.prompt);
                  }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-300 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      "{ch.prompt}"
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Expects: {ch.expectedAction}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {ch.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Device State Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Virtual Device Hardware
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>

            {/* Quick Toggles Preview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                flashlightState
                  ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}>
                {flashlightState ? <Flashlight className="w-6 h-6 animate-pulse" /> : <FlashlightOff className="w-6 h-6" />}
                <span className="font-bold">Flashlight: {flashlightState ? 'ON' : 'OFF'}</span>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                wifiState
                  ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}>
                <Wifi className="w-6 h-6" />
                <span className="font-bold">Wi-Fi: {wifiState ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {/* Executed Action Card */}
            {executedAction ? (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>{executedAction.title}</span>
                </div>
                <div className="text-[11px] font-mono text-purple-700 dark:text-purple-400">
                  Type: {executedAction.type}
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-purple-200 dark:border-purple-900/40 space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {Object.entries(executedAction.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Dispatch an action or select a challenge above to see device response
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
