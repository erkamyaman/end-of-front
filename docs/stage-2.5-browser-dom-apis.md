# Stage 2.5: Browser & DOM APIs

## DOM manipulation basics: querySelector, creating/removing nodes.

<Badge type="info" text="todo" />

`01-dom-manipulation-basics.js`

Angular tie-in: what Angular's template binding ([class], [style], interpolation) is doing on your behalf under the hood.

## fetch and the native request/response cycle: what HttpClient is wrapping.

<Badge type="info" text="todo" />

`02-fetch-and-request-response-cycle.js`

Angular tie-in: directly compare a raw fetch() call to the equivalent HttpClient.get() to see exactly what Angular adds (interceptors, typed responses, RxJS integration).

## Events & event delegation: bubbling/capturing.

<Badge type="info" text="todo" />

`03-events-and-event-delegation.js`

Angular tie-in: what (click)="handler()" compiles down to, and why delegation matters for performance in a long *ngFor list of clickable rows.

## Browser storage: localStorage, sessionStorage, cookies.

<Badge type="info" text="todo" />

`04-browser-storage.js`

Angular tie-in: common pattern of persisting NgRx/Signal state to localStorage, and the JSON serialization gotchas from Stage 1 come back here.

## Web Components basics: custom elements, shadow DOM.

<Badge type="info" text="todo" />

`05-web-components-basics.js`

Angular tie-in: Angular Elements lets you package a component as a Web Component. worth seeing the standard your framework is built on.

## Strict mode: what it changes.

<Badge type="info" text="todo" />

`06-strict-mode.js`

Angular tie-in: TypeScript's strict compiler flag builds on this same philosophy. stricter checks catch bugs earlier, same trade-off.

## Memory management: memory lifecycle, garbage collection basics.

<Badge type="info" text="todo" />

`07-memory-management.js`

Angular tie-in: the #1 real-world Angular memory leak. A component destroyed without unsubscribing its Observables, so the subscription (and everything it closes over) never gets garbage collected.

## Debugging with DevTools: memory profiling, performance tab.

<Badge type="info" text="todo" />

`08-debugging-with-devtools.js`

Angular tie-in: pair this with the Angular DevTools browser extension, which overlays component tree/change-detection info on top of the generic browser tools.
