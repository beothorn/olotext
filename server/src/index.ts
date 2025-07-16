import Fastify from 'fastify';
import cors from '@fastify/cors';
import { applyAgents, initialState, SceneState } from './game/engine.js';

// Log unexpected errors so that issues during startup are visible
if (process.env.NODE_ENV !== 'test') {
  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console -- ensure visibility when not using logger
    console.error('Unhandled Rejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console -- ensure visibility when not using logger
    console.error('Uncaught Exception:', err);
  });
}

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
    const result: SceneState = await applyAgents(state, body?.option, fastify.log);
    reply.send({
      narrative: result.narrative,
      options: result.options.map((o) => o.option),
    });
  });

  return fastify;
};

if (process.env.NODE_ENV !== 'test') {
  const fastify = createServer();
  fastify
    .listen({ port: 3000 })
    .then(() => {
      // eslint-disable-next-line no-console -- provide a visible hint when running manually
      console.log('🚀 Server ready at http://localhost:3000');
    })
    .catch((err) => {
      fastify.log.error({ err }, 'Failed to start server');
      process.exit(1);
    });
}
