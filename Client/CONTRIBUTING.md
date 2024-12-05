# Client Code Documentation Standard

When writing code in JavaScript, developers should adhere to these documentation standards.

## General

Rather than over-documenting their code, developers should prioritise writing clear and well-structured code that is easy to understand. For example: 

- Functions and variables should have descriptive names so it is easy to understand their purposes. 
- There should be consistency with indentation and spacing between blocks of code to ensure high readability. 
- Simple and straightforward logic should be prioritised, rather than using overly complicated solutions.

However, code that is not self-explanatory or trivial should be documented by the developer of the code, in order for other developers to be able to understand and maintain the code.

## File Header

At the top of a file, above any imports, provide a concise description of the file's purpose.

### Example File Header:

```javascript
/**
 * This file provides utility functions for basic arithmetic operations, including addition,
 * subtraction, multiplication, and division. The functions are designed to support both
 * integer and floating-point values and return the corresponding results.
 */
```

## Function Documentation

Above non-trivial functions, provide a description of the function's purpose, parameters, returns and any important details.

### Example Function Description:

```javascript
/**
 * Function that computes the sum of two integers.
 *
 * Parameters:
 *   a (number): The first integer.
 *   b (number): The second integer.
 *
 * Returns:
 *   number: The sum of a and b.
 */
function add(a, b) {
  return a + b;
}
```

## Comments

When necessary, use comments to explain non-obvious logic. For example, to describe the purpose of an if-statement or to clarify the role of a variable if it is not obvious from its name. Use `//` for brief single-line comments and `/** ... */` for longer multi-line comments.

**NOTE:** Comments should only be used when they add value. Commenting obvious code is redundant and can reduce code readability. Additionally, when updating code, comments must also be updated. Too many comments increase the risk of leaving outdated or misleading comments in the code.
