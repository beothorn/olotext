# Olotext Server

This directory contains the Fastify server powering the demo game. Use `npm run dev` to start it during development.

## Logging

The server uses Fastify's built-in logger. Additional logs have been added so that calls to `/play` and errors are visible in the console. When the `OPENAI_API_KEY` environment variable is present the server will also attempt to fetch narration from OpenAI; any failures are logged.

## Error handling

Unhandled exceptions are caught by a global error handler which returns a generic 500 response while logging the underlying error.
