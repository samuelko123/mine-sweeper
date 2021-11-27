const arr2D = require('../lib/arr2D');

// Create a randomised board with start cell being zero (or non-bomb if insufficient space)
exports.createBoard = (height, width, bomb_count, start_row, start_col, bomb_val) => {

    // Validation: At least 1 non-bomb cell
    if (bomb_count >= height * width)
        return null;

    // Create board with random bombs
    let arr = arr2D.create(height, width, 0);
    arr2D.populate(arr, bomb_val, bomb_count);
    arr2D.shuffle(arr);

    // Get the no. of adj. cells for starting cell (inc. itself)
    let start_adj_count = 0;
    arr2D.callFnOnAdj(arr, start_row, start_col, () => {
        start_adj_count++;
    })

    if (start_adj_count > width * height - bomb_count) {
        // Not enough space for first cell to be 0
        // Goal: Start cell should be non bomb
        getRidOfBomb(arr, start_row, start_col, bomb_val);
    }
    else {
        // Goal: First cell should be zero
        do {
            arr2D.callFnOnAdj(arr, start_row, start_col, (i, j) => {
                getRidOfBomb(arr, i, j, bomb_val);
            });
        } while (arr2D.getAdjCount(arr, start_row, start_col, bomb_val) !== 0);
    }

    arr2D.fillAdjCount(arr, bomb_val);

    return arr;
}

// Swap value with a random non-bomb cell
function getRidOfBomb(arr, i, j, bomb_val) {
    let rows = arr.length;
    let cols = arr[0].length;

    if (arr[i][j] === bomb_val) {
        let x, y;
        do {
            x = Math.floor(Math.random() * rows);
            y = Math.floor(Math.random() * cols);
        } while (arr[x][y] === bomb_val)

        let temp = arr[x][y];
        arr[x][y] = arr[i][j];
        arr[i][j] = temp;
    }
}

// Open adjacent tiles that are zero, recursive
exports.OpenNonBombAdj = (arr_val, arr_state, row, col, bomb_val, flagged_state, clicked_state) => {
    let rows = arr_val.length;
    let cols = arr_val[0].length;
    let temp = [{ row: row, col: col }];

    while (temp.length !== 0) {
        let x = temp.pop();

        arr_state[x.row][x.col] = clicked_state;
        if (arr_val[x.row][x.col] === 0) {
            let row_min = Math.max(x.row - 1, 0);
            let row_max = Math.min(x.row + 1, rows - 1);
            let col_min = Math.max(x.col - 1, 0);
            let col_max = Math.min(x.col + 1, cols - 1);

            for (let i = row_min; i <= row_max; i++) {
                for (let j = col_min; j <= col_max; j++) {
                    if (
                        (i !== x.row || j !== x.col)
                        && arr_state[i][j] !== clicked_state
                        && arr_state[i][j] !== flagged_state
                        && arr_val[i][j] !== bomb_val
                    ) {
                        temp.push({ row: i, col: j });
                    }
                }
            }
        }
    }

    return arr_state;
}