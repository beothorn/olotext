import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
    narrative: t.procedure
        .input(z.object({ state: z.string() }))
        .query(({ input }) => {
            return {
                narration: `Narrative for state: ${input.state}`,
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            };
        }),
});

export type AppRouter = typeof appRouter;