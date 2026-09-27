/* ==========================================
   MATRIX SOLVER - FINAL JAVASCRIPT
========================================== */


/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    createMatrixA();

});


/* ==========================================
   MATRIX CREATION
========================================== */

function createMatrixA() {

    const rows = parseInt(document.getElementById("rowsA").value);
    const cols = parseInt(document.getElementById("colsA").value);

    createMatrixInputs("matrixA", rows, cols, "A");

}


function createMatrixB() {

    const rows = parseInt(document.getElementById("rowsB").value);
    const cols = parseInt(document.getElementById("colsB").value);

    createMatrixInputs("matrixB", rows, cols, "B");

}


function createMatrixInputs(containerId, rows, cols, matrixName) {

    const container = document.getElementById(containerId);

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

            row.appendChild(input);
        }

        container.appendChild(row);
    }
}


/* ==========================================
   READ MATRIX
========================================== */

function parseNumber(value) {

    value = value.trim();

    if (value === "") {
        return 0;
    }

    // Support fractions such as 3/4 and -5/2
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
    }

    const number = Number(value);

    if (isNaN(number)) {
        throw new Error(`Invalid value: ${value}`);
    }

    return number;
}


function getMatrix(matrixName) {

    const inputs = document.querySelectorAll(
        `.matrix-input[data-matrix="${matrixName}"]`
    );

    if (inputs.length === 0) {
        throw new Error(`Matrix ${matrixName} not found.`);
    }

    const rows = {};

    inputs.forEach(input => {

        const r = input.dataset.row;
        const c = input.dataset.col;

        if (!rows[r]) {
            rows[r] = [];
        }

        rows[r][c] = parseNumber(input.value);
    });

    return Object.values(rows);
}


function getMatrixA() {

    return getMatrix("A");

}


function getMatrixB() {

    return getMatrix("B");

}


/* ==========================================
   MATRIX VALIDATION
========================================== */

function isSquare(matrix) {

    return matrix.length > 0 &&
        matrix.every(row => row.length === matrix.length);

}


/* ==========================================
   GREATEST COMMON DIVISOR
========================================== */

function gcd(a, b) {

    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));

    while (b !== 0) {

        let temp = a % b;

        a = b;
        b = temp;
    }

    return a || 1;
}


/* ==========================================
   FRACTION CONVERTER
========================================== */

function toFraction(value) {

    if (Math.abs(value) < 1e-10) {
        return {
            type: "text",
            value: "0"
        };
    }


    // Integer
    if (Math.abs(value - Math.round(value)) < 1e-10) {

        return {
            type: "text",
            value: String(Math.round(value))
        };

    }


    const sign = value < 0 ? "-" : "";

    let x = Math.abs(value);

    let bestNumerator = 0;
    let bestDenominator = 1;
    let bestError = Infinity;


    // Find a simple fraction
    for (let denominator = 1; denominator <= 10000; denominator++) {

        const numerator = Math.round(x * denominator);

        const error =
            Math.abs(x - numerator / denominator);

        if (error < bestError) {

            bestError = error;

            bestNumerator = numerator;

            bestDenominator = denominator;
        }

        if (error < 1e-10) {
            break;
        }
    }


    const divisor =
        gcd(bestNumerator, bestDenominator);


    bestNumerator =
        bestNumerator / divisor;

    bestDenominator =
        bestDenominator / divisor;


    if (bestDenominator === 1) {

        return {
            type: "text",
            value: sign + bestNumerator
        };

    }


    return {

        type: "fraction",

        numerator: sign + bestNumerator,

        denominator: bestDenominator

    };

}


/* ==========================================
   FRACTION HTML
========================================== */

function fractionHTML(value) {

    const fraction = toFraction(value);


    if (fraction.type === "text") {

        return fraction.value;

    }


    return `
        <span class="fraction">
            <span class="numerator">${fraction.numerator}</span>
            <span class="denominator">${fraction.denominator}</span>
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

        return (
            matrix[0][0] * matrix[1][1]
            -
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


        const sign =
            col % 2 === 0 ? 1 : -1;


        det +=
            sign *
            matrix[0][col] *
            determinant(minor);

    }


    return cleanNumber(det);

}


/* ==========================================
   INVERSE
   GAUSS-JORDAN
========================================== */

function inverse(matrix) {

    const n = matrix.length;


    if (!isSquare(matrix)) {

        return null;

    }


    let augmented = matrix.map((row, i) => [

        ...row.map(Number),

        ...Array.from(
            { length: n },
            (_, j) => i === j ? 1 : 0
        )

    ]);


    for (let col = 0; col < n; col++) {


        // Find best pivot
        let pivotRow = col;


        for (let row = col + 1; row < n; row++) {

            if (
                Math.abs(augmented[row][col])
                >
                Math.abs(augmented[pivotRow][col])
            ) {

                pivotRow = row;

            }

        }


        // Singular matrix
        if (
            Math.abs(augmented[pivotRow][col])
            < 1e-10
        ) {

            return null;

        }


        // Swap rows
        [
            augmented[col],
            augmented[pivotRow]
        ] =
        [
            augmented[pivotRow],
            augmented[col]
        ];


        // Divide pivot row
        const pivot =
            augmented[col][col];


        for (let j = 0; j < 2 * n; j++) {

            augmented[col][j] /= pivot;

        }


        // Eliminate column
        for (let row = 0; row < n; row++) {

            if (row === col) {
                continue;
            }


            const factor =
                augmented[row][col];


            for (let j = 0; j < 2 * n; j++) {

                augmented[row][j]
                    -=
                    factor * augmented[col][j];

            }

        }

    }


    return augmented.map(row =>

        row
            .slice(n)
            .map(cleanNumber)

    );

}


/* ==========================================
   TRANSPOSE
========================================== */

function transpose(matrix) {

    return matrix[0].map((_, col) =>
        matrix.map(row => row[col])
    );

}


/* ==========================================
   ADDITION
========================================== */

function addMatrices(A, B) {

    return A.map((row, i) =>

        row.map((value, j) =>

            cleanNumber(
                value + B[i][j]
            )

        )

    );

}


/* ==========================================
   SUBTRACTION
========================================== */

function subtractMatrices(A, B) {

    return A.map((row, i) =>

        row.map((value, j) =>

            cleanNumber(
                value - B[i][j]
            )

        )

    );

}


/* ==========================================
   MULTIPLICATION
========================================== */

function multiplyMatrices(A, B) {

    const rowsA = A.length;

    const colsA = A[0].length;

    const colsB = B[0].length;


    const result = [];


    for (let i = 0; i < rowsA; i++) {

        const row = [];


        for (let j = 0; j < colsB; j++) {

            let sum = 0;


            for (let k = 0; k < colsA; k++) {

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

                            ${fractionHTML(value)}

                        </div>

                    `).join("")}

                </div>

            `).join("")}

        </div>

    `;

}


/* ==========================================
   RESULT HELPERS
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
   DETERMINANT BUTTON
========================================== */

function calculateDeterminant() {

    try {

        const A = getMatrixA();


        if (!isSquare(A)) {

            showError(
                "Determinant can only be calculated for a square matrix."
            );

            return;

        }


        const det = determinant(A);


        showResult(

            "🔢 Determinant of Matrix A",

            `
                <p class="info">det(A) =</p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    margin-top:15px;
                    color:#ffffff;
                ">
                    ${fractionHTML(det)}
                </div>
            `

        );

    }

    catch (error) {

        showError(error.message);

    }

}


/* ==========================================
   INVERSE BUTTON
========================================== */

function calculateInverse() {

    try {

        const A = getMatrixA();


        if (!isSquare(A)) {

            showError(
                "Inverse can only be calculated for a square matrix."
            );

            return;

        }


        const det = determinant(A);


        // No inverse
        if (Math.abs(det) < 1e-10) {

            showResult(

                "❌ Inverse Does Not Exist",

                `
                    <p class="error">
                        The matrix is singular.
                    </p>

                    <br>

                    <p>
                        Determinant = <strong>0</strong>
                    </p>

                    <p style="
                        margin-top:8px;
                        color:#9da8c5;
                    ">
                        Since det(A) = 0, A⁻¹ does not exist.
                    </p>
                `

            );

            return;

        }


        const inv = inverse(A);


        if (!inv) {

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
                    Determinant =
                    ${fractionHTML(det)}
                </p>

                <h3 style="
                    margin-top:20px;
                    margin-bottom:5px;
                ">
                    A⁻¹ =
                </h3>

                ${displayMatrix(inv)}
            `

        );

    }

    catch (error) {

        showError(error.message);

    }

}


/* ==========================================
   MATRIX SQUARE
========================================== */

function calculateSquare() {

    try {

        const A = getMatrixA();


        if (!isSquare(A)) {

            showError(
                "Matrix square A² requires a square matrix."
            );

            return;

        }


        const square =
            multiplyMatrices(A, A);


        showResult(

            "² Matrix Square",

            `
                <p class="info">
                    A² = A × A
                </p>

                ${displayMatrix(square)}
            `

        );

    }

    catch (error) {

        showError(error.message);

    }

}


/* ==========================================
   TRANSPOSE
========================================== */

function calculateTranspose() {

    try {

        const A = getMatrixA();

        const T = transpose(A);


        showResult(

            "↕️ Transpose of Matrix A",

            `
                <p class="info">
                    Aᵀ =
                </p>

                ${displayMatrix(T)}
            `

        );

    }

    catch (error) {

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

    showMatrixB();


    const A = getMatrixA();


    document.getElementById("rowsB").value =
        A.length;

    document.getElementById("colsB").value =
        A[0].length;


    createMatrixB();


    showResult(

        "➕ Matrix B Required",

        `
            <p class="info">
                Enter Matrix B with the same dimensions as Matrix A,
                then click <strong>Addition</strong> again.
            </p>
        `

    );


    window.currentOperation = "addition";

    changeOperationButton(
        "addition"
    );

}


/* ==========================================
   SUBTRACTION
========================================== */

function prepareSubtraction() {

    showMatrixB();


    const A = getMatrixA();


    document.getElementById("rowsB").value =
        A.length;

    document.getElementById("colsB").value =
        A[0].length;


    createMatrixB();


    showResult(

        "➖ Matrix B Required",

        `
            <p class="info">
                Enter Matrix B with the same dimensions as Matrix A,
                then click <strong>Subtraction</strong> again.
            </p>
        `

    );


    window.currentOperation = "subtraction";

    changeOperationButton(
        "subtraction"
    );

}


/* ==========================================
   MULTIPLICATION
========================================== */

function prepareMultiplication() {

    showMatrixB();


    const A = getMatrixA();


    // B rows must equal A columns
    document.getElementById("rowsB").value =
        A[0].length;


    // Default B columns = A rows
    document.getElementById("colsB").value =
        A.length;


    createMatrixB();


    showResult(

        "✖️ Matrix B Required",

        `
            <p class="info">
                For multiplication, columns of A must equal rows of B.
            </p>

            <p style="
                margin-top:8px;
                color:#aeb8d1;
            ">
                Matrix B is currently
                ${A[0].length} × ${A.length}.
            </p>

            <p style="
                margin-top:8px;
                color:#aeb8d1;
            ">
                Enter Matrix B and click
                <strong>Multiplication</strong> again.
            </p>
        `

    );


    window.currentOperation = "multiplication";

    changeOperationButton(
        "multiplication"
    );

}


/* ==========================================
   OPERATION BUTTON SECOND CLICK
========================================== */

function changeOperationButton(operation) {

    const buttons =
        document.querySelectorAll(".operation-btn");


    buttons.forEach(button => {

        const text =
            button.innerText.toLowerCase();


        if (
            (operation === "addition" &&
                text.includes("addition")) ||

            (operation === "subtraction" &&
                text.includes("subtraction")) ||

            (operation === "multiplication" &&
                text.includes("multiplication"))
        ) {

            button.classList.add("active-operation");

            button.dataset.ready = "true";

        }

    });

}


/* ==========================================
   HANDLE ADD / SUBTRACT / MULTIPLY
========================================== */

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(".operation-btn");


    if (!button) {
        return;
    }


    const text =
        button.innerText.toLowerCase();


    try {

        const A = getMatrixA();


        /* ADDITION */

        if (text.includes("addition")) {

            if (window.currentOperation !== "addition") {
                return;
            }


            const B = getMatrixB();


            if (
                A.length !== B.length ||
                A[0].length !== B[0].length
            ) {

                showError(
                    "For addition, Matrix A and Matrix B must have the same dimensions."
                );

                return;

            }


            const result =
                addMatrices(A, B);


            showResult(

                "➕ A + B",

                displayMatrix(result)

            );


            window.currentOperation = null;

        }


        /* SUBTRACTION */

        else if (text.includes("subtraction")) {

            if (
                window.currentOperation !==
                "subtraction"
            ) {
                return;
            }


            const B = getMatrixB();


            if (
                A.length !== B.length ||
                A[0].length !== B[0].length
            ) {

                showError(
                    "For subtraction, Matrix A and Matrix B must have the same dimensions."
                );

                return;

            }


            const result =
                subtractMatrices(A, B);


            showResult(

                "➖ A − B",

                displayMatrix(result)

            );


            window.currentOperation = null;

        }


        /* MULTIPLICATION */

        else if (text.includes("multiplication")) {

            if (
                window.currentOperation !==
                "multiplication"
            ) {
                return;
            }


            const B = getMatrixB();


            if (A[0].length !== B.length) {

                showError(

                    `Multiplication not possible. 
                    Columns of A (${A[0].length}) 
                    must equal rows of B (${B.length}).`

                );

                return;

            }


            const result =
                multiplyMatrices(A, B);


            showResult(

                "✖️ A × B",

                displayMatrix(result)

            );


            window.currentOperation = null;

        }

    }

    catch (error) {

        showError(error.message);

    }

});


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
