# 01 Scope & closures

<Badge type="tip" text="written" />
`stage-1-core-javascript/01-scope-and-closures.js`

why a function "remembers" variables after it returns.

Angular tie-in: why services/singletons keep state across your whole app.

```js
var globalVar = 'I am a global variable';
// global scope var is accessible everywhere in the code

function myFunction() {
  const functionVar = 'I am a function variable';
  // function scope var is accesible withing the function it is declared

  if (true) {
    const blockVar = 'I am a block scope variable';
    // block scope variable is only accessible withing the block it is declared

    console.log('Inside block:');
    console.log(globalVar);
    console.log(functionVar);
    console.log(blockVar);
  }

  console.log('Inside function:');
  console.log(globalVar);
  console.log(functionVar);
}

myFunction();

console.log('In global scope:');
console.log(globalVar);

// Lexical scope
// JavaScript uses lexical scoping, meaning that the scope of a variable is determined by its location within the source code. Nested functions have access to variables declared in their outer scope.

function outerFunction() {
  var outerVar = 'I am outside';
  const s = 's';

  function innerFunction() {
    console.log(s);
    console.log(outerVar); // Accessible here
  }

  innerFunction();
}

outerFunction();
```

## 01.1 var / let / const

<Badge type="tip" text="written" />
`stage-1-core-javascript/01.1-var-let-const.js`

three ways to declare, three different scoping rules. var is function-scoped and hoisted as undefined; let and const are block-scoped and unusable before their declaration line.

Angular tie-in: const by default in components and services, let only when the value genuinely changes. The same discipline TypeScript's readonly and Angular's OnPush both lean on: fewer things that can change means fewer things to re-check.

```js
// Behaviour                    | var               | let            | const
// -----------------------------|-------------------|----------------|----------------
// Scope                        | function/global   | block          | block
// Initialization               | optional          | optional       | required
// Redeclaration                | yes               | no             | no
// Reassignment                 | yes               | yes            | no
// Access before declaration    | undefined         | ReferenceError | ReferenceError

// Block scope vs function scope
// let and const only live inside the nearest { }. var ignores blocks and belongs
// to the whole function.

const abc = 's';
function scopeDemo() {
  console.log(abc);
  const x = 1;
  if (true) {
    var functionScoped = 'var: visible in the whole function';
    const blockScoped = 'const: visible only in this block';
    console.log(blockScoped);
  }

  console.log(functionScoped);
  // console.log(blockScoped); // ReferenceError: blockScoped is not defined
}

scopeDemo();

// const is a constant binding, not a constant value
// The variable cannot be reassigned, but the object it points at can still change.

const config = { retries: 3 };
config.retries = 5;
console.log('const object mutated:', config);
// config = { retries: 5 }; // TypeError: Assignment to constant variable

// Temporal dead zone
// var is hoisted and initialised to undefined; let and const are hoisted but stay
// unusable until their declaration line is reached.

function tdzDemo() {
  console.log('var before declaration:', hoistedVar);

  try {
    console.log(notYetInitialised);
  } catch (error) {
    console.log('let before declaration:', error.constructor.name);
  }

  var hoistedVar = 'var assigned later';
  let notYetInitialised = 'let assigned later';
  console.log('var after declaration:', hoistedVar);
  console.log('let after declaration:', notYetInitialised);

  notYetInitialised = 'let reassigned';
  console.log('let reassigned:', notYetInitialised);
}

tdzDemo();
```

## 01.2 Class fields vs variables

<Badge type="tip" text="written" />
`stage-1-core-javascript/01.2-class-fields-vs-variables.js`

`this.x` is a property on an object, not a variable.

var/let/const create a binding in a scope. A class field creates a property on the instance. They are different mechanisms with different lifetimes, and that is why one is reached by name and the other only through `this`.

Angular tie-in: every `this.count`, `this.http`, `this.form` in a component is a property lookup on the instance, which is why losing `this` in a callback breaks it, and why arrow functions became the default in component code.

```js
/**
 *                | var / let / const              | this.count
 *   -------------|--------------------------------|---------------------------------
 *   lives in     | a scope (block or function)    | an object in memory
 *   dies when    | the block/function exits       | the object is garbage collected
 *   reached by   | naming it: `local`             | going through the object
 */

class Counter {
  count = 0; // a class field: a property on each instance

  increment() {
    let local = 0; // a variable: a binding in this method's scope

    this.count++;
    local++;

    return { count: this.count, local };
  }
}

const a = new Counter();
const b = new Counter();

a.increment();
a.increment();
b.increment();

console.log(a.count, b.count); // 2 1, separate objects, separate properties
console.log(a.increment().local); // 1 every time. The local dies each call

/**
 * Why `this.` is not optional.
 *
 * A variable is in scope, so you say its name. A property is in no scope at all, so
 * you need a reference to the object holding it. Dropping `this.` is a ReferenceError,
 * not a silent read of the field.
 */
class Broken {
  count = 0;

  increment() {
    // eslint-disable-next-line no-undef
    return count++; // ReferenceError: count is not defined
  }
}

try {
  new Broken().increment();
} catch (err) {
  console.log('dropping `this.`:', err.constructor.name); // ReferenceError
}

/**
 * Losing `this`: the setup for 02-this-binding.js.
 *
 * Because `this.count` resolves through `this`, anything that changes what `this`
 * points at breaks the lookup. Passing a method as a bare callback does exactly that:
 * the method travels without the object it came from.
 */
const detached = a.increment;

try {
  detached(); // `this` is undefined inside a class body (always strict mode)
} catch (err) {
  console.log('detached method:', err.constructor.name); // TypeError
}

console.log(a.increment.call(a).count); // works: `this` supplied explicitly
console.log((() => a.increment()).call(null).count); // works: arrow closes over `a`

/**
 * In Angular (TypeScript):
 *
 *   export class MyComponent {
 *     count = 0;                          // class field
 *     readonly http = inject(HttpClient); // readonly is the `const` analogue:
 *                                         // blocks reassignment, not mutation,
 *                                         // and is compile-time only
 *
 *     ngOnInit() {
 *       setTimeout(this.tick, 1000);       // broken: `this` is lost
 *       setTimeout(() => this.tick(), 1000); // fine: arrow keeps `this`
 *     }
 *   }
 */
```

## 01.3 Scope, the simple version

<Badge type="tip" text="written" />
`stage-1-core-javascript/01.3-scope-boxes.js`

every { } is a box.

"block scoped" answers one question only: which box does this declaration live in? The nearest { } around it. It says nothing about how far inward the name reaches. Two rules cover everything:

1. Looking outward works.     Code inside a box sees every box around it.   2. Looking inward does not.   Code outside a box cannot see what is inside it.

That is why the same `const` can look global, function scoped, or tightly scoped: nothing changed but the size of the box you declared it in.

See 01.1-var-let-const.js for the reassignment and temporal-dead-zone differences.

Angular tie-in: a value declared in ngOnInit dies with it, a class field lives as long as the component, and a value in a service lives as long as the injector. same rule, three box sizes.

```js
const fileBox = 'declared at the top level of the file';

function boxes() {
  const functionBox = 'declared at the top of the function body';

  if (true) {
    const ifBox = 'declared inside the if-block';

    console.log(fileBox);
    console.log(functionBox);
    console.log(ifBox);
  }

  // console.log(ifBox); // ReferenceError, looking inward is blocked
}

boxes();

/**
 * Why a top-level const looks "global".
 *
 * Its box is the whole file, and every function in the file is inside that box, so
 * rule 1 applies. In a module (this repo is "type": "module") the file's top level
 * is module scope, not the true global: `fileBox` is visible everywhere in this file,
 * nowhere else, and never lands on globalThis.
 */
console.log('on globalThis?', globalThis.fileBox); // undefined

/**
 * Why a const at the top of a function looks "function scoped".
 *
 * It is not an exception. The function body is itself a box, and that box happens to
 * be the whole function, so the const is visible throughout it. Move the same
 * declaration into an inner block and it dies at the closing brace.
 */
function sameConstTwoPlaces() {
  const wide = 'top of the body: visible in the whole function';

  {
    const narrow = 'inner block: gone after this brace';
    console.log(wide, '|', narrow);
  }

  console.log(wide);
  // console.log(narrow); // ReferenceError
}

sameConstTwoPlaces();

/**
 * var is the one that breaks the pattern.
 *
 * It ignores if/for/plain blocks and only respects function boxes, so a var declared
 * in an inner block leaks out to the whole function. That leak is the bug source
 * let and const were added to fix.
 */
function varLeaks() {
  if (true) {
    var leaked = 'var: escaped the if-block';
    const contained = 'const: stayed in the if-block';
    console.log(contained);
  }

  console.log(leaked);
  // console.log(contained); // ReferenceError
}

varLeaks();

/**
 * The same rules are what make closures work.
 *
 * An inner function keeps looking outward even after the outer call has finished, so
 * the outer box survives as long as something still points into it. That is the whole
 * mechanism behind 01-scope-and-closures.js.
 */
function makeCounter() {
  let count = 0; // outer box

  return function increment() {
    count++; // still looking outward, long after makeCounter returned
    return count;
  };
}

const next = makeCounter();
console.log(next(), next(), next()); // 1 2 3
```

## 01.4 Arrow functions

<Badge type="info" text="todo" />
`stage-1-core-javascript/01.4-arrow-functions.js`

shorter syntax, and no `this` of their own.

An arrow doesn't bind its own `this`, `arguments`, or `super`. It closes over whatever `this` was where it was written, which makes it a scope topic as much as a syntax one.

Angular tie-in: this is why `setTimeout(() => this.tick(), 1000)` works in a component while `setTimeout(this.tick, 1000)` loses `this` and throws.

## 01.5 Closures

<Badge type="info" text="todo" />
`stage-1-core-javascript/01.5-closures.js`

a function that outlives the scope it was written in, and keeps it alive.

When a function is created it holds a live link to the variables around it. If the function escapes (returned, stored, passed as a callback), those variables escape with it instead of being cleaned up. The link is to the variable itself, not to a copy of its value.

Angular tie-in: this is what a `providedIn: 'root'` service is. One instance holds its private state, and every method you call on it is a closure over that state, for as long as the app is running. It's also the leak: a subscription callback closes over the whole component, so failing to unsubscribe keeps the component alive after it's destroyed.
