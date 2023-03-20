# Kesplora Svelte Client

This is an initial attempt at a web client for the Kesplora API. It is not ready for use, contributions, or testing yet. This is starting as an attempt to learn Svelte.

## Status

Not ready for any sort of use or contribution. Things will change quick and in breaking ways.

## Technology

This web client is built with Svelte. Since the API is a separate tech stack, there was an explicit decision to not use a full framework such as SvelteKit. On top of Svelte, various libraries are used for presentation and manipulation, including (but not limited to):

- Typescript
- svelte-routing
- sveltestrap - Bootstrap 5 wrapper

## Setting Up

Vite listens for environment variables and compile / build time on the `import.meta.env` object. See: [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html). Only variables prefixed with `VITE_` are processed. See, for example, `src/api/client.ts`.

This web client takes the following environment variables:

- VITE_API -> The Kesplora API instance to connect to, defaults to `http://localhost:8080`

## Running

To run in dev mode, simply run `npm run dev`. This will start an initial build and then watch the filesystem for changes and attempt to hot reload the browser as changes are made.

To build for production, run `npm run build`. This will compile with production in mind. This means smaller outputs meant for distribution. This bundle can then be hosted behind, for example, nginx or Netlify.

**Note:** Remember ot pass in the appropriate environment variables to ensure the systems connect! For example, `VITE_API=http://localhost:3000 npm run build`.

## Notes

This is in active development. As best practices are uncovered and new approaches are considered, many of the specific API calls and layouts may change. While this is "an official" web client, it serves mostly as a proof of concept and example of what can be done, both with the local client technologies but also with the Kesplora API engine. If you have thoughts, suggestions, or changes, consider opening an Issue to discuss or contact one of the authors to discuss.
