import OpenAI from 'openai';

/**
 * Minimal game engine used by the demo server.
 * Scenes are defined here and `applyAgents` advances the story state.
 * When an OpenAI API key is provided the narrator will use the API to
 * generate short pieces of narration.
 */

export interface Trigger {
  condition: string; // Condition to trigger, for example, detective asks about some clue to Preson X
  effect: string; // What happens when condition is met
}

export interface NarrativeChoice {
  narrative: string; // Previous Narrative
  choice: string; // The choice
}

export interface NarrativeOption {
  option: string; // The option, a full description of an action
  narrative: string; // The next narrative to be used if this option is chosen 
}

export interface SceneState {
  scene: string; // The scene name
  storyBackgroung: string; // Story unchangeable background, secrets, important facts and elements important for the ending to work.
  summary: string; // Summary from previous scene
  sceneState: string; // Description of scene, object, object states (open, closed, broken, wet, dirty, etc)
  sceneSetting: string; // Description of scene mood (scary, eerie, joyfull) , theme to drive the narration
  triggers: Trigger[]; // The scene triggers
  choiceHistory: NarrativeChoice[];
  narrative: string; // Current narrative
  options: NarrativeOption[]; // The options from which the player can chose
}

export const initialState = (): GameState => ({
  "scene": "The Locked Study",
  "storyBackgroung": "Professor Elric was murdered by his apprentice, Lysa, who sought to suppress his discovery of a dangerous summoning ritual. The professor had documented his findings in a hidden journal, parts of which were torn and scattered. The key to uncovering the motive lies in retrieving both the journal page from the safe and evidence of forced entry into the study. Without these, the truth remains obscured, and Lysa evades justice. The player must uncover the safe, retrieve the journal page, and access the study to continue unraveling the mystery.",
  "summary": "Detective Mira arrived at the Elric Manor following the professor’s death. After speaking with the butler and noticing strange behavior, she proceeded alone to the locked study, the last place the professor was seen alive.",
  "sceneState": "The study door is locked. A faint trail of ash leads from under the door into the hallway. A small brass key rests on a nearby side table. An old portrait hangs on the wall, covered in a thick cloth. A grandfather clock ticks steadily in the corner. There is no sign of forced entry on the study door. The room smells faintly of burnt paper.",
  "sceneSetting": "Stillness pervades the manor, broken only by the rhythmic tick of the old clock. Dust hangs in the air, stirred by your movement. The atmosphere is tense and expectant, as if the walls themselves remember what happened here.",
  "triggers": [
    {
      "condition": "Player pulls down the cloth covering the portrait.",
      "effect": "Reveals a hidden safe behind the portrait containing a torn journal page."
    },
    {
      "condition": "Player examines and uses the brass key on the study door.",
      "effect": "Unlocks the study, allowing access to the next room where more clues can be found."
    },
    {
      "condition": "Player retrieves the journal page from the safe AND unlocks and enters the study.",
      "effect": "Scene goals complete. Transition to next scene: 'Back at Home' — Mira begins analyzing the evidence collected from the Elric estate."
    }
  ],
  "choiceHistory": [
    {
      "narrative": "You arrive at Elric Manor as dusk begins to fall. The butler greets you stiffly, his eyes betraying unease.",
      "choice": "Ask the butler about Elric’s final days."
    }
  ],
  "narrative": "You stand before the locked door of the professor’s study. The air is thick with dust and tension. Something about this place doesn’t feel right.",
  "options": [
    {
      "option": "Examine the brass key on the side table.",
      "narrative": "You approach the side table, noting how out of place it seems — too clean, too deliberate. The brass key lies atop it, glinting faintly. When you pick it up, it’s warm, and smudges suggest it was used recently. This key could be your entry point — or someone else's exit."
    },
    {
      "option": "Pull down the cloth covering the portrait.",
      "narrative": "You lift the heavy cloth in one swift motion, sending a puff of dust into the stale air. Beneath is a portrait of Professor Elric, painted with austere precision. But behind it, a subtle groove in the wall draws your eye — a square outline barely visible. You press against it, and with a faint click, a small wall safe is revealed, its dial untouched for years — until now."
    },
    {
      "option": "Knock on the study door and listen.",
      "narrative": "You knock softly, the sound dull against the thick oak. You wait. Nothing. Just the groaning timbers of the manor settling. Then, a whisper of movement — so faint you question if it was real — and the unmistakable scent of scorched parchment grows stronger. Someone has been here. Maybe they still are."
    }
  ]
});

const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const NARRATOR_PROMPT = `You are the Narrator of a text adventure game. 
Use the provided scene description and options to craft the next narration. 
Keep the story consistent and concise. Always respond in JSON, here described using typescript:
export interface Trigger {
  condition: string; // Condition to trigger, for example, detective asks about some clue to Preson X
  effect: string; // What happens when condition is met
}

export interface NarrativeChoice {
  narrative: string; // Previous Narrative
  choice: string; // The choice
}

export interface NarrativeOption {
  option: string; // The option, a full description of an action
  narrative: string; // The next narrative to be used if this option is chosen 
}

export interface SceneState {
  scene: string; // The scene name
  storyBackgroung: string; // Story unchangeable background, secrets, important facts and elements important for the ending to work.
  summary: string; // Summary from previous scene
  sceneState: string; // Description of scene, object, object states (open, closed, broken, wet, dirty, etc)
  sceneSetting: string; // Description of scene mood (scary, eerie, joyfull) , theme to drive the narration
  triggers: Trigger[]; // The scene triggers
  choiceHistory: NarrativeChoice[];
  narrative: string; // Current narrative
  options: NarrativeOption[]; // The options from which the player can chose
}
`;

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
  state: SceneState,
  choice?: string,
  logger?: Logger,
) {
  logger?.info({ choice, current: state.narrative }, 'applyAgents called');
  if (choice) {
    const next = scene.options[choice];
    if (next) {
      // TODO: Update narrative, options, choiceHistory
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
