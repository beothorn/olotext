# Olotext

Olotext is a text adventure LLM engine.
With Olotext, you can play a semi-free, that tries to balance predetermined story telling with free choices.  

This is done by using scenes setups, which are definitions of the outline of a narration, triggers and elements.  
Behind the scenes, different agents work to keep the story consistent, plan events and react to player choices.  
Instead of free text, the player chooses between a number of actions, giving the author more control over the narrative.

## Running the demo game

The repository contains a minimal example inspired by Sherlock Holmes. It is split into a server and a client.

1. **Start the server**

   ```bash
   cd server
   npm install
   # provide your OpenAI key so the narrator can use GPT
   export OPENAI_API_KEY=sk-your-key
   npm run dev
   ```

   The server listens on `http://localhost:3000` and exposes a `/play` endpoint.

2. **Start the client** in another terminal:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Open the printed URL in your browser to play the game. Clicking an option sends it to the server and the next piece of narration is displayed.

# Game flow

The following agents are present:
- Narrator - Creates the narrative, the options and preemptively create the narrative for the options
- ConsistencyKepper - Verifies that the current state is consistent
- SceneStateKepper - Updates the part of the state that has the scene physical state (objects, positions, object states, etc) 
- AbstractStateKeeper - Updates the part of the state that has the scene abstract state (mood)
- TriggerWatcher - Watches for triggers and request the narrator to apply the trigger action when any trigger condition is met
- Summarizer - Summarizes what happened so far  
- SceneChangeWatcher - Watch for triggers that change the scene  

The game state looks like this:

```
{
    "scene": "The scene name",
    "storyBackgroung": "Story unchangeable background, secrets, important facts and elements important for the ending to work.",
    "summary": "Summary from previous scene",
    "sceneState": "Description of scene, object, object states (open, closed, broken, wet, dirty, etc)",
    "sceneSetting": "Description of scene mood (scary, eerie, joyfull) , theme to drive the narration",
    "triggers" : [
        {"condition": "Condition to trigger, for example, detective asks about some clue to Preson X", "effect": "What happens when condition is met"}
    ],
    "choiceHistory": [
        {"narrative": "Previous Narrative", "choice": "The choice"}, 
    ]
}
```


```
# story_background has the fundamental facts from the story that can not be altered 

initial_state = StateFromFile()

while not game_over:
    # Step 1: Present narration + choices the choices must have the next narration already
    narration, choices, choices_narrations = Narrator(scene_state, abstract_state, current_scene, chat_history)

    # Step 2: Validate output, if 
    if not ConsistencyKeeper(narration, choices, scene_state, abstract_state, previous_summary, story_background):
        RetryNarrator()
        
    # Step 3: Display and get player input
    player_choice = GetPlayerInput(choices)
   
    # Step 4: Check for triggered events, if there are triggers, ask narrator to apply effect
    # if effect is scene transition, start scene transition logic (states are copied, summary is done)
    triggers_fired = TriggerWatcher(scene_state, abstract_state, chat_history)
 
    # Step 5: Update state
    scene_state = SceneStateKeeper(scene_state, player_choice, result_narration)
    abstract_state = AbstractStateKeeper(abstract_state, player_choice, result_narration)

   UpdateStateAndShowNextNarrative()
```

## Running tests

Both the server and client have unit tests:

```bash
cd server && npm test
cd ../client && npm test
```

## OpenAI narration

Set the `OPENAI_API_KEY` environment variable before starting the server. When present, the narrator uses the `gpt-4o-mini` model from OpenAI to generate narration and options in JSON format.

