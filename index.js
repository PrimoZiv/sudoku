const DEFAULT_LACK = 16;

// Get random 1-9
function getRowNumbers() {
    let seq = [];
    let temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    while (temp.length > 1) {
        let random = Math.ceil(Math.random() * temp.length) - 1;
        seq.push(temp[random]);
        temp.splice(random, 1);
    }
    seq.push(temp[0]);
    return seq;
}

// Check new line valid
function checkLine(line, matrix, row) {
    let tag = true;
    return row.every((v, i) => {
        // check column
        for (let p = line - 1; p >= 0; p--) {
            if (matrix[p][i] === v) {
                tag = false;
                return false;
            }
        }

        // check block
        let xOffset = i % 3;
        let yOffset = line % 3;
        for (let x = i - xOffset; x < i - xOffset + 3; x++) {
            for (let y = line - yOffset; y < line; y++) {
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
    let column = 0;
    let row = [];

    while (column < 9) {
        let temp = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        matrix.forEach((v, i) => {
            let index = temp.findIndex((t) => {
                return t === v[column];
            });
            temp.splice(index, 1);
        });
        column++;
        row.push(temp[0]);
    }
    return row;
}

function getFull() {
    let matrix = [];

    // line 1 to line 8
    for (let i = 0, len = 8; i < len; i++) {
        let row = getRowNumbers();
        if (i !== 0) {
            let randomCount = 1;
            while (!checkLine(i, matrix, [...row])) {
                row = getRowNumbers();
                randomCount++;

                if (randomCount > 70000) {
                    return getFull();
                }
            }
            matrix.push([...row]);
        } else {
            matrix.push([...row]);
        }
    }

    // fill line 9
    let lastRow = getLastLine(matrix);
    if (!checkLine(8, matrix, lastRow)) {
        return getFull();
    } else {
        matrix.push(lastRow);
    }
    return matrix;
}

function blink(lack) {
    let matrix = getFull();

    lack = lack && Number.isInteger(lack) ? (lack > 64 ? DEFAULT_LACK : Math.abs(lack)) : DEFAULT_LACK;

    while (lack--) {
        let index = Math.ceil(Math.random() * 81) - 1;
        let row = Math.floor(index / 9);
        let column = index % 9;
        while (matrix[row][column] === 0) {
            index = Math.ceil(Math.random() * 81) - 1;
            row = Math.floor(index / 9);
            column = index % 9;
        }
        matrix[row][column] = 0;
    }

    return matrix;
}

module.exports = {
    matrix: getFull,
    blink: blink
};