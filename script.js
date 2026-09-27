function inverse(matrix) {
    const n = matrix.length;

    // Check square matrix
    if (!matrix.every(row => row.length === n)) {
        return null;
    }

    // Create augmented matrix [A | I]
    let aug = matrix.map((row, i) => [
        ...row.map(Number),
        ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
    ]);

    // Gauss-Jordan elimination
    for (let col = 0; col < n; col++) {

        // Find pivot
        let pivotRow = col;

        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[pivotRow][col])) {
                pivotRow = row;
            }
        }

        // No inverse
        if (Math.abs(aug[pivotRow][col]) < 1e-10) {
            return null;
        }

        // Swap rows
        [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];

        // Make pivot = 1
        const pivot = aug[col][col];

        for (let j = 0; j < 2 * n; j++) {
            aug[col][j] /= pivot;
        }

        // Make other elements in column = 0
        for (let row = 0; row < n; row++) {
            if (row === col) continue;

            const factor = aug[row][col];

            for (let j = 0; j < 2 * n; j++) {
                aug[row][j] -= factor * aug[col][j];
            }
        }
    }

    // Extract inverse
    let result = aug.map(row => row.slice(n));

    // Remove tiny floating-point errors
    result = result.map(row =>
        row.map(value => Math.abs(value) < 1e-10 ? 0 : value)
    );

    return result;
}
