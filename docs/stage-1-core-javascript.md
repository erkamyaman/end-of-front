# Stage 1: Core JavaScript (the stuff Angular hides from you)

## Scope & closures: why a function "remembers" variables after it returns.

<Badge type="tip" text="done" />

`01-scope-and-closures.js`

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

## var / let / const: three ways to declare, three different scoping rules. var is function-scoped and hoisted as undefined; let and const are block-scoped and unusable before their declaration line.

<Badge type="tip" text="done" />

`01.1-var-let-const.js`

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

## Class fields vs variables: `this.x` is a property on an object, not a variable.

<Badge type="tip" text="done" />

`01.2-class-fields-vs-variables.js`

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

## Scope, the simple version: every { } is a box.

<Badge type="tip" text="done" />

`01.3-scope-boxes.js`

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

## this binding: regular functions vs arrow functions.

<Badge type="info" text="todo" />

`02-this-binding.js`

Angular tie-in: why arrow functions are the default in component callbacks and template event bindings.

## Prototypes & prototypal inheritance: how JS objects actually share behaviour.

<Badge type="info" text="todo" />

`03-prototypes-and-prototypal-inheritance.js`

Angular tie-in: what extends on a base component class is really doing underneath.

## The event loop, call stack, microtasks vs macrotasks: the concept that makes async click.

<Badge type="info" text="todo" />

`04-event-loop-call-stack-microtasks.js`

Angular tie-in: why change detection sometimes runs "late" relative to when you expect. Zone.js patches into this exact mechanism.

## Hoisting & variable declarations: var/let/const, temporal dead zone.

<Badge type="info" text="todo" />

`05-hoisting-and-variable-declarations.js`

Angular tie-in: why class fields must be declared before they're used in a constructor, and TDZ bugs in component initialization order.

## Type coercion vs casting: implicit vs explicit, equality algorithms (== vs === vs Object.is).

<Badge type="info" text="todo" />

`06-type-coercion-vs-casting.js`

Angular tie-in: truthy/falsy coercion inside *ngIf, why *ngIf="0" and *ngIf="''" both hide the element.

## Variable naming rules & scope levels: block/function/global scope.

<Badge type="info" text="todo" />

`07-variable-naming-and-scope-levels.js`

Angular tie-in: component instance scope (this.x) vs template-local scope (let item of items, #templateRef).

## typeof operator & built-in objects: what typeof returns for each type.

<Badge type="info" text="todo" />

`08-typeof-and-built-in-objects.js`

Angular tie-in: defensive typeof checks in services before touching an API response shape you don't fully trust.

## JSON & structured data: JSON.stringify/parse, what survives serialization.

<Badge type="info" text="todo" />

`09-json-and-structured-data.js`

Angular tie-in: HttpClient auto-parses JSON for you. Know what breaks that (non-JSON responses, responseType mismatches), and manual JSON handling for localStorage.

## Control flow: if/else, switch, try/catch/finally, throw, Error objects.

<Badge type="info" text="todo" />

`10-control-flow.js`

Angular tie-in: *ngIf/*ngSwitch are template-level mirrors of this, and HttpErrorResponse handling in services is just try/catch with extra shape.

## Loops & iteration: for, while, do...while, for...of, for...in, break/continue.

<Badge type="info" text="todo" />

`11-loops-and-iteration.js`

Angular tie-in: *ngFor/@for is sugar over for...of. Understanding the real loop explains why trackBy matters for performance.

## Operators: arithmetic, comparison, logical, bitwise, assignment, unary, comma, ternary, BigInt.

<Badge type="info" text="todo" />

`12-operators.js`

Angular tie-in: Angular templates only allow a restricted operator subset (no bitwise, no comma, no assignment). Knowing the full JS operator set shows you exactly what template expressions are missing and why.

## Function parameter patterns: default params, rest params, arguments object, IIFEs.

<Badge type="info" text="todo" />

`13-function-parameter-patterns.js`

Angular tie-in: default values on service method params, and why @Input() properties often need explicit defaults since Angular won't infer them for you.

## Explicit binding & function borrowing: call/apply/bind.

<Badge type="info" text="todo" />

`14-explicit-binding-and-function-borrowing.js`

Angular tie-in: the classic bug of passing this.someMethod as a callback and losing this. The actual mechanism behind why arrow functions or .bind(this) fix it.

## Primitive data types: string/number/boolean/null/undefined/bigint/Symbol as a category, and primitive-vs-reference semantics.

<Badge type="info" text="todo" />

`15-primitive-data-types.js`

Angular tie-in: why OnPush change detection compares primitives by value but objects/arrays by reference. This is the exact concept underneath that gotcha.

## Recursion: a function calling itself, base case + recursive case.

<Badge type="info" text="todo" />

`16-recursion.js`

Angular tie-in: rendering recursive structures like nested menus or a breadcrumb trail often needs a recursive component pattern, not just a flat *ngFor.
