import { Skill } from '../types';

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'query-wikipedia',
    name: 'Query Wikipedia',
    description: 'Searches Wikipedia for verified facts, summaries, and infoboxes with multi-language support (en, es, fr, zh).',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'topic', type: 'string', description: 'The search keywords or topic to research.', required: true },
      { name: 'lang', type: 'string', description: 'Two-letter language code (default: en).', required: false }
    ],
    execute: async (args) => {
      const topic = args.topic || 'Google AI';
      const lang = (args.lang || 'en').toLowerCase();
      try {
        const baseUrl = `https://${lang}.wikipedia.org/w/api.php`;
        const searchParams = new URLSearchParams({
          action: 'query',
          format: 'json',
          generator: 'search',
          gsrsearch: topic,
          gsrlimit: '1',
          prop: 'extracts|pageprops',
          explaintext: '1',
          exintro: '1',
          origin: '*'
        });
        const res = await fetch(`${baseUrl}?${searchParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        
        if (!data.query || !data.query.pages) {
          return {
            result: `No Wikipedia articles found for "${topic}".`,
            data: { topic, found: false }
          };
        }
        
        const firstKey = Object.keys(data.query.pages)[0];
        const page = data.query.pages[firstKey];
        const title = page.title;
        const extract = page.extract || 'No article excerpt available.';
        
        return {
          result: `**${title} (Wikipedia)**\n\n${extract.slice(0, 1000)}${extract.length > 1000 ? '...' : ''}`,
          data: {
            title,
            extract,
            url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
            found: true
          }
        };
      } catch (err: any) {
        return {
          result: `Failed to fetch Wikipedia data: ${err.message}`,
          data: { error: err.message }
        };
      }
    }
  },
  {
    id: 'interactive-map',
    name: 'Interactive Map',
    description: 'Embeds a responsive map for any location or landmark around the world.',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'location', type: 'string', description: 'Address, city, or landmark name to display.', required: true }
    ],
    execute: async (args) => {
      const location = args.location || 'Googleplex, Mountain View, CA';
      const encoded = encodeURIComponent(location);
      const url = `https://maps.google.com/maps?q=${encoded}&output=embed`;
      return {
        result: `Displaying interactive map for "${location}"`,
        webviewUrl: url,
        data: { location, url }
      };
    }
  },
  {
    id: 'qr-code',
    name: 'QR Code Generator',
    description: 'Generates a high-resolution QR code image for URLs, text, or contact information.',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'url', type: 'string', description: 'The URL or content to encode.', required: true },
      { name: 'shape', type: 'string', description: 'square or circle', required: false }
    ],
    execute: async (args) => {
      const url = args.url || 'https://ai.google.dev/edge';
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
      return {
        result: `Generated QR code for: ${url}`,
        imageUrl: qrApiUrl,
        data: { url, imageUrl: qrApiUrl }
      };
    }
  },
  {
    id: 'mood-tracker',
    name: 'Mood Tracker',
    description: 'Logs and evaluates mood ratings (1-10) with comments and tracks emotional wellbeing trends over time.',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'action', type: 'string', description: 'log_mood, get_mood, or get_history', required: true },
      { name: 'score', type: 'number', description: 'Score between 1 and 10 (for log_mood)', required: false },
      { name: 'comment', type: 'string', description: 'Note or thought for the day', required: false },
      { name: 'date', type: 'string', description: 'YYYY-MM-DD or "today"', required: false }
    ],
    execute: async (args) => {
      const action = args.action || 'get_history';
      const storageKey = 'edge_gallery_mood_tracker';
      let stored: Record<string, { score: number; comment: string; timestamp: string }> = {};
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) stored = JSON.parse(raw);
      } catch (e) {
        // ignore
      }

      const today = new Date().toISOString().slice(0, 10);
      const targetDate = args.date && args.date !== 'today' ? args.date : today;

      if (action === 'log_mood') {
        const score = Math.max(1, Math.min(10, Number(args.score) || 7));
        stored[targetDate] = {
          score,
          comment: args.comment || 'Feeling good',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(storageKey, JSON.stringify(stored));
        return {
          result: `Logged mood of ${score}/10 for ${targetDate}${args.comment ? ` ("${args.comment}")` : ''}.`,
          data: { action: 'log_mood', targetDate, score, history: stored }
        };
      } else if (action === 'get_mood') {
        const entry = stored[targetDate];
        if (entry) {
          return {
            result: `Mood on ${targetDate}: ${entry.score}/10 ${entry.comment ? `("${entry.comment}")` : ''}`,
            data: entry
          };
        }
        return {
          result: `No mood entry found for ${targetDate}.`,
          data: { found: false }
        };
      } else {
        const dates = Object.keys(stored).sort().slice(-7);
        if (dates.length === 0) {
          // seed default data
          stored[today] = { score: 8, comment: 'Exploring AI Edge Gallery', timestamp: new Date().toISOString() };
          localStorage.setItem(storageKey, JSON.stringify(stored));
        }
        const historyText = Object.entries(stored)
          .map(([d, val]) => `• ${d}: ${val.score}/10 ${val.comment ? `(${val.comment})` : ''}`)
          .join('\n');
        return {
          result: `Recent Mood History:\n${historyText}`,
          data: { history: stored }
        };
      }
    }
  },
  {
    id: 'calculate-hash',
    name: 'Calculate Hash',
    description: 'Computes cryptographic hashes (SHA-256, SHA-1, SHA-384, SHA-512) directly on the device using Web Crypto.',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'text', type: 'string', description: 'The text string to hash.', required: true },
      { name: 'algorithm', type: 'string', description: 'SHA-256, SHA-1, SHA-384, or SHA-512 (default: SHA-256)', required: false }
    ],
    execute: async (args) => {
      const text = args.text || '';
      const algo = (args.algorithm || 'SHA-256').toUpperCase();
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return {
          result: `**${algo} Hash:**\n\`${hashHex}\``,
          data: { text, algorithm: algo, hash: hashHex }
        };
      } catch (err: any) {
        return {
          result: `Failed to compute hash: ${err.message}`,
          data: { error: err.message }
        };
      }
    }
  },
  {
    id: 'virtual-piano',
    name: 'Virtual Piano',
    description: 'Interactive on-device musical synthesizer for playing notes, chords, and musical demonstrations.',
    category: 'featured',
    enabled: true,
    parameters: [
      { name: 'notes', type: 'string', description: 'Comma-separated notes to play (e.g. C4,E4,G4,C5)', required: false }
    ],
    execute: async (args) => {
      const notes = args.notes || 'C4, E4, G4, B4, C5';
      return {
        result: `Virtual Piano ready. Requested notes: ${notes}. Launch the piano keyboard below to play live notes with high-fidelity Web Audio synthesis.`,
        data: { notes }
      };
    }
  },
  {
    id: 'kitchen-adventure',
    name: 'Kitchen Adventure',
    description: 'Generates creative recipes, ingredient substitutions, and step-by-step cooking techniques.',
    category: 'built-in',
    enabled: true,
    parameters: [
      { name: 'ingredients', type: 'string', description: 'List of ingredients you have on hand.', required: true },
      { name: 'dietary', type: 'string', description: 'Dietary preferences or restrictions (e.g. vegan, gluten-free).', required: false }
    ],
    execute: async (args) => {
      const items = args.ingredients || 'eggs, tomatoes, olive oil';
      return {
        result: `### 🍳 Kitchen Adventure Recipe\n\n**Dish:** Rustic Herb Shakshuka\n**Ingredients used:** ${items}\n\n**Instructions:**\n1. Heat olive oil in a skillet over medium heat.\n2. Add diced tomatoes, simmer until fragrant and saucy.\n3. Make wells in the sauce and crack the eggs into each.\n4. Cover and cook on gentle heat for 5-7 minutes until whites are set.\n5. Garnish with cracked black pepper and fresh herbs. Serve hot!`,
        data: { ingredients: items }
      };
    }
  },
  {
    id: 'restaurant-roulette',
    name: 'Restaurant Roulette',
    description: 'Picks a dining cuisine or dish recommendation when you cannot decide what to eat.',
    category: 'featured',
    enabled: true,
    parameters: [
      { name: 'preference', type: 'string', description: 'spicy, comfort, healthy, sweet, or quick', required: false }
    ],
    execute: async (args) => {
      const cuisines = [
        { name: 'Artisan Wood-Fired Neapolitan Pizza', vibe: 'Cozy Italian' },
        { name: 'Tonkotsu Ramen with Soft Boiled Egg', vibe: 'Comfort Japanese' },
        { name: 'Street-style Carnitas Tacos with Lime & Cilantro', vibe: 'Vibrant Mexican' },
        { name: 'Thai Green Curry with Jasmine Rice', vibe: 'Fragrant & Spicy' },
        { name: 'Mediterranean Falafel Mezze Platter', vibe: 'Fresh & Healthy' },
        { name: 'Korean Bibimbap with Crispy Rice & Gochujang', vibe: 'Sizzling & Savory' }
      ];
      const pick = cuisines[Math.floor(Math.random() * cuisines.length)];
      return {
        result: `🎰 **Restaurant Roulette Picked:**\n\n**${pick.name}**\n*Vibe:* ${pick.vibe}\n\nEnjoy your meal!`,
        data: pick
      };
    }
  }
];
