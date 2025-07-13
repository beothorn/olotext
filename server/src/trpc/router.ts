import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import OpenAI from 'openai';

const t = initTRPC.create();
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const appRouter = t.router({
    narrative: t.procedure
        .input(z.object({ choiceId: z.string().optional() }))
        .mutation(async ({ input }) => {
            const choice = input.choiceId ?? 'start';
            let narration = `Dummy narrative for ${choice}`;
            try {
                if (openai) {
                    const completion = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            { role: 'user', content: `Provide a very short narrative for ${choice}` },
                        ],
                    });
                    narration = completion.choices[0].message?.content ?? narration;
                }
            } catch {
                // ignore errors and use dummy narration
            }
            return {
                narration,
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            };
        }),
});

export type AppRouter = typeof appRouter;