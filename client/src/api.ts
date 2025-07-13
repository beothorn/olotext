import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/src/trpc/router';

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

export const fetchNarrative = (choiceId?: string) =>
  client.narrative.mutate({ choiceId });
