import OpenAI from 'openai';

export interface Scene {
  text: string;
  options: Record<string, string>; // option text -> next scene id
}

export interface GameState {
  current: string;
  history: { choice: string; scene: string }[];
}

export const scenes: Record<string, Scene> = {
  start: {
    text: 'You arrive at 221B Baker Street where Sherlock Holmes awaits with a sealed letter.',
    options: {
      'Read the letter': 'letter',
      'Go to Scotland Yard': 'yard',
    },
  },
  letter: {
    text: 'The letter details a baffling mystery involving a stolen jewel.',
    options: {
      'Discuss the case with Holmes': 'discuss',
      'Ignore it and rest': 'end',
    },
  },
  yard: {
    text: 'Inspector Lestrade greets you at Scotland Yard with news of a crime.',
    options: {
      'Return to Holmes with the news': 'discuss',
      'Investigate on your own': 'end',
    },
  },
  discuss: {
    text: 'Holmes pieces together the clues and sets out to solve the case.',
    options: {
      'Follow Holmes': 'end',
    },
  },
  end: {
    text: 'The adventure concludes for now.',
    options: {},
  },
};

export const initialState = (): GameState => ({ current: 'start', history: [] });

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const NARRATOR_PROMPT = `You are the Narrator of a text adventure game. Use the provided scene description and options to craft the next narration. Keep the story consistent and concise. Always respond in JSON with keys \\"narration\\" and \\"options\\".`;

export async function applyAgents(state: GameState, choice?: string) {
  if (choice) {
    const scene = scenes[state.current];
    const next = scene.options[choice];
    if (next) {
      state.history.push({ choice, scene: next });
      state.current = next;
    }
  }
  const scene = scenes[state.current];
  if (openai) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: NARRATOR_PROMPT },
        {
          role: 'user',
          content: `Scene: ${scene.text}\nOptions: ${Object.keys(scene.options).join('; ')}`,
        },
      ],
      response_format: { type: 'json_object' },
    });
    const content = completion.choices[0].message.content ?? '{}';
    try {
      return JSON.parse(content);
    } catch {
      return { narration: scene.text, options: Object.keys(scene.options) };
    }
  }
  return { narration: scene.text, options: Object.keys(scene.options) };
}
