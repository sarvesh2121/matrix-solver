let currentOperation = null;


/* =========================
   MATRIX CREATION
========================= */

function createMatrixA() {

    const rows = getNumber("rowsA");
    const cols = getNumber("colsA");

    const container = document.getElementById("matrixA");

    container.innerHTML = "";

    container.style.gridTemplateColumns =
        `repeat(${cols}, 72px)`;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "text";
            input.inputMode = "decimal";
            input.className = "matrix-input";
            input.placeholder = "0";

            input.addEventListener("input", updateMatrixInfo);

            container.appendChild(input);
        }
    }

    updateMatrixInfo();
}


/* =========================
   MATRIX B
========================= */

function createMatrixB() {

    const rows = getNumber("rowsB");
    const cols = getNumber("colsB");

    const container = document.getElementById("matrixB");

    container.innerHTML = "";

    container.style.gridTemplateColumns =
        `repeat(${cols}, 72px)`;

    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            const input = document.createElement("input");

            input.type = "text";
            input.inputMode = "decimal";
            input.className = "matrix-input";
            input.placeholder = "0";

            container.appendChild(input);
        }
    }
}


/* =========================
   GET MATRIX
========================= */

function getMatrix(id, rowsId, colsId) {

    const rows = getNumber(rowsId);
    const cols = getNumber(colsId);

    const inputs =
        document.querySelectorAll(`#${id} .matrix-input`);

    const matrix = [];

    let index = 0;

    for (let i = 0; i < rows; i++) {

        const row = [];

        for (let j = 0; j < cols; j++) {

            let value = inputs[index].value.trim();

            if (value === "") value = "0";

            const number = Number(value);

            if (!Number.isFinite(number)) {
                throw new Error(
                    `Invalid value at row ${i + 1}, column ${j + 1}.`
                );
            }

            row.push(number);

            index++;
        }

        matrix.push(row);
    }

    return matrix;
}


function getMatrixA() {
    return getMatrix("matrixA", "rowsA", "colsA");
}


function getMatrixB() {
    return getMatrix("matrixB", "rowsB", "colsB");
}


/* =========================
   NUMBER
========================= */

function getNumber(id) {

    let value =
        parseInt(document.getElementById(id).value);

    if (!Number.isFinite(value) || value < 1) {
        value = 1;
    }

    if (value > 10) value = 10;

    return value;
}


/* =========================
   DETERMINANT
========================= */

function determinant(matrix) {

    const n = matrix.length;

    if (n === 1) {
        return matrix[0][0];
    }

    if (n === 2) {

        return (
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

        det +=
            matrix[0][col] *
            Math.pow(-1, col) *
            determinant(minor);
    }

    return det;
}


/* =========================
   DETERMINANT EXPLANATION
========================= */

function determinantExplanation(matrix) {

    const n = matrix.length;

    let html = `
        <div class="steps">

            <div class="step">
                <span class="step-number">1</span>
                <div>
                    <h3>Given Matrix</h3>
                    ${displayMatrix(matrix)}
                </div>
            </div>
    `;


    /* ---------- 1 × 1 ---------- */

    if (n === 1) {

        html += `
            <div class="step">
                <span class="step-number">2</span>
                <div>
                    <h3>Determinant</h3>
                    <p>
                        det(A) = ${formatNumber(matrix[0][0])}
                    </p>
                </div>
            </div>
        `;

        return html + `</div>`;
    }


    /* ---------- 2 × 2 ---------- */

    if (n === 2) {

        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];

        const ad = a * d;
        const bc = b * c;
        const det = ad - bc;


        html += `
            <div class="step">
                <span class="step-number">2</span>

                <div>
                    <h3>Use the 2 × 2 determinant formula</h3>

                    <div class="formula">
                        det(A) = ad − bc
                    </div>

                    <p>
                        det(A)
                        = (${formatNumber(a)} × ${formatNumber(d)})
                        −
                        (${formatNumber(b)} × ${formatNumber(c)})
                    </p>

                    <p>
                        = ${formatNumber(ad)}
                        −
                        ${formatNumber(bc)}
                    </p>

                    <p class="final-line">
                        det(A) = ${formatNumber(det)}
                    </p>
                </div>
            </div>
        `;

        return html + `</div>`;
    }


    /* ---------- 3 × 3 ---------- */

    if (n === 3) {

        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[0][2];

        const d = matrix[1][0];
        const e = matrix[1][1];
        const f = matrix[1][2];

        const g = matrix[2][0];
        const h = matrix[2][1];
        const i = matrix[2][2];


        const term1 =
            a * (e * i - f * h);

        const term2 =
            b * (d * i - f * g);

        const term3 =
            c * (d * h - e * g);

        const det =
            term1 - term2 + term3;


        html += `
            <div class="step">
                <span class="step-number">2</span>

                <div>

                    <h3>Expand along the first row</h3>

                    <div class="formula">
                        det(A)
                        = a(ei − fh)
                        − b(di − fg)
                        + c(dh − eg)
                    </div>

                </div>
            </div>


            <div class="step">
                <span class="step-number">3</span>

                <div>

                    <h3>Substitute the values</h3>

                    <p>
                        det(A)
                        =
                        ${formatNumber(a)}
                        (${formatNumber(e)}×${formatNumber(i)}
                        −
                        ${formatNumber(f)}×${formatNumber(h)})
                    </p>

                    <p>
                        −
                        ${formatNumber(b)}
                        (${formatNumber(d)}×${formatNumber(i)}
                        −
                        ${formatNumber(f)}×${formatNumber(g)})
                    </p>

                    <p>
                        +
                        ${formatNumber(c)}
                        (${formatNumber(d)}×${formatNumber(h)}
                        −
                        ${formatNumber(e)}×${formatNumber(g)})
                    </p>

                </div>
            </div>


            <div class="step">
                <span class="step-number">4</span>

                <div>

                    <h3>Calculate the three terms</h3>

                    <p>
                        Term 1 = ${formatNumber(term1)}
                    </p>

                    <p>
                        Term 2 = ${formatNumber(term2)}
                    </p>

                    <p>
                        Term 3 = ${formatNumber(term3)}
                    </p>

                </div>
            </div>


            <div class="step">
                <span class="step-number">5</span>

                <div>

                    <h3>Final calculation</h3>

                    <div class="formula">
                        det(A)
                        =
                        ${formatNumber(term1)}
                        −
                        ${formatNumber(term2)}
                        +
                        ${formatNumber(term3)}
                    </div>

                    <p class="final-line">
                        det(A) = ${formatNumber(det)}
                    </p>

                </div>
            </div>
        `;

        return html + `</div>`;
    }


    /* ---------- Larger matrices ---------- */

    const det = determinant(matrix);

    html += `
        <div class="step">
            <span class="step-number">2</span>

            <div>

                <h3>Cofactor expansion</h3>

                <p>
                    The determinant is calculated by expanding
                    along the first row using cofactors.
                </p>

                <div class="formula">
                    det(A) = Σ a₁ⱼC₁ⱼ
                </div>

                <p>
                    For this ${n} × ${n} matrix, the same
                    cofactor-expansion process is applied
                    recursively to the smaller minors.
                </p>

            </div>
        </div>


        <div class="step">
            <span class="step-number">3</span>

            <div>

                <h3>Calculated determinant</h3>

                <p class="final-line">
                    det(A) = ${formatNumber(det)}
                </p>

            </div>
        </div>
    `;


    return html + `</div>`;
}


/* =========================
   INVERSE
========================= */

function inverse(matrix) {

    const n = matrix.length;

    if (matrix.some(row => row.length !== n)) {
        return null;
    }

    const augmented =
        matrix.map((row, i) => [

            ...row,

            ...Array.from(
                { length: n },
                (_, j) => i === j ? 1 : 0
            )

        ]);


    for (let col = 0; col < n; col++) {

        let pivot = col;

        for (let row = col + 1; row < n; row++) {

            if (
                Math.abs(augmented[row][col])
                >
                Math.abs(augmented[pivot][col])
            ) {
                pivot = row;
            }
        }


        if (Math.abs(augmented[pivot][col]) < 1e-10) {
            return null;
        }


        [augmented[col], augmented[pivot]] =
            [augmented[pivot], augmented[col]];


        const pivotValue =
            augmented[col][col];


        for (let j = 0; j < 2 * n; j++) {

            augmented[col][j] /= pivotValue;
        }


        for (let row = 0; row < n; row++) {

            if (row === col) continue;

            const factor =
                augmented[row][col];

            for (let j = 0; j < 2 * n; j++) {

                augmented[row][j] -=
                    factor * augmented[col][j];
            }
        }
    }


    return augmented.map(row =>
        row.slice(n)
    );
}


/* =========================
   INVERSE WITH STEPS
========================= */

function inverseWithSteps(matrix) {

    const n = matrix.length;

    const augmented =
        matrix.map((row, i) => [

            ...row,

            ...Array.from(
                { length: n },
                (_, j) => i === j ? 1 : 0
            )

        ]);


    const steps = [];


    steps.push({
        operation: "Start with the augmented matrix [ A | I ]",
        matrix: cloneMatrix(augmented)
    });


    for (let col = 0; col < n; col++) {

        let pivot = col;


        for (let row = col + 1; row < n; row++) {

            if (
                Math.abs(augmented[row][col])
                >
                Math.abs(augmented[pivot][col])
            ) {

                pivot = row;
            }
        }


        if (Math.abs(augmented[pivot][col]) < 1e-10) {

            return null;
        }


        /* Row swap */

        if (pivot !== col) {

            [augmented[col], augmented[pivot]] =
                [augmented[pivot], augmented[col]];


            steps.push({
                operation:
                    `R${col + 1} ↔ R${pivot + 1}`,
                matrix:
                    cloneMatrix(augmented)
            });
        }


        /* Make pivot = 1 */

        const pivotValue =
            augmented[col][col];


        if (Math.abs(pivotValue - 1) > 1e-10) {

            for (let j = 0; j < 2 * n; j++) {

                augmented[col][j] /=
                    pivotValue;
            }


            steps.push({
                operation:
                    `R${col + 1} → R${col + 1} ÷ ${formatNumber(pivotValue)}`,

                matrix:
                    cloneMatrix(augmented)
            });
        }


        /* Eliminate column */

        for (let row = 0; row < n; row++) {

            if (row === col) continue;


            const factor =
                augmented[row][col];


            if (Math.abs(factor) < 1e-10) {
                continue;
            }


            for (let j = 0; j < 2 * n; j++) {

                augmented[row][j] -=
                    factor * augmented[col][j];
            }


            const sign =
                factor >= 0 ? "−" : "+";

            const amount =
                Math.abs(factor);


            steps.push({

                operation:
                    `R${row + 1} → R${row + 1} ${sign} ${formatNumber(amount)}R${col + 1}`,

                matrix:
                    cloneMatrix(augmented)
            });
        }
    }


    return {
        inverse:
            augmented.map(row =>
                row.slice(n)
            ),

        steps
    };
}


/* =========================
   CLONE MATRIX
========================= */

function cloneMatrix(matrix) {

    return matrix.map(row => [...row]);
}


/* =========================
   DISPLAY AUGMENTED MATRIX
========================= */

function displayAugmentedMatrix(matrix) {

    const totalCols = matrix[0].length;

    let html = `
        <div
            class="result-matrix augmented-matrix"
            style="
                grid-template-columns:
                repeat(${totalCols}, minmax(55px, 1fr));
            "
        >
    `;


    matrix.forEach((row, rowIndex) => {

        row.forEach((value, colIndex) => {

            const separator =
                colIndex === matrix.length
                ? " augmented-separator"
                : "";


            html += `
                <div class="result-cell${separator}">
                    ${formatNumber(value)}
                </div>
            `;
        });
    });


    html += "</div>";

    return html;
}


/* =========================
   SQUARE
========================= */

function square(matrix) {

    return multiplyMatrices(matrix, matrix);
}


/* =========================
   TRANSPOSE
========================= */

function transpose(matrix) {

    return matrix[0].map(
        (_, col) =>
            matrix.map(row => row[col])
    );
}


/* =========================
   ADDITION
========================= */

function addMatrices(A, B) {

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {
        return null;
    }

    return A.map((row, i) =>
        row.map(
            (value, j) =>
                value + B[i][j]
        )
    );
}


/* =========================
   SUBTRACTION
========================= */

function subtractMatrices(A, B) {

    if (
        A.length !== B.length ||
        A[0].length !== B[0].length
    ) {
        return null;
    }

    return A.map((row, i) =>
        row.map(
            (value, j) =>
                value - B[i][j]
        )
    );
}


/* =========================
   MULTIPLICATION
========================= */

function multiplyMatrices(A, B) {

    if (A[0].length !== B.length) {
        return null;
    }

    const result =
        Array.from(
            { length: A.length },
            () =>
                Array(B[0].length).fill(0)
        );


    for (let i = 0; i < A.length; i++) {

        for (let j = 0; j < B[0].length; j++) {

            for (let k = 0; k < B.length; k++) {

                result[i][j] +=
                    A[i][k] * B[k][j];
            }
        }
    }

    return result;
}


/* =========================
   FORMAT
========================= */

function formatNumber(number) {

    if (Math.abs(number) < 1e-10) {
        number = 0;
    }

    return Number(
        number.toFixed(6)
    );
}


/* =========================
   DISPLAY MATRIX
========================= */

function displayMatrix(matrix) {

    const rows = matrix.length;
    const cols = matrix[0].length;

    let html = `
        <div
            class="result-matrix"
            style="
                grid-template-columns:
                repeat(${cols}, minmax(60px, 1fr));
            "
        >
    `;


    matrix.forEach(row => {

        row.forEach(value => {

            html += `
                <div class="result-cell">
                    ${formatNumber(value)}
                </div>
            `;
        });
    });


    html += "</div>";

    return html;
}


/* =========================
   RESULT
========================= */

function showResult(title, content) {

    document.getElementById("resultTitle")
        .textContent = title;

    document.getElementById("resultContent")
        .innerHTML = content;

    document.getElementById("resultCard")
        .classList.remove("hidden");

    document.getElementById("resultCard")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


/* =========================
   LIVE INFO
========================= */

function updateMatrixInfo() {

    try {

        const A = getMatrixA();

        const rows = A.length;
        const cols = A[0].length;


        document.getElementById("matrixSize")
            .textContent =
            `${rows} × ${cols}`;


        if (rows === cols) {

            const det =
                determinant(A);


            document.getElementById("detValue")
                .textContent =
                formatNumber(det);


            if (Math.abs(det) > 1e-10) {

                document.getElementById("inverseStatus")
                    .textContent =
                    "✓ Exists";

                document.getElementById("inverseStatus")
                    .className =
                    "success";

            } else {

                document.getElementById("inverseStatus")
                    .textContent =
                    "✕ Does not exist";

                document.getElementById("inverseStatus")
                    .className =
                    "error";
            }

        } else {

            document.getElementById("detValue")
                .textContent =
                "Not square";

            document.getElementById("inverseStatus")
                .textContent =
                "Not possible";

            document.getElementById("inverseStatus")
                .className =
                "warning";
        }

    } catch {

        document.getElementById("detValue")
            .textContent = "—";

        document.getElementById("inverseStatus")
            .textContent =
            "Check input";
    }
}


/* =========================
   DETERMINANT RESULT
========================= */

function calculateDeterminant() {

    try {

        const A = getMatrixA();


        if (A.length !== A[0].length) {

            showResult(
                "Determinant",
                `
                    <p class="error">
                        ✕ Determinant is defined only
                        for a square matrix.
                    </p>
                `
            );

            return;
        }


        const det =
            determinant(A);


        showResult(
            "Step-by-Step Determinant",
            `
                <h3>
                    Final Answer:
                    det(A) = ${formatNumber(det)}
                </h3>

                ${determinantExplanation(A)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   INVERSE RESULT
========================= */

function calculateInverse() {

    try {

        const A = getMatrixA();


        if (A.length !== A[0].length) {

            showResult(
                "Inverse of Matrix A",
                `
                    <p class="error">
                        ✕ Inverse does not exist because
                        Matrix A is not square.
                    </p>
                `
            );

            return;
        }


        const det =
            determinant(A);


        /* STEP 1: CHECK DETERMINANT */

        if (Math.abs(det) < 1e-10) {

            showResult(
                "Inverse of Matrix A",
                `
                    <div class="step">

                        <span class="step-number">1</span>

                        <div>

                            <h3>Find determinant</h3>

                            <p>
                                det(A) =
                                ${formatNumber(det)}
                            </p>

                        </div>

                    </div>


                    <div class="step">

                        <span class="step-number">2</span>

                        <div>

                            <h3 class="error">
                                ✕ Inverse Does Not Exist
                            </h3>

                            <p class="result-note">

                                Since det(A) = 0,
                                Matrix A is singular.

                                Therefore,

                                <strong>
                                    A⁻¹ does not exist.
                                </strong>

                            </p>

                        </div>

                    </div>
                `
            );

            return;
        }


        const result =
            inverseWithSteps(A);


        if (!result) {

            showResult(
                "Inverse of Matrix A",
                `
                    <p class="error">
                        ✕ Inverse could not be calculated.
                    </p>
                `
            );

            return;
        }


        let html = `

            <div class="step">

                <span class="step-number">1</span>

                <div>

                    <h3>Find determinant</h3>

                    <p>
                        det(A) =
                        ${formatNumber(det)}
                    </p>

                    <p class="success">
                        ✓ Since det(A) ≠ 0,
                        the inverse exists.
                    </p>

                </div>

            </div>


            <div class="step">

                <span class="step-number">2</span>

                <div>

                    <h3>Form the augmented matrix</h3>

                    <p class="result-note">
                        Write the identity matrix beside A:
                    </p>

                    ${displayAugmentedMatrix(
                        A.map((row, i) => [
                            ...row,
                            ...Array.from(
                                {length: A.length},
                                (_, j) =>
                                    i === j ? 1 : 0
                            )
                        ])
                    )}

                </div>

            </div>
        `;


        result.steps.forEach((step, index) => {

            html += `

                <div class="step">

                    <span class="step-number">
                        ${index + 3}
                    </span>

                    <div>

                        <h3>
                            ${step.operation}
                        </h3>

                        ${displayAugmentedMatrix(
                            step.matrix
                        )}

                    </div>

                </div>
            `;
        });


        html += `

            <div class="step final-step">

                <span class="step-number">
                    ✓
                </span>

                <div>

                    <h3>
                        Final Inverse Matrix
                    </h3>

                    <p class="result-note">
                        When the left side becomes
                        the identity matrix I,
                        the right side is A⁻¹.
                    </p>

                    ${displayMatrix(
                        result.inverse
                    )}

                    <p class="final-line">
                        Therefore,
                        A⁻¹ =
                    </p>

                    ${displayMatrix(
                        result.inverse
                    )}

                </div>

            </div>
        `;


        showResult(
            "Step-by-Step Inverse",
            html
        );


    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   A²
========================= */

function calculateSquare() {

    try {

        const A = getMatrixA();

        if (A.length !== A[0].length) {

            showResult(
                "A² — Matrix Square",
                `
                    <p class="error">
                        Matrix square A² is possible
                        only for a square matrix.
                    </p>
                `
            );

            return;
        }


        const result =
            square(A);


        showResult(
            "A² — Matrix Square",
            `
                <p class="result-note">
                    A² = A × A
                </p>

                ${displayMatrix(result)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   TRANSPOSE
========================= */

function calculateTranspose() {

    try {

        const A = getMatrixA();

        const result =
            transpose(A);


        showResult(
            "Transpose of Matrix A",
            `
                <p class="result-note">
                    Rows of A become columns in Aᵀ.
                </p>

                ${displayMatrix(result)}
            `
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   ADDITION
========================= */

function prepareAddition() {

    currentOperation = "addition";

    showMatrixB();

    document.getElementById("rowsB").value =
        document.getElementById("rowsA").value;

    document.getElementById("colsB").value =
        document.getElementById("colsA").value;

    createMatrixB();

    document.getElementById("matrixBSection")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


function calculateAddition() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        const result =
            addMatrices(A, B);


        if (!result) {

            showResult(
                "Matrix Addition",
                `
                    <p class="error">
                        ✕ Both matrices must have
                        the same dimensions.
                    </p>
                `
            );

            return;
        }


        showResult(
            "A + B — Matrix Addition",
            displayMatrix(result)
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   SUBTRACTION
========================= */

function prepareSubtraction() {

    currentOperation = "subtraction";

    showMatrixB();

    document.getElementById("rowsB").value =
        document.getElementById("rowsA").value;

    document.getElementById("colsB").value =
        document.getElementById("colsA").value;

    createMatrixB();
}


function calculateSubtraction() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        const result =
            subtractMatrices(A, B);


        if (!result) {

            showResult(
                "Matrix Subtraction",
                `
                    <p class="error">
                        ✕ Both matrices must have
                        the same dimensions.
                    </p>
                `
            );

            return;
        }


        showResult(
            "A − B — Matrix Subtraction",
            displayMatrix(result)
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   MULTIPLICATION
========================= */

function prepareMultiplication() {

    currentOperation = "multiplication";

    showMatrixB();

    document.getElementById("rowsB").value =
        document.getElementById("colsA").value;

    document.getElementById("colsB").value = 2;

    createMatrixB();

    document.getElementById("matrixBSection")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


function calculateMultiplication() {

    try {

        const A = getMatrixA();
        const B = getMatrixB();

        const result =
            multiplyMatrices(A, B);


        if (!result) {

            showResult(
                "Matrix Multiplication",
                `
                    <p class="error">
                        ✕ Number of columns of A
                        must equal number of rows of B.
                    </p>
                `
            );

            return;
        }


        showResult(
            "A × B — Matrix Multiplication",
            displayMatrix(result)
        );

    } catch (error) {

        showError(error.message);
    }
}


/* =========================
   MATRIX B
========================= */

function showMatrixB() {

    document.getElementById("matrixBSection")
        .classList.remove("hidden");
}


/* =========================
   CLEAR
========================= */

function clearResult() {

    document.getElementById("resultCard")
        .classList.add("hidden");

    document.getElementById("resultContent")
        .innerHTML = "";
}


/* =========================
   ERROR
========================= */

function showError(message) {

    showResult(
        "Input Error",
        `
            <p class="error">
                ✕ ${message}
            </p>
        `
    );
}


/* =========================
   OPERATION LISTENER
========================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".operation-grid button"
            );

        if (!button) return;


        const text =
            button.innerText.toLowerCase();


        if (
            currentOperation === "addition" &&
            text.includes("addition")
        ) {

            calculateAddition();

            currentOperation = null;
        }


        else if (
            currentOperation === "subtraction" &&
            text.includes("subtraction")
        ) {

            calculateSubtraction();

            currentOperation = null;
        }


        else if (
            currentOperation === "multiplication" &&
            text.includes("multiplication")
        ) {

            calculateMultiplication();

            currentOperation = null;
        }

    }
);


/* =========================
   START
========================= */

createMatrixA();
