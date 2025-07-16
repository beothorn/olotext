import { describe, it, expect } from 'vitest';
import { createServer } from './index.js';

describe('server', () => {
  it('POST /play returns narrative', async () => {
    const server = createServer();
    const res = await server.inject({
      method: 'POST',
      url: '/play',
      payload: {},
    });
    const body = res.json();
    expect(body.narrative).toContain('Elric Manor');
    expect(body.options.length).toBeGreaterThan(0);
  });
});
