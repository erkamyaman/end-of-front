# 01 Classes

<Badge type="tip" text="written" />
`stage-2.7-modern-js-structures/01-classes.js`

fields, private #members, extends/super.

Angular tie-in: every Angular component and service you write is a class. This is the syntax layer directly under decorators like @Component.

```js
/**
 * Everything a class body can hold. Write your own version before reading this one.
 */
class Example {
  field = 1; // instance field: copied onto every instance
  #secret = 'hidden'; // private field: real runtime privacy, not a convention
  static version = '1.0'; // static field: on the class itself, not on instances

  static registry = new Map();

  static {
    // static block: runs once, when the class is defined
    Example.registry.set('example', Example);
  }

  constructor(x) {
    this.x = x; // properties can also be created here
  }

  method() {
    // prototype method: one copy, shared by all instances
    return this.#privateMethod();
  }

  #privateMethod() {
    // private method
    return this.#secret;
  }

  static create(x) {
    // static method: Example.create(), not instance.create()
    return new Example(x);
  }

  get total() {
    // getter: reads like a property
    return this.field * 2;
  }

  set total(v) {
    // setter
    this.field = v / 2;
  }

  ['computed' + 'Name']() {
    // computed member name
    return 'rarely useful, but legal';
  }
}

const ex = Example.create(42);

console.log(ex.x); // 42
console.log(ex.method()); // 'hidden', reachable from inside
console.log(ex.total); // 2, getter, no parentheses
ex.total = 10;
console.log(ex.field); // 5, setter ran
console.log(Example.version); // '1.0', on the class
console.log(ex.version); // undefined, NOT on the instance
console.log(Object.keys(ex)); // ['field', 'x']. No methods, no #secret, no statics

/**
 * extends / super: see 03-prototypes-and-prototypal-inheritance.js in Stage 1 for
 * what this is doing underneath. `super()` must be called before you touch `this`,
 * because the parent constructor is what creates the object you are about to use.
 */
class Base {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return `Base(${this.name})`;
  }
}

class Derived extends Base {
  constructor(name, extra) {
    super(name); // must come first
    this.extra = extra;
  }

  describe() {
    return `Derived(${super.describe()}, ${this.extra})`;
  }
}

console.log(new Derived('a', 'b').describe()); // Derived(Base(a), b)

/**
 * The three that actually show up in Angular:
 *
 * 1. Getters, templates can't call anything with arguments, so computed values
 *    become getters:
 *
 *      get isValid() { return this.form.valid && !this.isLoading; }
 *      <button [disabled]="!isValid">
 *
 *    A getter re-runs on every change detection cycle. Keep it cheap: no HTTP,
 *    no rebuilding arrays. This is exactly what signals/computed() fix.
 *
 * 2. Private. Angular code usually uses TypeScript's `private`, which is
 *    compile-time only and vanishes in the emitted JS. `#name` is real JavaScript
 *    privacy, genuinely unreachable from outside. Same intent, different mechanism.
 *
 * 3. static, rare in components, since Angular hands you instances. You'll mostly
 *    meet it in compiled output (static ɵcmp) or the odd factory helper.
 *
 * Safe to ignore for now: static blocks and computed member names. Real, but you
 * can go years without needing either.
 */
```
