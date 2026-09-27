/* ==========================================
   MATRIX SOLVER - FINAL FIXED JAVASCRIPT
========================================== */

let currentOperation = null;


/* ==========================================
   STARTUP
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    createMatrixA();

    document.getElementById("rowsA").addEventListener("change", createMatrixA);
    document.getElementById("colsA").addEventListener("change", createMatrixA);
});


/* ==========================================
   CREATE MATRIX A
========================================== */

function createMatrixA() {

    const rows = parseInt(document.getElementById("rowsA").value);
    const cols = parseInt(document.getElementById("colsA").value);

    createMatrixInputs("matrixA", rows, cols, "A");
}


/* ==========================================
   CREATE MATRIX B
========================================== */

function createMatrixB() {

    const rows = parseInt(document.getElementById("rowsB").value);
    const cols = parseInt(document.getElementById("colsB").value);

    createMatrixInputs("matrixB", rows, cols, "B");
}


/* ==========================================
   CREATE INPUT BOXES
========================================== */

function createMatrixInputs(containerId, rows, cols, matrixName) {

    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < rows; i++) {

        const row = document.createElement("div");

        row.className = "matrix-row";

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "text";
            input.className = "matrix-input";

            input.placeholder = "0";

            input.dataset.row = i;
            input.dataset.col = j;
            input.dataset.matrix = matrixName;

            input.autocomplete = "off";

            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9./-]/g, "");
            });

            row.appendChild(input);
        }

        container.appendChild(row);
    }
}


/* ==========================================
   READ NUMBERS
========================================== */

function parseNumber(value) {

    value = value.trim();

    if (value === "") {
        return 0;
    }

    /* Fraction support: 3/4, -2/5 */
    if (value.includes("/")) {

        const parts = value.split("/");

        if (parts.length === 2) {

            const numerator = Number(parts[0]);
            const denominator = Number(parts[1]);

            if (
                !isNaN(numerator) &&
                !isNaN(denominator) &&
                denominator !== 0
            ) {
                return numerator / denominator;
            }
        }

        throw new Error("Invalid fraction: " + value);
    }

    const number = Number(value);

    if (isNaN(number)) {
        throw new Error("Invalid number: " + value);
    }

    return number;
}


/* ==========================================
   GET MATRIX
========================================== */

function getMatrix(matrixName) {

    const inputs = document.querySelectorAll(
        `.matrix-input[data-matrix="${matrixName}"]`
    );

    if (inputs.length === 0) {
        throw new Error(`Matrix ${matrixName} is empty.`);
    }

    const matrix = [];

    inputs.forEach(input => {

        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);

        if (!matrix[row]) {
            matrix[row] = [];
        }

        matrix[row][col] = parseNumber(input.value);
    });

    return matrix;
}


function getMatrixA() {
    return getMatrix("A");
}


function getMatrixB() {
    return getMatrix("B");
}


/* ==========================================
   CHECK SQUARE
========================================== */

function isSquare(matrix) {

    return (
        matrix.length > 0 &&
        matrix.every(row => row.length === matrix.length)
    );
}


/* ==========================================
   GCD
========================================== */

function gcd(a, b) {

    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));

    while (b !== 0) {

        const temp = a % b;

        a = b;
        b = temp;
    }

    return a || 1;
}


/* ==========================================
   FRACTION
========================================== */

function toFraction(value) {

    if (Math.abs(value) < 1e-10) {
        return "0";
    }

    if (Math.abs(value - Math.round(value)) < 1e-10) {
        return String(Math.round(value));
    }

    const sign = value < 0 ? "-" : "";

    let number = Math.abs(value);

    let bestNumerator = 0;
    let bestDenominator = 1;
    let bestError = Infinity;

    for (let denominator = 1; denominator <= 10000; denominator++) {

        const numerator = Math.round(number * denominator);

        const error = Math.abs(
            number - numerator / denominator
        );

        if (error < bestError) {

            bestError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
        }

        if (error < 1e-10) {
            break;
        }
    }

    const divisor = gcd(
        bestNumerator,
        bestDenominator
    );

    bestNumerator /= divisor;
    bestDenominator /= divisor;

    if (bestDenominator === 1) {
        return sign + bestNumerator;
    }

    return `
        <span class="fraction">
            <span class="numerator">${sign}${bestNumerator}</span>
            <span class="denominator">${bestDenominator}</span>
        </span>
    `;
}


/* ==========================================
   CLEAN NUMBER
========================================== */

function cleanNumber(value) {

    if (Math.abs(value) < 1e-10) {
        return 0;
    }

    return value;
}


/* ==========================================
   DETERMINANT
========================================== */

function determinant(matrix) {

    const n = matrix.length;

    if (n === 1) {
        return matrix[0][0];
    }

    if (n === 2) {

        return cleanNumber(
            matrix[0][0] * matrix[1][1] -
            matrix[0][1] * matrix[1][0]
        );
    }

    let det = 0;

    for (let col = 0; col < n; col++) {

        const minor = matrix
            .slice(1)
            .map(row =>
                row.filter((_, index) => index !== col)
            );

        const sign = col % 2 === 0 ? 1 : -1;

        det +=
            sign *
            matrix[0][col] *
            determinant(minor);
    }

    return cleanNumber(det);
}


/* ==========================================
   INVERSE
========================================== */

function inverse(matrix) {

    const n = matrix.length;

    if (!isSquare(matrix)) {
        return null;
    }

    let augmented = matrix.map((row, i) => [

        ...row,

        ...Array.from(
            { length: n },
            (_, j) => i === j ? 1 : 0
        )

    ]);


    for (let col = 0; col < n; col++) {

        let pivotRow = col;

        for (let row = col + 1; row < n; row++) {

            if (
                Math.abs(augmented[row][col]) >
                Math.abs(augmented[pivotRow][col])
            ) {
                pivotRow = row;
            }
        }


        if (
            Math.abs(augmented[pivotRow][col]) <
            1e-10
        ) {
            return null;
        }


        [
            augmented[col],
            augmented[pivotRow]
        ] = [
            augmented[pivotRow],
            augmented[col]
        ];


        const pivot = augmented[col][col];


        for (let j = 0; j < 2 * n; j++) {

            augmented[col][j] /= pivot;
        }


        for (let row = 0; row < n; row++) {

            if (row === col) {
                continue;
            }

            const factor = augmented[row][col];

            for (let j = 0; j < 2 * n; j++) {

                augmented[row][j] -=
                    factor * augmented[col][j];
            }
        }
    }


    return augmented.map(row =>
        row.slice(n).map(cleanNumber)
    );
}


/* ==========================================
   TRANSPOSE
========================================== */

function transpose(matrix) {

    return matrix[0].map((_, column) =>
        matrix.map(row => row[column])
    );
}


/* ==========================================
   ADDITION
========================================== */

function addMatrices(A, B) {

    return A.map((row, i) =>
        row.map((value, j) =>
            cleanNumber(value + B[i][j])
        )
    );
}


/* ==========================================
   SUBTRACTION
========================================== */

function subtractMatrices(A, B) {

    return A.map((row, i) =>
        row.map((value, j) =>
            cleanNumber(value - B[i][j])
        )
    );
}


/* ==========================================
   MULTIPLICATION
========================================== */

function multiplyMatrices(A, B) {

    const result = [];

    for (let i = 0; i < A.length; i++) {

        const row = [];

        for (let j = 0; j < B[0].length; j++) {

            let sum = 0;

            for (let k = 0; k < B.length; k++) {

                sum += A[i][k] * B[k][j];
            }

            row.push(cleanNumber(sum));
        }

        result.push(row);
    }

    return result;
}


/* ==========================================
   DISPLAY MATRIX
========================================== */

function displayMatrix(matrix) {

    return `
        <div class="result-matrix">

            ${matrix.map(row => `

                <div class="result-row">

                    ${row.map(value => `

                        <div class="result-value">
                            ${toFraction(value)}
                        </div>

                    `).join("")}

                </div>

            `).join("")}

        </div>
    `;
}


/* ==========================================
   SHOW RESULT
========================================== */

function showResult(title, content) {

    document.getElementById("result").innerHTML = `

        <div class="result-box">

            <div class="result-title">
                ${title}
            </div>

            ${content}

        </div>
    `;
}


/* ==========================================
   ERROR
========================================== */

function showError(message) {

    document.getElementById("result").innerHTML = `

        <div class="result-box">

            <div class="error">
                ❌ ${message}
            </div>

        </div>
    `;
}


/* ==========================================
   DETERMINANT
========================================== */

function calculateDeterminant() {

    try {

        const A = getMatrixA();

        if (!isSquare(A)) {

            showError(
                "Determinant requires a square matrix."
            );

            return;
        }

        const det = determinant(A);

        showResult(

            "🔢 Determinant of Matrix A",

            `
                <p class="info">
                    det(A) =
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    margin-top:15px;
                ">
                    ${toFraction(det)}
                </div>
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   INVERSE
========================================== */

function calculateInverse() {

    try {

        const A = getMatrixA();

        if (!isSquare(A)) {

            showError(
                "Inverse requires a square matrix."
            );

            return;
        }

        const det = determinant(A);


        if (Math.abs(det) < 1e-10) {

            showResult(

                "❌ Inverse Does Not Exist",

                `
                    <p class="error">
                        Determinant = 0
                    </p>

                    <p style="margin-top:10px;color:#aeb8d1;">
                        Since det(A) = 0, the inverse of A does not exist.
                    </p>
                `
            );

            return;
        }


        const result = inverse(A);


        if (!result) {

            showError(
                "Inverse does not exist."
            );

            return;
        }


        showResult(

            "✅ Inverse of Matrix A",

            `
                <p class="success">
                    Inverse exists because det(A) ≠ 0
                </p>

                <p style="
                    margin-top:8px;
                    color:#aeb8d1;
                ">
                    Determinant = ${toFraction(det)}
                </p>

                <h3 style="margin-top:20px;">
                    A⁻¹ =
                </h3>

                ${displayMatrix(result)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   SQUARE
========================================== */

function calculateSquare() {

    try {

        const A = getMatrixA();

        if (!isSquare(A)) {

            showError(
                "A² requires a square matrix."
            );

            return;
        }

        const result =
            multiplyMatrices(A, A);

        showResult(

            "² Matrix Square — A²",

            `
                <p class="info">
                    A² = A × A
                </p>

                ${displayMatrix(result)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   TRANSPOSE
========================================== */

function calculateTranspose() {

    try {

        const A = getMatrixA();

        const result =
            transpose(A);

        showResult(

            "↕️ Transpose — Aᵀ",

            `
                ${displayMatrix(result)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   SHOW MATRIX B
========================================== */

function showMatrixB() {

    document
        .getElementById("matrixBCard")
        .classList.remove("hidden");
}


/* ==========================================
   ADDITION
========================================== */

function prepareAddition() {

    if (currentOperation === "addition") {

        calculateAddition();

        return;
    }

    const A = getMatrixA();

    showMatrixB();

    document.getElementById("rowsB").value =
        A.length;

    document.getElementById("colsB").value =
        A[0].length;

    createMatrixB();

    currentOperation = "addition";

    showResult(

        "➕ Enter Matrix B",

        `
            <p class="info">
                Enter Matrix B and click
                <strong>Addition</strong> again.
            </p>
        `
    );
}


/* ==========================================
   CALCULATE ADDITION
========================================== */

function calculateAddition() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        if (
            A.length !== B.length ||
            A[0].length !== B[0].length
        ) {

            showError(
                "Matrix A and B must have the same dimensions."
            );

            return;
        }

        const result =
            addMatrices(A, B);

        showResult(
            "➕ A + B",
            displayMatrix(result)
        );

        currentOperation = null;

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   SUBTRACTION
========================================== */

function prepareSubtraction() {

    if (currentOperation === "subtraction") {

        calculateSubtraction();

        return;
    }

    const A = getMatrixA();

    showMatrixB();

    document.getElementById("rowsB").value =
        A.length;

    document.getElementById("colsB").value =
        A[0].length;

    createMatrixB();

    currentOperation = "subtraction";

    showResult(

        "➖ Enter Matrix B",

        `
            <p class="info">
                Enter Matrix B and click
                <strong>Subtraction</strong> again.
            </p>
        `
    );
}


/* ==========================================
   CALCULATE SUBTRACTION
========================================== */

function calculateSubtraction() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        if (
            A.length !== B.length ||
            A[0].length !== B[0].length
        ) {

            showError(
                "Matrix A and B must have the same dimensions."
            );

            return;
        }

        const result =
            subtractMatrices(A, B);

        showResult(
            "➖ A − B",
            displayMatrix(result)
        );

        currentOperation = null;

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   MULTIPLICATION
========================================== */

function prepareMultiplication() {

    if (currentOperation === "multiplication") {

        calculateMultiplication();

        return;
    }

    const A = getMatrixA();

    showMatrixB();

    document.getElementById("rowsB").value =
        A[0].length;

    document.getElementById("colsB").value =
        A.length;

    createMatrixB();

    currentOperation = "multiplication";

    showResult(

        "✖️ Enter Matrix B",

        `
            <p class="info">
                For multiplication:
            </p>

            <p style="margin-top:8px;color:#aeb8d1;">
                Columns of A must equal rows of B.
            </p>

            <p style="margin-top:8px;color:#aeb8d1;">
                Matrix B is currently
                ${A[0].length} × ${A.length}.
            </p>

            <p style="margin-top:8px;color:#aeb8d1;">
                Enter Matrix B and click
                <strong>Multiplication</strong> again.
            </p>
        `
    );
}


/* ==========================================
   CALCULATE MULTIPLICATION
========================================== */

function calculateMultiplication() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        if (A[0].length !== B.length) {

            showError(
                `Multiplication not possible. Columns of A (${A[0].length}) must equal rows of B (${B.length}).`
            );

            return;
        }

        const result =
            multiplyMatrices(A, B);

        showResult(
            "✖️ A × B",
            displayMatrix(result)
        );

        currentOperation = null;

    } catch (error) {

        showError(error.message);
    }
}


/* ==========================================
   CLEAR RESULT
========================================== */

function clearResult() {

    document.getElementById("result").innerHTML = `

        <div class="empty-result">

            <div class="empty-icon">
                ∑
            </div>

            <h3>
                Your result will appear here
            </h3>

            <p>
                Enter a matrix and select an operation above.
            </p>

        </div>
    `;
}
