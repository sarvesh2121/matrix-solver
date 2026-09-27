/* =========================================
   MATRIX SOLVER
   Cij - Mij METHOD
========================================= */


/* =========================================
   MATRIX A
========================================= */

function createMatrixA() {

    const rows = Number(document.getElementById("rowsA").value);
    const cols = Number(document.getElementById("colsA").value);

    const container = document.getElementById("matrixA");

    container.innerHTML = "";

    container.style.gridTemplateColumns =
        `repeat(${cols}, 68px)`;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.className = "matrix-input";

            input.placeholder = "0";

            input.dataset.row = i;
            input.dataset.col = j;

            input.addEventListener("input", updateMatrixStatus);

            container.appendChild(input);
        }
    }

    updateMatrixStatus();
}


/* =========================================
   GET MATRIX A
========================================= */

function getMatrixA() {

    const rows = Number(document.getElementById("rowsA").value);
    const cols = Number(document.getElementById("colsA").value);

    const inputs =
        document.querySelectorAll("#matrixA input");

    const matrix = [];

    let index = 0;

    for (let i = 0; i < rows; i++) {

        const row = [];

        for (let j = 0; j < cols; j++) {

            const value =
                parseFloat(inputs[index].value);

            row.push(
                Number.isFinite(value) ? value : 0
            );

            index++;
        }

        matrix.push(row);
    }

    return matrix;
}


/* =========================================
   MATRIX B
========================================= */

function createMatrixB() {

    const rows = Number(document.getElementById("rowsB").value);
    const cols = Number(document.getElementById("colsB").value);

    const container =
        document.getElementById("matrixB");

    container.innerHTML = "";

    container.style.gridTemplateColumns =
        `repeat(${cols}, 68px)`;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";

            input.className = "matrix-input";

            input.placeholder = "0";

            container.appendChild(input);
        }
    }
}


function getMatrixB() {

    const rows = Number(document.getElementById("rowsB").value);
    const cols = Number(document.getElementById("colsB").value);

    const inputs =
        document.querySelectorAll("#matrixB input");

    const matrix = [];

    let index = 0;

    for (let i = 0; i < rows; i++) {

        const row = [];

        for (let j = 0; j < cols; j++) {

            const value =
                parseFloat(inputs[index].value);

            row.push(
                Number.isFinite(value) ? value : 0
            );

            index++;
        }

        matrix.push(row);
    }

    return matrix;
}


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(value) {

    if (Math.abs(value) < 1e-10) {
        return "0";
    }

    return Number(value.toFixed(6)).toString();
}


/* =========================================
   MATRIX VALIDATION
========================================= */

function isSquare(matrix) {

    return matrix.length > 0 &&
           matrix.length === matrix[0].length;
}


/* =========================================
   MINOR Mij
========================================= */

function getMinor(matrix, row, col) {

    return matrix
        .filter((_, i) => i !== row)
        .map(r =>
            r.filter((_, j) => j !== col)
        );
}


/* =========================================
   DETERMINANT
   INTERNAL CALCULATION
========================================= */

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

    for (let j = 0; j < n; j++) {

        const minor =
            getMinor(matrix, 0, j);

        const minorDet =
            determinant(minor);

        const cofactor =
            Math.pow(-1, j) * minorDet;

        det +=
            matrix[0][j] * cofactor;
    }

    return det;
}


/* =========================================
   Cij
========================================= */

function getCofactor(matrix, row, col) {

    const minor =
        getMinor(matrix, row, col);

    return (
        Math.pow(-1, row + col) *
        determinant(minor)
    );
}


/* =========================================
   MATRIX DISPLAY HTML
========================================= */

function matrixHTML(matrix) {

    const rows = matrix.length;
    const cols = matrix[0].length;

    let html =
        `<div class="result-matrix"
              style="grid-template-columns:repeat(${cols},minmax(60px,1fr))">`;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            html += `
                <div class="result-cell">
                    ${formatNumber(matrix[i][j])}
                </div>
            `;
        }
    }

    html += `</div>`;

    return html;
}


/* =========================================
   MINOR MATRIX HTML
========================================= */

function minorHTML(matrix, row, col) {

    const minor =
        getMinor(matrix, row, col);

    return matrixHTML(minor);
}


/* =========================================
   SHOW RESULT
========================================= */

function showResult(title, content) {

    const card =
        document.getElementById("resultCard");

    const titleElement =
        document.getElementById("resultTitle");

    const contentElement =
        document.getElementById("resultContent");

    titleElement.textContent = title;

    contentElement.innerHTML = content;

    card.classList.remove("hidden");

    card.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================
   DETERMINANT
   C11 / M11 METHOD
========================================= */

function calculateDeterminant() {

    const matrix = getMatrixA();

    if (!isSquare(matrix)) {

        showResult(
            "Determinant",
            `
            <div class="error-message">
                ❌ Determinant can be calculated only
                for a square matrix.
            </div>
            `
        );

        return;
    }

    const n = matrix.length;

    const det = determinant(matrix);

    let html = `
        <div class="calculation-intro">
            <strong>Determinant using C<sub>ij</sub> and M<sub>ij</sub> method</strong>

            <p>
                Expand the determinant along the first row:
            </p>

            <div class="formula">
                |A| =
                a<sub>11</sub>C<sub>11</sub>
                +
                a<sub>12</sub>C<sub>12</sub>
                +
                ...
            </div>
        </div>
    `;


    /* =====================================
       1 × 1
    ===================================== */

    if (n === 1) {

        html += `
            <div class="step">
                <div class="step-number">1</div>

                <div>
                    <h3>Single element</h3>

                    <p>
                        |A| = ${formatNumber(matrix[0][0])}
                    </p>

                    <p class="final-line">
                        ∴ |A| = ${formatNumber(det)}
                    </p>
                </div>
            </div>
        `;
    }


    /* =====================================
       2 × 2
    ===================================== */

    else if (n === 2) {

        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];

        const M11 = d;
        const M12 = c;

        const C11 = M11;
        const C12 = -M12;

        html += `

            <div class="step">

                <div class="step-number">
                    1
                </div>

                <div>

                    <h3>Find M₁₁</h3>

                    <p>
                        Delete row 1 and column 1.
                    </p>

                    <div class="formula">
                        M₁₁ = ${formatNumber(d)}
                    </div>

                </div>

            </div>


            <div class="step">

                <div class="step-number">
                    2
                </div>

                <div>

                    <h3>Find C₁₁</h3>

                    <div class="formula">
                        C₁₁ = (−1)¹⁺¹ M₁₁
                        = ${formatNumber(C11)}
                    </div>

                </div>

            </div>


            <div class="step">

                <div class="step-number">
                    3
                </div>

                <div>

                    <h3>Find M₁₂ and C₁₂</h3>

                    <div class="formula">
                        M₁₂ = ${formatNumber(c)}
                        <br>
                        C₁₂ = (−1)¹⁺² M₁₂
                        = ${formatNumber(C12)}
                    </div>

                </div>

            </div>


            <div class="step">

                <div class="step-number">
                    4
                </div>

                <div>

                    <h3>Calculate determinant</h3>

                    <div class="formula">
                        |A| =
                        (${formatNumber(a)})(${formatNumber(C11)})
                        +
                        (${formatNumber(b)})(${formatNumber(C12)})
                    </div>

                    <p class="final-line">
                        ∴ |A| = ${formatNumber(det)}
                    </p>

                </div>

            </div>
        `;
    }


    /* =====================================
       3 × 3 AND ABOVE
    ===================================== */

    else {

        let expansion = "";

        for (let j = 0; j < n; j++) {

            const minor =
                getMinor(matrix, 0, j);

            const M =
                determinant(minor);

            const C =
                Math.pow(-1, j) * M;

            const element =
                matrix[0][j];

            expansion += `
                <div class="cofactor-card">

                    <div class="cofactor-title">
                        M<sub>1${j + 1}</sub>
                        &nbsp; and &nbsp;
                        C<sub>1${j + 1}</sub>
                    </div>

                    <p>
                        M<sub>1${j + 1}</sub>
                        =
                    </p>

                    ${minorHTML(matrix, 0, j)}

                    <div class="formula">

                        M<sub>1${j + 1}</sub>
                        =
                        ${formatNumber(M)}

                        <br><br>

                        C<sub>1${j + 1}</sub>
                        =
                        (−1)¹⁺${j + 1}
                        M<sub>1${j + 1}</sub>

                        =
                        ${formatNumber(C)}

                    </div>

                    <p>
                        a<sub>1${j + 1}</sub>
                        C<sub>1${j + 1}</sub>
                        =
                        (${formatNumber(element)})
                        (${formatNumber(C)})
                        =
                        ${formatNumber(element * C)}
                    </p>

                </div>
            `;
        }


        html += `

            <div class="step">

                <div class="step-number">
                    1
                </div>

                <div>

                    <h3>
                        Find M₁₁ and C₁₁
                    </h3>

                    <p>
                        Delete the first row and first column
                        to obtain M₁₁.
                    </p>

                    ${minorHTML(matrix, 0, 0)}

                    <div class="formula">

                        M₁₁ =
                        ${formatNumber(
                            determinant(
                                getMinor(matrix,0,0)
                            )
                        )}

                        <br>

                        C₁₁ =
                        (−1)¹⁺¹M₁₁
                        =
                        ${formatNumber(
                            getCofactor(matrix,0,0)
                        )}

                    </div>

                </div>

            </div>


            <div class="step">

                <div class="step-number">
                    2
                </div>

                <div>

                    <h3>
                        Find all M₁ⱼ and C₁ⱼ
                    </h3>

                    ${expansion}

                </div>

            </div>


            <div class="step">

                <div class="step-number">
                    3
                </div>

                <div>

                    <h3>
                        Expand along the first row
                    </h3>

                    <div class="formula">

                        |A| =
                        ${matrix[0].map(
                            (_,j) =>
                            `a<sub>1${j+1}</sub>
                             C<sub>1${j+1}</sub>`
                        ).join(" + ")}

                    </div>

                    <div class="formula">

                        |A| =
                        ${matrix[0].map(
                            (value,j) => {

                                const C =
                                    getCofactor(
                                        matrix,
                                        0,
                                        j
                                    );

                                return `
                                    (${formatNumber(value)})
                                    (${formatNumber(C)})
                                `;
                            }
                        ).join(" + ")}

                    </div>

                    <p class="final-line">

                        ∴ |A| = ${formatNumber(det)}

                    </p>

                </div>

            </div>
        `;
    }


    html += `

        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                det(A) = ${formatNumber(det)}
            </strong>

        </div>
    `;


    showResult(
        "Determinant — Cij / Mij Method",
        html
    );


    document.getElementById("detValue").textContent =
        formatNumber(det);


    const inverseStatus =
        document.getElementById("inverseStatus");

    if (det === 0) {

        inverseStatus.textContent =
            "Does not exist";

        inverseStatus.className =
            "error";

    } else {

        inverseStatus.textContent =
            "Exists ✓";

        inverseStatus.className =
            "success";
    }
}


/* =========================================
   INVERSE
   ADJOINT / COFACTOR METHOD
========================================= */

function calculateInverse() {

    const matrix = getMatrixA();

    if (!isSquare(matrix)) {

        showResult(
            "Inverse",
            `
            <div class="error-message">
                ❌ Inverse exists only for a square matrix.
            </div>
            `
        );

        return;
    }


    const det = determinant(matrix);


    if (Math.abs(det) < 1e-10) {

        showResult(
            "Inverse Does Not Exist",
            `

            <div class="not-exist-box">

                <div class="big-cross">
                    ✕
                </div>

                <h3>
                    Inverse does not exist
                </h3>

                <p>
                    The determinant of the matrix is zero.
                </p>

                <div class="formula">
                    det(A) = 0
                </div>

                <p>
                    Since det(A) = 0,
                    the matrix is singular.
                </p>

                <p class="final-line">
                    Therefore, A⁻¹ does not exist.
                </p>

            </div>

            `
        );

        document.getElementById(
            "inverseStatus"
        ).textContent = "Does not exist";

        document.getElementById(
            "inverseStatus"
        ).className = "error";

        return;
    }


    const n = matrix.length;

    const cofactorMatrix = [];

    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {

            row.push(
                getCofactor(matrix, i, j)
            );
        }

        cofactorMatrix.push(row);
    }


    const adjoint = transpose(cofactorMatrix);


    const inverse = adjoint.map(
        row =>
            row.map(
                value => value / det
            )
    );


    let html = `

        <div class="calculation-intro">

            <strong>
                Inverse using Adjoint / Cofactor Method
            </strong>

            <div class="formula">
                A⁻¹ = 1 / |A| × adj(A)
            </div>

            <p>
                First check whether the inverse exists.
            </p>

            <div class="answer-box compact">

                <span>DETERMINANT</span>

                <strong>
                    |A| = ${formatNumber(det)} ≠ 0
                </strong>

                <small>
                    Therefore, inverse exists ✓
                </small>

            </div>

        </div>


        <div class="step">

            <div class="step-number">
                1
            </div>

            <div>

                <h3>
                    Find the minor matrix
                </h3>

                <p>
                    Find M<sub>ij</sub> for every element.
                </p>

                <div class="minor-grid">
    `;


    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            const M =
                determinant(
                    getMinor(matrix,i,j)
                );

            html += `
                <div class="mini-cofactor">

                    <strong>
                        M<sub>${i+1}${j+1}</sub>
                    </strong>

                    <span>
                        ${formatNumber(M)}
                    </span>

                </div>
            `;
        }
    }


    html += `
                </div>

            </div>

        </div>


        <div class="step">

            <div class="step-number">
                2
            </div>

            <div>

                <h3>
                    Find the cofactor matrix
                </h3>

                <div class="formula">
                    C<sub>ij</sub>
                    =
                    (−1)<sup>i+j</sup>
                    M<sub>ij</sub>
                </div>

                ${matrixHTML(cofactorMatrix)}

            </div>

        </div>


        <div class="step">

            <div class="step-number">
                3
            </div>

            <div>

                <h3>
                    Find the adjoint
                </h3>

                <p>
                    Adjoint is the transpose of the
                    cofactor matrix.
                </p>

                <div class="formula">
                    adj(A) = [C]
                    <sup>T</sup>
                </div>

                ${matrixHTML(adjoint)}

            </div>

        </div>


        <div class="step">

            <div class="step-number">
                4
            </div>

            <div>

                <h3>
                    Calculate inverse
                </h3>

                <div class="formula">
                    A⁻¹ =
                    1 / ${formatNumber(det)}
                    × adj(A)
                </div>

                ${matrixHTML(inverse)}

            </div>

        </div>


        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                A⁻¹ =
            </strong>

            ${matrixHTML(inverse)}

        </div>
    `;


    showResult(
        "Inverse — Adjoint / Cofactor Method",
        html
    );


    document.getElementById(
        "inverseStatus"
    ).textContent = "Exists ✓";

    document.getElementById(
        "inverseStatus"
    ).className = "success";
}


/* =========================================
   TRANSPOSE
========================================= */

function transpose(matrix) {

    return matrix[0].map(
        (_, col) =>
            matrix.map(
                row => row[col]
            )
    );
}


function calculateTranspose() {

    const matrix = getMatrixA();

    const result = transpose(matrix);

    showResult(
        "Transpose",
        `

        <div class="calculation-intro">

            <strong>
                Transpose of Matrix A
            </strong>

            <p>
                Rows become columns and columns become rows.
            </p>

        </div>

        ${matrixHTML(result)}

        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                Aᵀ calculated successfully ✓
            </strong>

        </div>

        `
    );
}


/* =========================================
   MATRIX SQUARE
========================================= */

function calculateSquare() {

    const matrix = getMatrixA();

    if (!isSquare(matrix)) {

        showResult(
            "Matrix Square",
            `
            <div class="error-message">
                ❌ A² can only be calculated for a square matrix.
            </div>
            `
        );

        return;
    }


    const result =
        multiplyMatrices(matrix, matrix);


    showResult(
        "Matrix Square — A²",
        `

        <div class="calculation-intro">

            <strong>
                Matrix Square
            </strong>

            <div class="formula">
                A² = A × A
            </div>

        </div>


        <div class="step">

            <div class="step-number">
                1
            </div>

            <div>

                <h3>
                    Multiply A by A
                </h3>

                ${matrixHTML(matrix)}

                <div class="formula">
                    A² = A × A
                </div>

            </div>

        </div>


        <div class="step">

            <div class="step-number">
                2
            </div>

            <div>

                <h3>
                    Result
                </h3>

                ${matrixHTML(result)}

            </div>

        </div>


        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                A² = A × A
            </strong>

            ${matrixHTML(result)}

        </div>

        `
    );
}


/* =========================================
   MATRIX MULTIPLICATION
========================================= */

function multiplyMatrices(A, B) {

    const result = [];

    for (let i = 0; i < A.length; i++) {

        const row = [];

        for (let j = 0; j < B[0].length; j++) {

            let sum = 0;

            for (let k = 0; k < B.length; k++) {

                sum +=
                    A[i][k] * B[k][j];
            }

            row.push(sum);
        }

        result.push(row);
    }

    return result;
}


/* =========================================
   ADDITION
========================================= */

function prepareAddition() {

    showMatrixB();

    const button =
        event.currentTarget;

    button.dataset.operation = "addition";

    button.innerHTML = `
        <span class="op-icon">✓</span>
        <span>
            <strong>Calculate A + B</strong>
            <small>Click again after entering B</small>
        </span>
        <span class="arrow">→</span>
    `;

    button.onclick = calculateAddition;
}


function calculateAddition() {

    const A = getMatrixA();
    const B = getMatrixB();

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {

        showResult(
            "Addition",
            `
            <div class="error-message">
                ❌ Both matrices must have the same order.
            </div>
            `
        );

        return;
    }


    const result =
        A.map(
            (row,i) =>
                row.map(
                    (value,j) =>
                        value + B[i][j]
                )
        );


    showResult(
        "Matrix Addition — A + B",
        `

        <div class="formula">
            A + B
        </div>

        ${matrixHTML(result)}

        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                A + B calculated ✓
            </strong>

        </div>
        `
    );
}


/* =========================================
   SUBTRACTION
========================================= */

function prepareSubtraction() {

    showMatrixB();

    const button =
        event.currentTarget;

    button.innerHTML = `
        <span class="op-icon">✓</span>
        <span>
            <strong>Calculate A − B</strong>
            <small>Click again after entering B</small>
        </span>
        <span class="arrow">→</span>
    `;

    button.onclick = calculateSubtraction;
}


function calculateSubtraction() {

    const A = getMatrixA();
    const B = getMatrixB();

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {

        showResult(
            "Subtraction",
            `
            <div class="error-message">
                ❌ Both matrices must have the same order.
            </div>
            `
        );

        return;
    }


    const result =
        A.map(
            (row,i) =>
                row.map(
                    (value,j) =>
                        value - B[i][j]
                )
        );


    showResult(
        "Matrix Subtraction — A − B",
        `

        <div class="formula">
            A − B
        </div>

        ${matrixHTML(result)}

        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                A − B calculated ✓
            </strong>

        </div>
        `
    );
}


/* =========================================
   MULTIPLICATION
========================================= */

function prepareMultiplication() {

    showMatrixB();

    const button =
        event.currentTarget;

    button.innerHTML = `
        <span class="op-icon">✓</span>
        <span>
            <strong>Calculate A × B</strong>
            <small>Click again after entering B</small>
        </span>
        <span class="arrow">→</span>
    `;

    button.onclick = calculateMultiplication;
}


function calculateMultiplication() {

    const A = getMatrixA();
    const B = getMatrixB();


    if (A[0].length !== B.length) {

        showResult(
            "Multiplication",
            `
            <div class="error-message">

                ❌ Matrix multiplication is not possible.

                <p>
                    Columns of A must equal rows of B.
                </p>

                <div class="formula">
                    ${A.length} × ${A[0].length}
                    &nbsp; × &nbsp;
                    ${B.length} × ${B[0].length}
                </div>

            </div>
            `
        );

        return;
    }


    const result =
        multiplyMatrices(A,B);


    showResult(
        "Matrix Multiplication — A × B",
        `

        <div class="formula">
            Columns of A = Rows of B
        </div>

        ${matrixHTML(result)}

        <div class="answer-box">

            <span>FINAL ANSWER</span>

            <strong>
                A × B calculated ✓
            </strong>

        </div>

        `
    );
}


/* =========================================
   SHOW MATRIX B
========================================= */

function showMatrixB() {

    const section =
        document.getElementById(
            "matrixBSection"
        );

    section.classList.remove("hidden");

    createMatrixB();

    section.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================
   CLEAR RESULT
========================================= */

function clearResult() {

    document
        .getElementById("resultCard")
        .classList.add("hidden");
}


/* =========================================
   MATRIX STATUS
========================================= */

function updateMatrixStatus() {

    const rows =
        document.getElementById("rowsA").value;

    const cols =
        document.getElementById("colsA").value;

    document.getElementById(
        "matrixSize"
    ).textContent =
        `${rows} × ${cols}`;


    const matrix = getMatrixA();

    if (isSquare(matrix)) {

        const det = determinant(matrix);

        document.getElementById(
            "detValue"
        ).textContent =
            formatNumber(det);

        const inverseStatus =
            document.getElementById(
                "inverseStatus"
            );

        if (Math.abs(det) < 1e-10) {

            inverseStatus.textContent =
                "Does not exist";

            inverseStatus.className =
                "error";

        } else {

            inverseStatus.textContent =
                "Exists ✓";

            inverseStatus.className =
                "success";
        }

    } else {

        document.getElementById(
            "detValue"
        ).textContent = "N/A";

        document.getElementById(
            "inverseStatus"
        ).textContent =
            "Not square";

        document.getElementById(
            "inverseStatus"
        ).className =
            "warning";
    }
}


/* =========================================
   INITIALIZE
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        createMatrixA();

    }
);
