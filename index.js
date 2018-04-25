// Get random 1-9
function getRowNumbers() {
    let temp = new Set();
    while (temp.size < 9) {
        let i = Math.floor(Math.random() * 10);
        if (i !== 0) {
            temp.add(i);
        }
    }
    return temp;
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
        let temp = [1,2,3,4,5,6,7,8,9];
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

module.exports = getFull;
