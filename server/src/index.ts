import Fastify from 'fastify';
import cors from '@fastify/cors';
import { applyAgents, initialState } from './game/engine.js';

/**
 * Creates and configures the Fastify server used by the demo.
 */

export const createServer = () => {
  const fastify = Fastify({ logger: true });
  const state = initialState();

  fastify.register(cors, { origin: true });

  // Centralised error handling so that uncaught exceptions are logged
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error({ err: error }, 'Unhandled error');
    reply.status(500).send({ error: 'Internal Server Error' });
  });

  fastify.post('/play', async (request, reply) => {
    const body = request.body as { option?: string } | undefined;
    fastify.log.info({ option: body?.option }, 'processing /play');
    const result = await applyAgents(state, body?.option, fastify.log);
    reply.send(result);
  });

  return fastify;
};

if (process.env.NODE_ENV !== 'test') {
  const fastify = createServer();
  fastify.listen({ port: 3000 }).then(() => {
    // eslint-disable-next-line no-console -- provide a visible hint when running manually
    console.log('🚀 Server ready at http://localhost:3000');
  });
}
