/**
 * Scope & closures — why a function "remembers" variables after it returns.
 *
 * Angular tie-in: why services/singletons keep state across your whole app.
 */

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
