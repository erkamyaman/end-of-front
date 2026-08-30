/**
 * Change detection — Zone.js, OnPush, how Angular decides what to re-render.
 *
 * Angular tie-in: directly builds on Stage 1's event loop/microtask understanding —
 * Zone.js literally patches async browser APIs to know when to run change detection.
 */
