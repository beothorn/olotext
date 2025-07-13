import { appRouter } from './router';
import { describe, it, expect } from 'vitest';

describe('narrative procedure', () => {
  it('returns a narrative and options', async () => {
    const caller = appRouter.createCaller({});
    const result = await caller.narrative({ choiceId: '1' });
    expect(result.narration.length).toBeGreaterThan(0);
    expect(result.options).toHaveLength(4);
  });
});
