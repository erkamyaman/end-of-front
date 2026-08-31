# end-of-front

[![CI](https://github.com/erkamyaman/end-of-front/actions/workflows/ci.yml/badge.svg)](https://github.com/erkamyaman/end-of-front/actions/workflows/ci.yml)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=fff)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=000)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff)

Having fun with JS/TS and their connection with Angular. A staged path through the
fundamentals that framework work lets you skip, one file per topic, each opening with
what the topic is and where it shows up in Angular. Written by hand, on purpose.

## Stages

| Stage | Topic                                                        | Items |
| ----- | ------------------------------------------------------------ | ----- |
| 1     | [Core JavaScript](stage-1-core-javascript)                   | 16    |
| 2     | [Asynchronous JavaScript](stage-2-async-javascript)          | 6     |
| 2.5   | [Browser & DOM APIs](stage-2.5-browser-dom-apis)             | 8     |
| 2.7   | [Modern JS Structures](stage-2.7-modern-js-structures)       | 4     |
| 3     | [RxJS & Angular's Reactive Model](stage-3-rxjs-and-signals)  | 4     |
| 4     | [Angular Internals](stage-4-angular-internals)               | 3     |
| 4.5   | [Accessibility](stage-4.5-accessibility)                     | 4     |
| 5     | [Rendering Models](stage-5-rendering-models)                 | 3     |
| 6     | [Testing](stage-6-testing)                                   | 3     |
| 7     | [Architecture](stage-7-architecture)                         | 3     |
| 8     | [Extra Angular Feature Areas](stage-8-angular-feature-areas) | 6     |

Stages 3-8 carry chapter references to _Modern Angular_ (Steyer) in their READMEs.

## Having fun with JS/TS and their connection with Angular

The point isn't to grind a checklist. It's to poke at the language until the framework
stops looking like magic. Every topic here has an Angular tie-in written at the top of
its file, so the plain JavaScript you write by hand always lands somewhere you already
recognize: a closure becomes why a service holds state, the event loop becomes why
change detection fires when it does, prototypes become what `extends` was doing all
along.

Break things on purpose. Guess the output before you run it. The surprises are the
part worth keeping.

## Working a topic

Each topic file doubles as a test file. Write your prediction as an assertion, then
run it. A wrong mental model fails loudly instead of scrolling past in a log.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('closures capture the variable, not its value', () => {
  const counter = makeCounter();
  assert.equal(counter(), 1);
  assert.equal(counter(), 2);
});
```

```
npm test          # run every stage file
npm run test:watch
npm run lint      # eslint
npm run format    # prettier
```

`jsconfig.json` turns on `checkJs`, so the editor type-checks plain `.js` with no
build step. `.vscode/` carries format-on-save and the two extension recommendations.
