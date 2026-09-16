let operation = "";

// ---------------- MATRIX A ----------------

function createMatrixA() {

    const rows = Number(document.getElementById("rowsA").value);
    const cols = Number(document.getElementById("colsA").value);

    const container = document.getElementById("matrixA");

    container.innerHTML = "";

    const matrix = document.createElement("div");

    matrix.className = "matrix";

    matrix.style.gridTemplateColumns =
        `repeat(${cols}, 60px)`;

    for (let i = 0; i < rows * cols; i++) {

        const input = document.createElement("input");

        input.type = "number";
        input.value = "0";

        input.className = "a";

        matrix.appendChild(input);
    }

    container.appendChild(matrix);
}


// ---------------- GET MATRIX A ----------------

function getMatrixA() {

    const rows = Number(document.getElementById("rowsA").value);
    const cols = Number(document.getElementById("colsA").value);

    const inputs = document.querySelectorAll(".a");

    let matrix = [];

    let k = 0;

    for (let i = 0; i < rows; i++) {

        let row = [];

        for (let j = 0; j < cols; j++) {

            row.push(Number(inputs[k].value));

            k++;
        }

        matrix.push(row);
    }

    return matrix;
}


// ---------------- MATRIX B ----------------

function createMatrixB(rows, cols) {

    const container = document.getElementById("matrixB");

    container.innerHTML = "";

    const matrix = document.createElement("div");

    matrix.className = "matrix";

    matrix.style.gridTemplateColumns =
        `repeat(${cols}, 60px)`;

    for (let i = 0; i < rows * cols; i++) {

        const input = document.createElement("input");

        input.type = "number";
        input.value = "0";

        input.className = "b";

        matrix.appendChild(input);
    }

    container.appendChild(matrix);

    document.getElementById("matrixBSection").style.display = "block";
}


function getMatrixB(rows, cols) {

    const inputs = document.querySelectorAll(".b");

    let matrix = [];

    let k = 0;

    for (let i = 0; i < rows; i++) {

        let row = [];

        for (let j = 0; j < cols; j++) {

            row.push(Number(inputs[k].value));

            k++;
        }

        matrix.push(row);
    }

    return matrix;
}


// ---------------- DISPLAY ----------------

function displayMatrix(matrix) {

    let html = `<div class="result-matrix" 
                style="grid-template-columns: repeat(${matrix[0].length}, auto)">`;

    for (let row of matrix) {

        for (let value of row) {

            html += `<span>${Number(value.toFixed(6))}</span>`;
        }
    }

    html += "</div>";

    document.getElementById("result").innerHTML = html;
}


// ---------------- DETERMINANT ----------------

function determinantOfMatrix(matrix) {

    const n = matrix.length;

    if (n === 1)
        return matrix[0][0];

    if (n === 2)
        return matrix[0][0] * matrix[1][1]
             - matrix[0][1] * matrix[1][0];

    let det = 0;

    for (let j = 0; j < n; j++) {

        let minor = matrix
            .slice(1)
            .map(row =>
                row.filter((_, index) => index !== j)
            );

        det +=
            matrix[0][j] *
            Math.pow(-1, j) *
            determinantOfMatrix(minor);
    }

    return det;
}


function determinant() {

    const A = getMatrixA();

    if (A.length !== A[0].length) {

        document.getElementById("result").innerHTML =
            `<span class="error">
            Determinant is possible only for a square matrix.
            </span>`;

        return;
    }

    const det = determinantOfMatrix(A);

    document.getElementById("result").innerHTML =
        `<h3>det(A) = ${Number(det.toFixed(6))}</h3>`;
}


// ---------------- INVERSE ----------------

function inverse() {

    const A = getMatrixA();

    const n = A.length;

    if (n !== A[0].length) {

        document.getElementById("result").innerHTML =
            `<span class="error">
            Inverse exists only for a square matrix.
            </span>`;

        return;
    }

    const det = determinantOfMatrix(A);

    if (Math.abs(det) < 1e-10) {

        document.getElementById("result").innerHTML =
            `<span class="error">
            det(A) = 0<br><br>
            Therefore, matrix A is <b>singular</b>.<br>
            Inverse does NOT exist.
            </span>`;

        return;
    }

    let aug = A.map((row, i) => [

        ...row,

        ...Array.from(
            { length: n },
            (_, j) => i === j ? 1 : 0
        )

    ]);

    for (let i = 0; i < n; i++) {

        let pivot = i;

        for (let j = i + 1; j < n; j++) {

            if (Math.abs(aug[j][i]) >
                Math.abs(aug[pivot][i])) {

                pivot = j;
            }
        }

        [aug[i], aug[pivot]] =
            [aug[pivot], aug[i]];

        const divisor = aug[i][i];

        for (let j = 0; j < 2 * n; j++) {

            aug[i][j] /= divisor;
        }

        for (let k = 0; k < n; k++) {

            if (k === i) continue;

            const factor = aug[k][i];

            for (let j = 0; j < 2 * n; j++) {

                aug[k][j] -=
                    factor * aug[i][j];
            }
        }
    }

    const result = aug.map(row =>
        row.slice(n)
    );

    document.getElementById("result").innerHTML =
        `<span class="success">
        det(A) ≠ 0 → Inverse exists.
        </span>`;

    displayMatrix(result);
}


// ---------------- TRANSPOSE ----------------

function transpose() {

    const A = getMatrixA();

    const result =
        A[0].map((_, col) =>
            A.map(row => row[col])
        );

    displayMatrix(result);
}


// ---------------- SQUARE ----------------

function squareMatrix() {

    const A = getMatrixA();

    if (A.length !== A[0].length) {

        document.getElementById("result").innerHTML =
            `<span class="error">
            A² is possible only for a square matrix.
            </span>`;

        return;
    }

    const result = multiplyMatrices(A, A);

    displayMatrix(result);
}


// ---------------- ADDITION ----------------

function prepareAddition() {

    const A = getMatrixA();

    createMatrixB(A.length, A[0].length);

    operation = "addition";

    document.getElementById("result").innerHTML =
        "Enter Matrix B and click Addition again.";
}


// ---------------- SUBTRACTION ----------------

function prepareSubtraction() {

    const A = getMatrixA();

    createMatrixB(A.length, A[0].length);

    operation = "subtraction";

    document.getElementById("result").innerHTML =
        "Enter Matrix B and click Subtraction again.";
}


// ---------------- MULTIPLICATION ----------------

function prepareMultiplication() {

    const A = getMatrixA();

    const rowsB = A[0].length;

    const colsB = 2;

    createMatrixB(rowsB, colsB);

    operation = "multiplication";

    document.getElementById("result").innerHTML =
        `Matrix B has ${rowsB} rows. Enter values and click Multiplication again.`;
}


// ---------------- MULTIPLY ----------------

function multiplyMatrices(A, B) {

    const rowsA = A.length;

    const colsA = A[0].length;

    const rowsB = B.length;

    const colsB = B[0].length;

    if (colsA !== rowsB) {

        throw new Error(
            "Columns of Matrix A must equal rows of Matrix B."
        );
    }

    let result =
        Array.from(
            { length: rowsA },
            () => Array(colsB).fill(0)
        );

    for (let i = 0; i < rowsA; i++) {

        for (let j = 0; j < colsB; j++) {

            for (let k = 0; k < colsA; k++) {

                result[i][j] +=
                    A[i][k] * B[k][j];
            }
        }
    }

    return result;
}


// ---------------- HANDLE SECOND CLICK ----------------

document.addEventListener("click", function(event) {

    if (!event.target.matches("button")) return;

    const text =
        event.target.innerText.toLowerCase();

    if (
        operation === "addition" &&
        text.includes("addition")
    ) {

        const A = getMatrixA();

        const B =
            getMatrixB(A.length, A[0].length);

        const result =
            A.map((row, i) =>
                row.map((value, j) =>
                    value + B[i][j]
                )
            );

        displayMatrix(result);

        operation = "";
    }


    if (
        operation === "subtraction" &&
        text.includes("subtraction")
    ) {

        const A = getMatrixA();

        const B =
            getMatrixB(A.length, A[0].length);

        const result =
            A.map((row, i) =>
                row.map((value, j) =>
                    value - B[i][j]
                )
            );

        displayMatrix(result);

        operation = "";
    }


    if (
        operation === "multiplication" &&
        text.includes("multiplication")
    ) {

        const A = getMatrixA();

        const B =
            getMatrixB(A[0].length, 2);

        try {

            const result =
                multiplyMatrices(A, B);

            displayMatrix(result);

        } catch (error) {

            document.getElementById("result").innerHTML =
                `<span class="error">
                ${error.message}
                </span>`;
        }

        operation = "";
    }

});


// CREATE DEFAULT MATRIX

createMatrixA();