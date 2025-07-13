import OpenAI from 'openai';

/**
 * Minimal game engine used by the demo server.
 * Scenes are defined here and `applyAgents` advances the story state.
 * When an OpenAI API key is provided the narrator will use the API to
 * generate short pieces of narration.
 */

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

export interface Logger {
  info: (obj: any, msg?: string) => void;
  error: (obj: any, msg?: string) => void;
}

/**
 * Advance the game state based on a player's choice and
 * return the next narration with the available options.
 *
 * @param state  Mutable game state shared across requests
 * @param choice The option chosen by the player
 * @param logger Optional logger used for debug information
 */
export async function applyAgents(
  state: GameState,
  choice?: string,
  logger?: Logger,
) {
  logger?.info({ choice, current: state.current }, 'applyAgents called');
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
    try {
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
      } catch (err) {
        logger?.error({ err, content }, 'Failed to parse OpenAI response');
      }
    } catch (err) {
      logger?.error({ err }, 'OpenAI request failed');
    }
  }
  return { narration: scene.text, options: Object.keys(scene.options) };
}
