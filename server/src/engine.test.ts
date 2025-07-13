import { describe, it, expect } from 'vitest';
import { applyAgents, initialState } from './game/engine.js';

describe('engine', () => {
  it('returns start scene on first call', () => {
    const state = initialState();
    const res = applyAgents(state);
    expect(res.narration).toContain('221B');
    expect(res.options.length).toBeGreaterThan(0);
  });

  it('advances scene when option chosen', () => {
    const state = initialState();
    applyAgents(state, 'Read the letter');
    const res = applyAgents(state);
    expect(res.narration).toContain('stolen jewel');
  });
});
