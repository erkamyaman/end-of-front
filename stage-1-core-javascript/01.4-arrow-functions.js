/**
 * Arrow functions: shorter syntax, and no `this` of their own.
 *
 * An arrow doesn't bind its own `this`, `arguments`, or `super`. It closes over
 * whatever `this` was where it was written, which makes it a scope topic as much as
 * a syntax one.
 *
 * Angular tie-in: this is why `setTimeout(() => this.tick(), 1000)` works in a
 * component while `setTimeout(this.tick, 1000)` loses `this` and throws.
 */
