# Server Code Documentation Standard

When writing code in Python, developers should adhere to these documentation standards.

## General

Rather than over-documenting their code, developers should prioritise writing clear and well-structured code that is easy to understand. For example: 

- Functions and variables should have descriptive names so it is easy to understand their purposes. 
- There should be consistency with indentation and spacing between blocks of code to ensure high readability. 
- Simple and straightforward logic should be prioritised, rather than using overly complicated solutions.

However, code that is not self-explanatory or trivial should be documented by the developer of the code, in order for other developers to be able to understand and maintain the code.

## File Header

At the top of a file, above any imports, provide a concise description of the file's purpose.

### Example File Header:

```python
"""
This file provides utility functions for basic arithmetic operations, including addition,
subtraction, multiplication, and division. The functions are designed to support both
integer and floating-point values and return the corresponding results.
"""
```

## Function Documentation

For non-trivial functions, below the `def` line, provide a description of the function's purpose, parameters, returns and any important details.

### Example Function Description:

```python
def add(a: int, b: int) -> int:
    """
    Function that computes the sum of two integers.

    Parameters:
        a (int): The first integer.
        b (int): The second integer.

    Returns:
        int: The sum of a and b.
    """
    return a + b
```

## Route Documentation

For non-trivial routes, below the `def` line, provide a description of the route's purpose and any important details. If parameters are passed in the URL, an example request should be provided. If data is sent in the request body, an example request body should be provided. This is important in order for other developers to know how they should make a request to the route's URL.

### Example Route Description:

```python
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Route for updating the information of an existing user.

    URL Parameters:
        user_id (int): The unique identifier of the user to be updated.

    Example Request:
        PUT /users/123

    Example Request Body:
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "age": 31
        }
    """
```

## Comments

When necessary, use comments to explain non-obvious logic. For example, to describe the purpose of an if-statement or to clarify the role of a variable if it is not obvious from its name. Use `#` for brief single-line comments and `""" ... """` for longer multi-line comments.

**NOTE:** Comments should only be used when they add value. Commenting obvious code is redundant and can reduce code readability. Additionally, when updating code, comments must also be updated. Too many comments increase the risk of leaving outdated or misleading comments in the code.
