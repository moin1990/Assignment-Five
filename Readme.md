Question 1.  What is the difference between var, let, and const?

Answer:

The main difference between var, let, and const is their scope, redeclaration, and reassignment behavior. var is function-scoped, can be redeclared and reassigned, and it is hoisted with undefined. let is block-scoped, cannot be redeclared in the same scope, but it can be reassigned. const is also block-scoped, but it cannot be redeclared or reassigned, and it must be initialized when declared.
In modern JavaScript, developers usually prefer const by default, and let when a variable needs to change, while var is mostly avoided.

Question 2.  What is the spread operator (...)?

Answer:

The spread operator (...) in JavaScript is used to expand elements of arrays, objects, or iterables into individual values. It is commonly used for copying arrays or objects, merging them, and passing array elements as function arguments.

Question 3.What is the difference between map(), filter(), and forEach()?

Answer:

map(), filter(), and forEach() are array iteration methods in JavaScript. map() transforms each element and returns a new array of the same length. filter() returns a new array containing elements that match a condition. forEach() simply loops through the array and performs an action, but does not return a new array.

Question 4. What is an arrow function?

Answer:

An arrow function is a shorter way to write functions in JavaScript using the => syntax. It was introduced in ES6 and provides a more concise syntax. Arrow functions also do not have their own this; instead, they inherit this from the surrounding scope.

Question 5. What are template literals?

Answer:

Template literals in JavaScript are strings defined using backticks (`). They allow string interpolation using ${}, multi-line strings, and embedded expressions, making string creation easier and more readable.