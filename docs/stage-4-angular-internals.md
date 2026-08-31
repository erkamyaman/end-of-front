# Stage 4 — Angular Internals

> **Book:**Modern Angular (Steyer) — Ch. 5 Services (Injection Context, Providers, Provider Functions), Ch. 3 "Signals in the Component Lifecycle" section

## Change detection — Zone.js, OnPush, how Angular decides what to re-render.

<Badge type="info" text="todo" />

`01-change-detection.js`

Angular tie-in: directly builds on Stage 1's event loop/microtask understanding — Zone.js literally patches async browser APIs to know when to run change detection.

## Dependency Injection — providers, injection tokens, hierarchical injectors.

<Badge type="info" text="todo" />

`02-dependency-injection.js`

Angular tie-in: you use this daily via constructor injection — now understand the resolution mechanics behind it.

## Component lifecycle — not just which hook fires when but why (e.g. why ngOnChanges fires before ngOnInit).

<Badge type="info" text="todo" />

`03-component-lifecycle.js`
