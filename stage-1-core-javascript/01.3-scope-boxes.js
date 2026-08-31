/**
 * Scope, the simple version — every { } is a box.
 *
 * "block scoped" answers one question only: which box does this declaration live in?
 * The nearest { } around it. It says nothing about how far inward the name reaches.
 * Two rules cover everything:
 *
 *   1. Looking outward works.     Code inside a box sees every box around it.
 *   2. Looking inward does not.   Code outside a box cannot see what is inside it.
 *
 * That is why the same `const` can look global, function scoped, or tightly scoped:
 * nothing changed but the size of the box you declared it in.
 *
 * See 01.1-var-let-const.js for the reassignment and temporal-dead-zone differences.
 *
 * Angular tie-in: a value declared in ngOnInit dies with it, a class field lives as
 * long as the component, and a value in a service lives as long as the injector —
 * same rule, three box sizes.
 */

const fileBox = 'declared at the top level of the file';

function boxes() {
  const functionBox = 'declared at the top of the function body';

  if (true) {
    const ifBox = 'declared inside the if-block';

    console.log(fileBox);
    console.log(functionBox);
    console.log(ifBox);
  }

  // console.log(ifBox); // ReferenceError — looking inward is blocked
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
