const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let firstValue = "";
let secondValue = "";
let operator = null;
let shouldResetDisplay = false;

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return "lmao no 😒"; // divide by 0 snark
  return a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return null;
  }
}

function formatResult(value) {
  if (typeof value === "string") return value; // error message
  // limit long decimals / overflow
  const str = String(value);
  if (str.length <= 12) return str;

  // If it's a float, round to fit
  if (!Number.isInteger(value)) {
    return value.toPrecision(10).replace(/\.?0+$/, "");
  }
  // big integer: show scientific-ish
  return value.toExponential(6);
}

function updateDisplay(text) {
  display.textContent = text;
}

function getActiveValue() {
  return operator === null ? firstValue : secondValue;
}

function setActiveValue(newVal) {
  if (operator === null) firstValue = newVal;
  else secondValue = newVal;
}

function appendDigit(digit) {
  if (shouldResetDisplay) {
    // start fresh after result
    firstValue = "";
    secondValue = "";
    operator = null;
    shouldResetDisplay = false;
  }

  let current = getActiveValue();

  // prevent leading zeros like 0002 (allow "0." though)
  if (current === "0" && digit === "0") return;
  if (current === "0" && digit !== ".") current = "";

  current += digit;
  setActiveValue(current);
  updateDisplay(current || "0");
}

function addDecimal() {
  if (shouldResetDisplay) {
    firstValue = "";
    secondValue = "";
    operator = null;
    shouldResetDisplay = false;
  }

  let current = getActiveValue();
  if (current.includes(".")) return;
  if (current === "") current = "0";
  current += ".";
  setActiveValue(current);
  updateDisplay(current);
}

function clearAll() {
  firstValue = "";
  secondValue = "";
  operator = null;
  shouldResetDisplay = false;
  updateDisplay("0");
}

function backspace() {
  if (shouldResetDisplay) return; // ignore after result; user should type new digit
  let current = getActiveValue();
  current = current.slice(0, -1);
  setActiveValue(current);
  updateDisplay(current || "0");
}

function evaluateIfPossible() {
  if (firstValue === "" || operator === null || secondValue === "") return null;

  const a = Number(firstValue);
  const b = Number(secondValue);
  const result = operate(operator, a, b);

  const formatted = formatResult(result);
  updateDisplay(formatted);

  // If error message, reset completely so user can continue clean
  if (typeof result === "string") {
    firstValue = "";
    secondValue = "";
    operator = null;
    shouldResetDisplay = true;
    return result;
  }

  // store result for chaining
  firstValue = String(result);
  secondValue = "";
  return result;
}

function handleOperator(nextOp) {
  // If user pressed operator without a first number, ignore
  if (firstValue === "") return;

  // If they already have secondValue, compute first then continue chain
  if (operator !== null && secondValue !== "") {
    evaluateIfPossible();
  }

  // Consecutive operator presses: just replace operator (no evaluation)
  operator = nextOp;
  shouldResetDisplay = false;
}

function equals() {
  const res = evaluateIfPossible();
  if (res !== null) shouldResetDisplay = true;
}

buttons.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const digit = btn.dataset.digit;
  const op = btn.dataset.operator;
  const action = btn.dataset.action;

  if (digit !== undefined) return appendDigit(digit);
  if (op !== undefined) return handleOperator(op);

  if (action === "clear") return clearAll();
  if (action === "backspace") return backspace();
  if (action === "decimal") return addDecimal();
  if (action === "equals") return equals();
});

// Extra credit: keyboard support (basic)
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key >= "0" && key <= "9") appendDigit(key);
  else if (key === ".") addDecimal();
  else if (key === "Enter" || key === "=") equals();
  else if (key === "Backspace") backspace();
  else if (key === "Escape") clearAll();
  else if (["+", "-", "*", "/"].includes(key)) handleOperator(key);
});




// javascript 2
// function add(a, b) {
//   return a + b;
// }
// function subtract(a, b) {
//     return a - b;
// }
// function multiply(a, b) {
//     return a * b;
// }
// function divide(a, b) { 
//     if (b === 0) {
//         throw new Error("Cannot divide by zero");
//     }    
//     return a / b;
// } 
// function operate(operator, a, b) {
//     switch (operator) {
//         case "+":
//             return add(a, b);
//         case "-":
//             return subtract(a, b);
//         case "*":
//             return multiply(a, b);
//         case "/":
//             return divide(a, b);
//         default:
//             throw new Error("Invalid operator");
//     }
// }

// function clear() {
//     display.value = "";
//     firstOperand = null;
//     secondOperand = null;
//     currentOperator = null;
// }

// function updateDisplay() {
//     display.value = firstOperand !== null ? firstOperand : "";      
//     if (currentOperator) {
//         display.value += ` ${currentOperator} `;
//     }
//     if (secondOperand !== null) {
//         display.value += secondOperand;
//     }
// }

// const display = document.getElementById("display");
// const buttons = document.querySelectorAll(".button");
// let firstOperand = null;
// let secondOperand = null;
// let currentOperator = null;
// let isResultDisplayed = false;
// let lastButtonType = null;
// let lastKeyType = null;
// let lastKey = null;
// buttons.forEach(button => {
//     button.addEventListener("click", () => {
//         const value = button.textContent;
//         if (!isNaN(value)) {
//             if (currentOperator === null) {
//                 firstOperand = firstOperand === null ? value : firstOperand + value;
//             } else {
//                 secondOperand = secondOperand === null ? value : secondOperand + value;
//             }
//         } else if (value === "C") {
//             clear();
//         } else if (value === "=") {
//             if (firstOperand !== null && currentOperator !== null && secondOperand !== null) {
//                 const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
//                 display.value = result;
//                 firstOperand = result.toString();
//                 secondOperand = null;
//                 currentOperator = null;
//             }       } 
//             else {
//             if (currentOperator === null) {
//                 currentOperator = value;
//             } else {
//                 clear();
//                 currentOperator = value;
//             }
//         }
//         updateDisplay();
//     });
// });

// function handleKeyPress(event) {
//     const key = event.key; 
//     if (!isNaN(key)) {
//         if (currentOperator === null) {
//             firstOperand = firstOperand === null ? key : firstOperand + key;
//         } else {
//             secondOperand = secondOperand === null ? key : secondOperand + key;
//         }
//     } else if (key === "Enter") {
//         if (firstOperand !== null && currentOperator !== null && secondOperand !== null) {
//             const result = operate(currentOperator, parseFloat(firstOperand), parseFloat(secondOperand));
//             display.value = result;
//             firstOperand = result.toString();
//             secondOperand = null;
//             currentOperator = null;
//         }
//     } else if (key === "Escape") {
//         clear();
//     } else if (["+", "-", "*", "/"].includes(key)) {
//         if (currentOperator === null) {
//             currentOperator = key;
//         } else {
//             clear();
//             currentOperator = key;
//         }
//     }
//     updateDisplay();
// }
// document.addEventListener("keydown", handleKeyPress);
// document.addEventListener("DOMContentLoaded", () => {
//     display.value = "";
// });     
