const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");

let currentOperand = "0";
let previousOperand = "";
let operation = null;
let shouldResetScreen = false;

// Update calculator display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;

    if (operation !== null) {
        previousOperandElement.textContent =
            `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = "";
    }
}

// Add numbers
function appendNumber(number) {
    if (currentOperand === "Error") {
        currentOperand = "0";
    }

    if (shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else {
        currentOperand =
            currentOperand === "0" ? number : currentOperand + number;
    }

    updateDisplay();
}

// Add decimal
function appendDecimal() {
    if (currentOperand === "Error" || shouldResetScreen) {
        currentOperand = "0";
        shouldResetScreen = false;
    }

    if (!currentOperand.includes(".")) {
        currentOperand += ".";
    }

    updateDisplay();
}

// Select operation
function chooseOperation(operator) {
    if (currentOperand === "Error") return;

    if (operation !== null && !shouldResetScreen) {
        calculate();
    }

    previousOperand = currentOperand;
    operation = operator;
    shouldResetScreen = true;

    updateDisplay();
}

// Perform calculation
function calculate() {
    if (operation === null || shouldResetScreen) return;

    const firstNumber = Number(previousOperand);
    const secondNumber = Number(currentOperand);

    let result;

    switch (operation) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":
            if (secondNumber === 0) {
                currentOperand = "Error";
                operation = null;
                previousOperand = "";
                shouldResetScreen = true;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentOperand = String(
        Number(result.toPrecision(12))
    );

    previousOperand = "";
    operation = null;
    shouldResetScreen = true;

    updateDisplay();
}

// Clear calculator
function clearCalculator() {
    currentOperand = "0";
    previousOperand = "";
    operation = null;
    shouldResetScreen = false;

    updateDisplay();
}

// Delete last digit
function deleteNumber() {
    if (currentOperand === "Error" || shouldResetScreen) {
        currentOperand = "0";
        shouldResetScreen = false;
    } else {
        currentOperand =
            currentOperand.length > 1
                ? currentOperand.slice(0, -1)
                : "0";

        if (currentOperand === "-") {
            currentOperand = "0";
        }
    }

    updateDisplay();
}

// Percentage
function calculatePercentage() {
    if (currentOperand === "Error") return;

    currentOperand = String(Number(currentOperand) / 100);
    updateDisplay();
}

// Positive and negative
function toggleSign() {
    if (currentOperand === "Error" || currentOperand === "0") return;

    currentOperand = currentOperand.startsWith("-")
        ? currentOperand.slice(1)
        : "-" + currentOperand;

    updateDisplay();
}

// Handle button clicks
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "decimal":
                appendDecimal();
                break;

            case "calculate":
                calculate();
                break;

            case "percent":
                calculatePercentage();
                break;

            case "sign":
                toggleSign();
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", event => {
    if (/^[0-9]$/.test(event.key)) {
        appendNumber(event.key);
    }

    if (event.key === ".") {
        appendDecimal();
    }

    if (event.key === "+") chooseOperation("+");
    if (event.key === "-") chooseOperation("-");
    if (event.key === "*") chooseOperation("×");

    if (event.key === "/") {
        event.preventDefault();
        chooseOperation("÷");
    }

    if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    if (event.key === "Backspace") {
        deleteNumber();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }
});

// Initial display
updateDisplay();