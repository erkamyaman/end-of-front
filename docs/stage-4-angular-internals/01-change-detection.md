# Change detection

<Badge type="info" text="todo" />
`stage-4-angular-internals/01-change-detection.js`

Zone.js, OnPush, how Angular decides what to re-render.

Angular tie-in: directly builds on Stage 1's event loop/microtask understanding. Zone.js literally patches async browser APIs to know when to run change detection.
