'use strict';

var DEFAULT_LACK = 16;

// Get random 1-9
function getRowNumbers() {
    var seq = [];
    var temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    while (temp.length > 1) {
        var random = Math.ceil(Math.random() * temp.length) - 1;
        seq.push(temp[random]);
        temp.splice(random, 1);
    }
    seq.push(temp[0]);
    return seq;
}

// Check new line valid
function checkLine(line, matrix, row) {
    var tag = true;
    return row.every(function(v, i) {
        // check column
        for (var p = line - 1; p >= 0; p--) {
            if (matrix[p][i] === v) {
                tag = false;
                return false;
            }
        }

        // check block
        var xOffset = i % 3;
        var yOffset = line % 3;
        for (var x = i - xOffset; x < i - xOffset + 3; x++) {
            for (var y = line - yOffset; y < line; y++) {
                if (matrix[y][x] === v) {
                    return false;
                }
            }
        }
        return true;
    });
}

// Get last Row from above lines
function getLastLine(matrix) {
    var column = 0;
    var row = [];

    while (column < 9) {
        var temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        matrix.forEach(function(v, i) {
            var index = temp.indexOf(v[column]);
            temp.splice(index, 1);
        });
        column++;
        row.push(temp[0]);
    }
    return row;
}

function getFull() {
    var matrix = [];

    // line 1 to line 8
    for (var i = 0, len = 8; i < len; i++) {
        var row = getRowNumbers();
        if (i !== 0) {
            var randomCount = 1;
            while (!checkLine(i, matrix, row)) {
                row = getRowNumbers();
                randomCount++;

                if (randomCount > 70000) {
                    return getFull();
                }
            }
            matrix.push(row);
        } else {
            matrix.push(row);
        }
    }

    // fill line 9
    var lastRow = getLastLine(matrix);
    if (!checkLine(8, matrix, lastRow)) {
        return getFull();
    } else {
        matrix.push(lastRow);
    }
    return matrix;
}

function blink(lack) {
    var matrix = getFull();

    lack = lack && /^\d+$/.test(lack) ? (lack > 64 ? DEFAULT_LACK : Math.abs(lack)) : DEFAULT_LACK;

    while (lack--) {
        var index = Math.ceil(Math.random() * 81) - 1;
        var row = Math.floor(index / 9);
        var column = index % 9;
        while (matrix[row][column] === 0) {
            index = Math.ceil(Math.random() * 81) - 1;
            row = Math.floor(index / 9);
            column = index % 9;
        }
        matrix[row][column] = 0;
    }

    return matrix;
}

function isRepeat(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Check sudoku result.
 * @param {Array[]} matrix
 * @returns Boolean | Object
 */
function checkMatrix(matrix) {
    var i, j, len;

    // Check row
    for (i = 0, len = matrix.length; i < len; i++) {
        if (matrix[i].indexOf(0) !== -1) {
            return false;
        } else if (isRepeat(matrix[i])) {
            return {
                row: i
            };
        }
    }

    // Check column
    var s;
    var count = 9;
    while (count--) {
        s = [];
        for (i = 0; i < 9; i++) {
            if (!/^[1-9]$/.test(matrix[i][count])) {
                return false;
            } else if (s.indexOf(matrix[i][count]) !== -1) {
                return {
                    column: count
                };
            }
            s.push(matrix[i][count]);
        }
    }

    // Check block
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var m = x * 3;
            var n = y * 3;
            var block = [
                matrix[m][n], matrix[m][n+1], matrix[m][n+2],
                matrix[m+1][n], matrix[m+1][n+1], matrix[m+1][n+2],
                matrix[m+2][n], matrix[m+2][n+1], matrix[m+2][n+2]
            ];

            if (block.indexOf(0) !== -1) {
                return false;
            } else if (isRepeat(block)) {
                return {
                    block: [x, y]
                };
            }
        }
    }

    return true;
}

module.exports = {
    matrix: getFull,
    blink: blink,
    checkMatrix: checkMatrix
};
