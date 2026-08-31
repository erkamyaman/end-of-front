# Stage 3: RxJS & Angular's Reactive Model

> **Book:**Modern Angular (Steyer), Ch. 2-3 Signal-Based Components & Reactive Design with Signals, Ch. 6 Signal Forms, Ch. 10 Signal Queries & Component Communication

## Observable vs Promise: multiple values over time, cancellable, lazy.

<Badge type="info" text="todo" />

`01-observable-vs-promise.js`

Angular tie-in: this is the concept every HttpClient call and reactive form rests on. Get this solid and RxJS stops feeling arbitrary.

## Core operators: map, switchMap, mergeMap, debounceTime, takeUntil.

<Badge type="info" text="todo" />

`02-core-operators.js`

Angular tie-in: you've used these blind. Now know why switchMap cancels in-flight requests (e.g. search-as-you-type) while mergeMap runs them all.

## Subscription management & memory leaks: why takeUntil(destroy$) or the async pipe exists.

<Badge type="info" text="todo" />

`03-subscription-management-and-memory-leaks.js`

Angular tie-in: directly closes the loop with Stage 2.5's memory management item. this is the Angular-specific version of that same leak.

## Signals vs RxJS: Angular's newer reactivity model.

<Badge type="info" text="todo" />

`04-signals-vs-rxjs.js`

Angular tie-in: knowing when a signal() is the right (simpler) tool vs when you genuinely need an Observable stream.
