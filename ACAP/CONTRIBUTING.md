# ACAP Code Documentation Standard

When writing code in C, developers should adhere to these documentation standards.

## File Header

At the top of a file, above any #include statements, provide a concise description of the application's purpose.

### Example File Header:

```c
/**
 * Application for performing data processing tasks. This application processes incoming data streams,
 * applies transformation rules, and outputs the results to the designated output location.
 */
```

## Function Documentation

Above each function, provide a description of its purpose, parameters, returns and any important details.

### Example Function Description:

```c
/**
 * Function that computes the sum of two integers.
 *
 * Parameters:
 *   a (int): The first integer.
 *   b (int): The second integer.
 *
 * Returns:
 *   int: The sum of a and b.
 */
int add(int a, int b) {
    return a + b;
}
```

## Comments

When necessary, use comments to explain non-obvious logic. For example, to describe the purpose of an if-statement or to clarify the role of a variable if it is not obvious from its name. Use `//` for brief single-line comments and `/** ... */` for longer multi-line comments.

**NOTE:** Comments should only be used when they add value. Commenting obvious code is redundant and can reduce code readability. Additionally, when updating code, comments must also be updated. Too many comments increase the risk of leaving outdated or misleading comments in the code.
