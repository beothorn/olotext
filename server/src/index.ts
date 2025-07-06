import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './trpc/router.ts';
import cors from '@fastify/cors';

const createContext = () => ({});

const startServer = async () => {
    const fastify = Fastify({ logger: true });

    await fastify.register(cors, {
        origin: true,
    });

    // tRPC endpoint
    await fastify.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext },
    });

    try {
        await fastify.listen({ port: 3000 });
        console.log('🚀 Server ready at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();