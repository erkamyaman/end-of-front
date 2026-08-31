# Stage 2: Asynchronous JavaScript

## Callbacks: the "old way."

<Badge type="info" text="todo" />

`01-callbacks.js`

Angular tie-in: recognizing callback-style browser APIs (e.g. addEventListener) vs Angular's Observable-first style for the same kind of event stream.

## Promises: states, chaining, .then/.catch/.finally, Promise.all/allSettled/race.

<Badge type="info" text="todo" />

`02-promises.js`

Angular tie-in: HttpClient returns Observables, not Promises. Knowing Promises well is what lets you correctly use firstValueFrom/lastValueFrom to bridge the two instead of guessing.

## async/await: sugar over Promises.

<Badge type="info" text="todo" />

`03-async-await.js`

Angular tie-in: using async/await inside an Angular service method that wraps a firstValueFrom(this.http.get(...)) call, and why you can't await an Observable directly.

## Error handling in async code: try/catch with await, unhandled rejection gotchas.

<Badge type="info" text="todo" />

`04-error-handling-in-async-code.js`

Angular tie-in: catchError in an RxJS pipe is the Observable-world equivalent of try/catch. Same job, different syntax.

## Callback hell & why Promises replaced it: nested pyramid-of-doom vs flat .then() chains.

<Badge type="info" text="todo" />

`05-callback-hell-and-promises.js`

Angular tie-in: seeing why RxJS operators (switchMap etc.) exist for the exact same "flatten nested async" reason.

## Fetch vs XMLHttpRequest: fetch is the modern default.

<Badge type="info" text="todo" />

`06-fetch-vs-xmlhttprequest.js`

Angular tie-in: HttpClient can be backed by either XHR or the newer fetch-based backend depending on how it's configured. Worth knowing which your app uses.
