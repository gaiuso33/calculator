

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) { 
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }    
    return a / b;
} 
function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            throw new Error("Invalid operator");
    }
}

function clear() {
    display.value = "";
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
}

function updateDisplay() {
    display.value = firstOperand !== null ? firstOperand : "";      
    if (currentOperator) {
        display.value += ` ${currentOperator} `;
    }
    if (secondOperand !== null) {
        display.value += secondOperand;
    }
}

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let isResultDisplayed = false;
let lastButtonType = null;
let lastKeyType = null;
let lastKey = null;
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;
        if (!isNaN(value)) {
            if (currentOperator === null) {
                firstOperand = firstOperand === null ? value : firstOperand + value;
            } else {
                secondOperand = secondOperand === null ? value : secondOperand + value;
            }
        } else if (value === "C") {
            clear();
        } else if (value === "=") {
            if (firstOperand !== null && currentOperator !== null && secondOperand !== null) {
                const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
                display.value = result;
                firstOperand = result.toString();
                secondOperand = null;
                currentOperator = null;
            }       } 
            else {
            if (currentOperator === null) {
                currentOperator = value;
            } else {
                clear();
                currentOperator = value;
            }
        }
        updateDisplay();
    });
});

function handleKeyPress(event) {
    const key = event.key; 
    if (!isNaN(key)) {
        if (currentOperator === null) {
            firstOperand = firstOperand === null ? key : firstOperand + key;
        } else {
            secondOperand = secondOperand === null ? key : secondOperand + key;
        }
    } else if (key === "Enter") {
        if (firstOperand !== null && currentOperator !== null && secondOperand !== null) {
            const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
            display.value = result;
            firstOperand = result.toString();
            secondOperand = null;
            currentOperator = null;
        }
    } else if (key === "Escape") {
        clear();
    } else if (["+", "-", "*", "/"].includes(key)) {
        if (currentOperator === null) {
            currentOperator = key;
        } else {
            clear();
            currentOperator = key;
        }
    }
    updateDisplay();
}
document.addEventListener("keydown", handleKeyPress);
document.addEventListener("DOMContentLoaded", () => {
    display.value = "";
});     
