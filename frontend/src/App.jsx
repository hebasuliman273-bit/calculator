import { useState } from "react";

function NumberButton(props) {
  return (
    <button onClick={() => props.onNumberClick(props.number)}>
      {props.number}
    </button>
  );
}

function OperatorButton(props) {
  return (
    <button onClick={() => props.onOperatorClick(props.operator)}>
      {props.operator}
    </button>
  );
}

function App() {

  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState(null);
  const [firstNumber, setFirstNumber] = useState(null);
  const [waitingForNumber, setWaitingForNumber] = useState(false);
  const [history, setHistory] = useState([]);
  const [expression, setExpression] = useState("");

  function handleDelete() {
    if (expression.length === 0) {
      return;
    }

    const newExpression = expression.slice(0, -1);

    setExpression(newExpression);

    if (
      newExpression.endsWith("+") ||
      newExpression.endsWith("-") ||
      newExpression.endsWith("*") ||
      newExpression.endsWith("/") ||
      newExpression.endsWith("%")
    ) {
      setDisplay("0");
      setWaitingForNumber(true);
    } else {
      const parts = parseExpression(newExpression);
      const lastPart = parts[parts.length - 1];

      setDisplay(String(lastPart));
      setWaitingForNumber(false);
    }
  }

  function calculate(number1, number2, operator) {
    if (operator === "+") {
      return number1 + number2;
    }

    if (operator === "-") {
      return number1 - number2;
    }

    if (operator === "*") {
      return number1 * number2;
    }

    if (operator === "/") {
      return number1 / number2;
    }

    if (operator === "%") {
      return number1 % number2;
    }
  }

  function handleClear() {
    setDisplay("0");
    setOperator(null);
    setFirstNumber(null);
    setWaitingForNumber(false);
    setExpression("");
  }

function handleParenthesis(parenthesis) {
  const openParentheses =
    (expression.match(/\(/g) || []).length;

  const closeParentheses =
    (expression.match(/\)/g) || []).length;

  if (parenthesis === ")" && openParentheses <= closeParentheses) {
    return;
  }

  setExpression(expression + parenthesis);
}

  function handleDownloadJson() {
    const jsonData = JSON.stringify(history, null, 2);

    const blob = new Blob([jsonData], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "history.json";

    link.click();

    URL.revokeObjectURL(url);
  }

  function handleDecimal() {
    const currentNumber = display;

    if (currentNumber.includes(".")) {
      return;
    }

    setDisplay(currentNumber + ".");
    setExpression(expression + ".");
  }

  function parseExpression(expression) {
  const parts = [];
  let currentNumber = "";

  for (let i = 0; i < expression.length; i++) {
    const character = expression[i];

    // السالب إذا كان علامة لرقم سالب
    if (
      character === "-" &&
      (
        i === 0 ||
        expression[i - 1] === "(" ||
        expression[i - 1] === "+" ||
        expression[i - 1] === "-" ||
        expression[i - 1] === "*" ||
        expression[i - 1] === "/" ||
        expression[i - 1] === "%"
      )
    ) {
      currentNumber = currentNumber + character;
      continue;
    }

    if (
      character === "+" ||
      character === "-" ||
      character === "*" ||
      character === "/" ||
      character === "%" ||
      character === "(" ||
      character === ")"
    ) {
      if (currentNumber !== "") {
        parts.push(Number(currentNumber));
        currentNumber = "";
      }

      parts.push(character);
    } else {
      currentNumber = currentNumber + character;
    }
  }

  if (currentNumber !== "") {
    parts.push(Number(currentNumber));
  }

  return parts;
}

  function handleCalculate() {
    // إذا كانت العملية محسوبة مسبقًا، لا نحسب مرة ثانية
    if (expression.includes("=")) {
      return;
    }

    // إذا انتهت العملية بـ operator، لا نحسب
    if (
      expression.endsWith("+") ||
      expression.endsWith("-") ||
      expression.endsWith("*") ||
      expression.endsWith("/") ||
      expression.endsWith("%")
    ) {
      return;
    }

    const parts = parseExpression(expression);

    const result = calculateExpression(parts);

    setDisplay(String(result));

    setHistory([
      ...history,
      {
        expression: expression,
        result: result
      }
    ]);

    setExpression(expression + "=" + result);
  }

  function handleNumber(number) {
    if (waitingForNumber) {
      setDisplay(number);
      setExpression(expression + number);
      setWaitingForNumber(false);
    } else if (display === "0") {
      setDisplay(number);
      setExpression(number);
    } else {
      setDisplay(display + number);
      setExpression(expression + number);
    }
  }

  function handleOperator(newOperator) {
    if (
      expression.endsWith("+") ||
      expression.endsWith("-") ||
      expression.endsWith("*") ||
      expression.endsWith("/") ||
      expression.endsWith("%")
    ) {
      const newExpression =
        expression.slice(0, -1) + newOperator;

      setExpression(newExpression);
    } else {
      setExpression(expression + newOperator);
    }

    setFirstNumber(display);
    setOperator(newOperator);
    setWaitingForNumber(true);
  }

  function handleClearHistory() {
    setHistory([]);
  }

  function calculateExpression(parts) {

    // أولًا نحسب ما داخل الأقواس
    while (parts.includes("(")) {
      const openIndex = parts.lastIndexOf("(");
      const closeIndex = parts.indexOf(")", openIndex);

      const inside = parts.slice(
        openIndex + 1,
        closeIndex
      );

      const result = calculateExpression(inside);

      parts.splice(
        openIndex,
        closeIndex - openIndex + 1,
        result
      );
    }

    // ثانيًا نحسب *, /, %
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];

      if (
        operator === "*" ||
        operator === "/" ||
        operator === "%"
      ) {
        const number1 = parts[i - 1];
        const number2 = parts[i + 1];

        const result = calculate(
          number1,
          number2,
          operator
        );

        parts.splice(i - 1, 3, result);

        i -= 2;
      }
    }

    // ثالثًا نحسب +, -
    let result = parts[0];

    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const number = parts[i + 1];

      result = calculate(
        result,
        number,
        operator
      );
    }

    return result;
  }

  return (
    <div className="calculator-container">

      <h1>Calculator</h1>

      <h2 className="display">
        {expression || "0"}
      </h2>

      <div className="buttons">

        <NumberButton
          number="0"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="1"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="2"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="3"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="4"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="5"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="6"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="7"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="8"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="9"
          onNumberClick={handleNumber}
        />

        <OperatorButton
          operator="+"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="-"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="*"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="/"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="%"
          onOperatorClick={handleOperator}
        />

        <button onClick={handleCalculate}>
          =
        </button>

        <button onClick={handleClear}>
          C
        </button>

        <button onClick={handleDecimal}>
          .
        </button>

        <button onClick={handleDelete}>
          ⌫
        </button>

      </div>

      <div className="buttons">

        <button onClick={() => handleParenthesis("(")}>
          (
        </button>

        <button onClick={() => handleParenthesis(")")}>
          )
        </button>

      </div>

      <div className="history-buttons">

        <button onClick={handleClearHistory}>
          Clear History
        </button>

        <button onClick={handleDownloadJson}>
          Download JSON
        </button>

      </div>

      <div className="history">

        <h2>History</h2>

        {history.map((item, index) => (
          <p className="history-item" key={index}>
            {item.expression} = {item.result}
          </p>
        ))}

      </div>

    </div>
  );
}

export default App;