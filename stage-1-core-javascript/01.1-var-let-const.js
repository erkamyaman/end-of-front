/**
 * var / let / const: three ways to declare, three different scoping rules.
 * var is function-scoped and hoisted as undefined; let and const are block-scoped
 * and unusable before their declaration line.
 *
 * Angular tie-in: const by default in components and services, let only when the
 * value genuinely changes. The same discipline TypeScript's readonly and Angular's
 * OnPush both lean on: fewer things that can change means fewer things to re-check.
 */

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
