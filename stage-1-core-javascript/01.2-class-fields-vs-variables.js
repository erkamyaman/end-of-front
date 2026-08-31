/**
 * Class fields vs variables — `this.x` is a property on an object, not a variable.
 *
 * var/let/const create a binding in a scope. A class field creates a property on the
 * instance. They are different mechanisms with different lifetimes, and that is why
 * one is reached by name and the other only through `this`.
 *
 * Angular tie-in: every `this.count`, `this.http`, `this.form` in a component is a
 * property lookup on the instance — which is why losing `this` in a callback breaks
 * it, and why arrow functions became the default in component code.
 */

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

console.log(a.count, b.count); // 2 1 — separate objects, separate properties
console.log(a.increment().local); // 1 every time — the local dies each call

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
 * Losing `this` — the setup for 02-this-binding.js.
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
