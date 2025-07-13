import Fastify from 'fastify';
import cors from '@fastify/cors';
import { applyAgents, initialState } from './game/engine.js';

export const createServer = () => {
  const fastify = Fastify({ logger: true });
  const state = initialState();

  fastify.register(cors, { origin: true });

  fastify.post('/play', async (request, reply) => {
    const body = request.body as { option?: string } | undefined;
    const result = await applyAgents(state, body?.option);
    reply.send(result);
  });

  return fastify;
};

if (process.env.NODE_ENV !== 'test') {
  const fastify = createServer();
  fastify.listen({ port: 3000 }).then(() => {
    console.log('🚀 Server ready at http://localhost:3000');
  });
}
