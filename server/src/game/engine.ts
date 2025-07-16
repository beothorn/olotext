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
  choiceHistory: NarrativeOption[];
  narrative: string; // Current narrative
  options: NarrativeOption[]; // The options from which the player can chose
}

export const initialState = (): GameState => ({
  "scene": "The Locked Study",
  "style": "Investigative gothic — a blend of detective fiction and slow-burning gothic suspense. Descriptions are atmospheric, with attention to sensory details, decaying grandeur, and the psychological unease of uncovering secrets.",
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
  "narrative": "The carriage ride through the northern hills had been quiet, save for the wind clawing at the windows. Now, as you step out beneath the looming gables of Elric Manor, the air changes. It tastes of old stone and withered ivy. The estate squats against the landscape like a forgotten cathedral — too old, too silent.\n\nYou are Detective Mira Voss, summoned here after the sudden death of Professor Aldus Elric — linguist, historian, and eccentric recluse. The official reports spoke of heart failure. But someone whispered your name in the right ear — someone who believed there was more to the story. You’ve been called not just to examine a corpse, but to interpret the silence that followed it.\n\nInside, the butler offered no more than practiced politeness. No mourning, no details. Just a gesture toward the west wing — the professor’s study. Now you stand before its locked door. The hallway is long, its walls hung with faded tapestries and ancestors who glare from gilt frames. The scent of scorched parchment clings to the air. Behind you, the manor sighs with age.\n\nYou take in your surroundings: the old grandfather clock ticking a tempo no longer matched to time, a covered portrait draped in heavy cloth, and on a nearby table — a brass key, left as if for you. The manor offers no welcome. Only a riddle.\n\nSomething happened in that study. And someone went to great effort to make sure you’d find it sealed.",
  "options": [
    {
      "option": "Examine the brass key on the side table.",
      "narrative": "You cross the wooden floor, careful to avoid the faded rug whose patterns seem to shift in the dim light. The brass key sits atop a dusty lace doily, too clean for the rest of the scene — untouched by time, or perhaps cleaned in haste. When you lift it, it's warm. Recently held. Not by the butler, you're sure — his hands were empty. There’s a small, engraved symbol on the bow of the key: an eye, half-shut. This was meant for someone to find. Possibly you."
    },
    {
      "option": "Pull down the cloth covering the portrait.",
      "narrative": "You reach for the cloth with a hesitant hand. It's heavy, velvet, and old — the type that remembers fire and ceremony. As you drag it down, it collapses in a heap, revealing a severe portrait of Elric, painted not with affection but obsession. But the frame is set oddly into the wall, the plaster surrounding it cracked in a neat square. You press the frame’s edge — a subtle click answers. There’s something behind it. A compartment, perhaps. Locked, hidden. Expected."
    },
    {
      "option": "Knock on the study door and listen.",
      "narrative": "You knock. Once, twice. The sound dulls quickly in the thick wood, swallowed by the hush of the manor. You lean in, breath held. Behind the door, a silence too complete — as though something inside were holding its breath, too. Then, so faint you nearly miss it: the rustle of paper, the scrape of something dragging. Your heart stutters. The scent of burnt parchment intensifies. Someone — or something — was here not long ago."
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

export interface NarrativeOption {
  option: string; // The option, a full description of an action
  narrative: string; // The next narrative to be used if this option is chosen 
}

export interface SceneState {
  scene: string; // The scene name
  style: string; // The narrative style, serve as a guide to the next narratives
  storyBackgroung: string; // Story unchangeable background, secrets, important facts and elements important for the ending to work.
  summary: string; // Summary from previous scene
  sceneState: string; // Description of scene, object, object states (open, closed, broken, wet, dirty, etc)
  sceneSetting: string; // Description of scene mood (scary, eerie, joyfull) , theme to drive the narration
  triggers: Trigger[]; // The scene triggers
  choiceHistory: NarrativeOption[];
  narrative: string; // Current narrative
  options: NarrativeOption[]; // The options from which the player can chose
}
Given the previous scene state and the choice generate the new scene state by:
- updating the summary
- updating the scene state
- update the choice history
- replace the narrative with the choice
- create new options with new narratives`;

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
): SceneState {
  if(!choice) return initialState();
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: NARRATOR_PROMPT },
        {
          role: 'user',
          content: choice,
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
