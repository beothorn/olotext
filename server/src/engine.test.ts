import { describe, it, expect } from 'vitest';
import { applyAgents, initialState } from './game/engine.js';

describe('engine', () => {
  it('returns start scene on first call', async () => {
    const state = initialState();
    const res = await applyAgents(state);
    expect(res.narrative).toContain('Elric Manor');
    expect(res.options.length).toBeGreaterThan(0);
  });

  it('advances scene when option chosen', async () => {
    const state = initialState();
    await applyAgents(state, 'Examine the brass key on the side table.');
    const res = await applyAgents(state);
    expect(res.narrative).not.toEqual('');
  });
});
