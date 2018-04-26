# sudoku

Generate a sudoku matrix.

# Install
```
npm install sudoku-matrix
```

## Usage

```javascript
const {matrix, blink} = require('sudoku-matrix');

// Get complete matrix.
matrix();

/**
 * Get part of matrix, replace with 0, default by 16.
 * @lack number The number of vacancies in the matrix.
 */
blink(lack);
```
